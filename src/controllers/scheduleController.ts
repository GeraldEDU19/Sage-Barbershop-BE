import { PrismaClient, Schedule } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Obtener listado
export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const schedules: Schedule[] = await prisma.schedule.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        branch: true,
      },
    });
    response.json(schedules);
  } catch (error) {
    next(error);
  }
};


export const getByBranchId = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let branchId: number = 0
    if(request.query.branchId) branchId = parseInt(request.query.branchId.toString())
    const schedules: Schedule[] = await prisma.schedule.findMany({
      orderBy: {
        id: "asc",
      },
      where: { branchId: branchId },
      include: {
        branch: true,
      },
    });
    response.json(schedules);
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
    let id = request.query.id
    if(!id) throw new Error("undefined ID")
    const idSchedule = parseInt(id.toString());
    const schedule = await prisma.schedule.findUnique({
      where: { id: idSchedule },
      include: {
        branch: true,
      },
    });

    if (!schedule) {
      return response.status(404).json({ error: "Schedule not found" });
    }

    response.json(schedule);
  } catch (error) {
    next(error);
  }
};

export const getByBranchAndDate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const branchId = request.query.branchId ? parseInt(request.query.branchId.toString()) : null;
    const date = request.query.date ? new Date(request.query.date.toString()) : null;

    if (!branchId) {
      return response.status(400).json({ message: 'branchId are required' });
    }

    if (!date) {
      return response.status(400).json({ message: 'date are required' });
    }

    const schedules: Schedule[] = await prisma.schedule.findMany({
      orderBy: {
        id: 'asc',
      },
      where: {
        branchId: branchId,
        startDate: {
          lte: date, // startDate is less than or equal to the selected date
        },
        endDate: {
          gte: date, // endDate is greater than or equal to the selected date
        },
        status: true, // Optional: Ensure the schedule is active
      },
      include: {
        branch: true,
      },
    });

    if (schedules.length === 0) {
      return response.status(404).json({ message: 'No schedules found for the selected date and branch' });
    }

    response.json(schedules);
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

    const status: boolean = body.status === "true";
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    // Verificar si existe un horario en el rango de fechas
    const conflictingSchedule = await prisma.schedule.findFirst({
      where: {
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
        branchId: parseInt(body.branchId, 10),
      },
        
    });

    if (conflictingSchedule) {
      return response.status(400).json({ error: "There is already a schedule in the specified date range." });
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        startDate: startDate,
        endDate: endDate,
        status: status,
        branch: {
          connect: { id: parseInt(body.branchId, 10) },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    response.status(201).json(newSchedule);
  } catch (error) {
    next(error);
  }
};

// Actualizar un schedule
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const idSchedule = parseInt(request.params.id);

    const status: boolean = body.status === 'true';

    // Obtener schedule viejo
    const oldSchedule = await prisma.schedule.findUnique({
      where: { id: idSchedule },
      include: {
        branch: true,
      },
    });

    if (!oldSchedule) {
      return response.status(404).json({ error: "Schedule not found" });
    }

    const updatedSchedule = await prisma.schedule.update({
      where: {
        id: idSchedule,
      },
      data: {
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: status,
        branch: {
          connect: { id: parseInt(body.branchId, 10) },
        },
        updatedAt: new Date(),
      },
    });
    response.status(200).json(updatedSchedule);
  } catch (error) {
    next(error);
  }
};
