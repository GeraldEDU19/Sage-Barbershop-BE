import { PrismaClient, Reservation } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Obtener listado
export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id, branchId } = request.query;

  const filters: any = {};

  if (id) filters.id = parseInt(id.toString(), 10);
  if (branchId) filters.branchId = parseInt(branchId.toString(), 10);

  try {
    const list: Reservation[] = await prisma.reservation.findMany({
      where: filters,
      orderBy: {
        date: "desc",
      },
      include: {
        status: true,
        branch: true,
        service: true,
        User: true,
      },
    });
    response.json(list);
  } catch (error) {
    next(error);
  }
};

// Obtener por Id
export const getById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let id = request.query.id;
    if (!id) throw new Error("undefined ID");
    const idReservation = parseInt(id.toString());

    const objReservation = await prisma.reservation.findFirst({
      where: { id: idReservation },
      include: {
        status: true,
        branch: true,
        service: true,
        User: true,
      },
    });
    response.json(objReservation);
  } catch (error) {
    next(error);
  }
};

// Listado por sucursal
export const getByManager = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let id = request.query.id;
    if (!id) throw new Error("undefined ID");
    const idManager = parseInt(id.toString());

    const objManager = await prisma.user.findUnique({
      where: { id: idManager },
    });

    if (
      !objManager ||
      objManager.branchId === null ||
      objManager.branchId === undefined
    ) {
      return response
        .status(400)
        .json({ error: "Branch ID not found for user" });
    }

    const objReservation = await prisma.reservation.findMany({
      where: { branchId: objManager.branchId },
      orderBy: {
        date: "desc",
      },
      include: {
        status: true,
        branch: true,
        service: true,
        User: true,
      },
    });

    response.json(objReservation);
  } catch (error) {
    next(error);
  }
};

// Crear
export const create = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const reservationDate = new Date(body.datetime);
    console.log("🚀 ~ reservationDate:", reservationDate)

    // 1. Validar si la sucursal tiene un horario disponible en esa fecha
    const availableSchedule = await prisma.schedule.findFirst({
      where: {
        branchId: parseInt(body.branchId, 10),
        startDate: { lte: reservationDate },  // Fecha de inicio debe ser menor o igual que la fecha de reservación
        endDate: { gte: reservationDate },    // Fecha de fin debe ser mayor o igual que la fecha de reservación
        status: true, // Verifica que el horario esté activo
      },
    });
    
    
    if (!availableSchedule) {
      return response.status(400).json({
        error: "No available schedule for the specified date.",
      });
    }

    // 2. Obtener la duración del servicio
    const service = await prisma.service.findUnique({
      where: { id: parseInt(body.serviceId, 10) },
      select: { duration: true }, // Asumiendo que duration es un campo que representa la duración en minutos
    });

    if (!service) {
      return response.status(400).json({
        error: "Invalid service ID.",
      });
    }

    const reservationEndDate = new Date(reservationDate.getTime() + service.duration * 60000); // Suma la duración del servicio a la fecha de reserva

    // 3. Validar que la nueva reserva no choque con otra reserva existente
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        branchId: parseInt(body.branchId, 10),
        OR: [
          {
            date: {
              lte: reservationEndDate,
              gte: reservationDate,
            },
          },
          {
            date: {
              lt: reservationDate,
              gt: new Date(reservationDate.getTime() - service.duration * 60000),
            },
          },
        ],
      },
    });

    if (conflictingReservation) {
      return response.status(400).json({
        error: "The reservation conflicts with another existing reservation.",
      });
    }

    // 4. Crear la nueva reservación
    const newReservation = await prisma.reservation.create({
      data: {
        date: body.datetime,
        answer1: body.answer1,
        answer2: body.answer2,
        answer3: body.answer3,
        status: {
          connect: { id: parseInt(body.statusId, 10) },
        },
        branch: {
          connect: { id: parseInt(body.branchId, 10) },
        },
        service: {
          connect: { id: parseInt(body.serviceId, 10) },
        },
        User: {
          connect: { id: parseInt(body.userId, 10) },
        },
      },
    });

    response.json(newReservation);
  } catch (error) {
    next(error);
  }
};

export const getByBranchId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "Branch ID is required" });
  }

  try {
    const branchIdInt = parseInt(id.toString(), 10);
    console.log("🚀 ~ branchIdInt:", branchIdInt)

    const reservations: Reservation[] = await prisma.reservation.findMany({
      where: { branchId: branchIdInt },
      orderBy: {
        date: "desc",
      },
      include: {
        status: true,
        branch: true,
        service: true,
        User: true,
      },
    });

    if (reservations.length === 0) {
      return response.status(404).json({ message: "No reservations found for the given branch ID" });
    }

    response.json(reservations);
  } catch (error) {
    next(error);
  }
};

// Actualizar una reservación
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const idReservation = parseInt(body.id);

    // Obtener reservación vieja
    const oldReservation = await prisma.reservation.findUnique({
      where: { id: idReservation },
      include: {
        status: true,
        branch: true,
        service: true,
        User: true,
      },
    });

    if (!oldReservation) {
      return response.status(404).json({ message: "Reservation not found" });
    }

    const updatedReservation = await prisma.reservation.update({
      where: {
        id: idReservation,
      },
      data: {
        date: new Date(body.datetime),
        answer1: body.answer1,
        answer2: body.answer2,
        answer3: body.answer3,
        status: {
          connect: { id: parseInt(body.statusId, 10) },
        },
        branch: {
          connect: { id: parseInt(body.branchId, 10) },
        },
        service:{
              connect: { id: parseInt(body.serviceId, 10) },
            },
        User:{
              connect: { id: parseInt(body.userId, 10) },
            },
      },
    });
    response.json(updatedReservation);
  } catch (error) {
    next(error);
  }
};

// Filtrar por rango de fechas
export const getByDateRange = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { startDate, endDate, idManager } = request.query;

  if (!startDate || !endDate) {
    return response.status(400).json({ error: "Start date and end date are required" });
  }

  // Convert startDate and endDate to Date objects
  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  // Ensure end date is inclusive
  end.setDate(end.getDate() + 1);

  const filters: any = {
    date: {
      gte: start,
      lt: end,
    },
  };

  if (idManager) {
    const idManagerInt = parseInt(idManager.toString(), 10);
    const manager = await prisma.user.findUnique({
      where: { id: idManagerInt },
    });

    if (manager && manager.branchId !== null && manager.branchId !== undefined) {
      filters.branchId = manager.branchId;
    }
  }

  try {
    const list: Reservation[] = await prisma.reservation.findMany({
      where: filters,
      orderBy: {
        date: "desc",
      },
      include: {
        status: true,
        branch: true,
        service: true,
        User: true,
      },
    });
    response.json(list);
  } catch (error) {
    next(error);
  }
};


// Filtrar por nombre de cliente
export const getByClient = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const name = request.query.name?.toString();
  const idManager = request.query.idManager?.toString();

  if (!name) {
    return response.status(400).json({ error: "Client name is required" });
  }

  const filters: any = {
    OR: [
      { User: { name: { contains: name } } },
      { User: { surname: { contains: name } } },
    ],
  };

  if (idManager) {
    const idManagerInt = parseInt(idManager, 10);
    const manager = await prisma.user.findUnique({
      where: { id: idManagerInt },
    });

    if (manager && manager.branchId !== null && manager.branchId !== undefined) {
      filters.branchId = manager.branchId;
    }
  }

  try {
    const list: Reservation[] = await prisma.reservation.findMany({
      where: filters,
      orderBy: {
        date: "desc",
      },
      include: {
        status: true,
        branch: true,
        service: true,
        User: true,
      },
    });
    response.json(list);
  } catch (error) {
    next(error);
  }
};

// Obtener cantidad de citas por sucursal para el día actual
export const getTodayCountByBranch = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Obtener la fecha actual sin la hora
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00 para comparar solo la fecha

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // El día siguiente para el límite superior

    // Agrupar por branchId y contar las reservas
    const result = await prisma.reservation.groupBy({
      by: ['branchId'],
      where: {
        date: {
          gte: today, // Fecha mayor o igual a hoy
          lt: tomorrow, // Fecha menor a mañana (es decir, solo las de hoy)
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Obtener los nombres de las sucursales basados en los IDs agrupados
    const formattedResult = await Promise.all(
      result.map(async (item) => {
        const branch = await prisma.branch.findUnique({
          where: { id: item.branchId },
          select: { name: true },
        });
        return {
          branchName: branch?.name || "Unknown Branch",
          count: item._count.id,
        };
      })
    );

    response.json(formattedResult);
  } catch (error) {
    next(error);
  }
};

// Obtener cantidad total de citas por estado para una sucursal dada
export const getCountByStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { branchId } = request.query;

  if (!branchId) {
    return response.status(400).json({ error: "Branch ID is required" });
  }

  try {
    const branchIdInt = parseInt(branchId.toString(), 10);

    // Agrupar reservas por estado y contar la cantidad de cada estado
    const reservationCounts = await prisma.reservation.groupBy({
      by: ['statusId'],
      where: {
        branchId: branchIdInt,
      },
      _count: {
        id: true,
      },
      orderBy: {
        statusId: 'asc',
      },
    });

    // Obtener la descripción del estado y el color basados en el statusId
    const formattedResult = await Promise.all(
      reservationCounts.map(async (item) => {
        const status = await prisma.status.findUnique({
          where: { id: item.statusId },
          select: { description: true, color: true },
        });
        return {
          statusId: item.statusId,
          statusDescription: status?.description || "Unknown Status",
          color: status?.color || "#000000",
          count: item._count.id,
        };
      })
    );

    response.json(formattedResult);
  } catch (error) {
    next(error);
  }
};
