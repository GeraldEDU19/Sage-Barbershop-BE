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
    const newReservation = await prisma.reservation.create({
      data: {
        date: new Date(body.date),
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
        date: new Date(body.date),
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

// Filtrar por mes y año
export const getByMonthYear = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { year, month, idManager } = request.query;

  if (!year || !month) {
    return response.status(400).json({ error: "Year and month are required" });
  }

  const filters: any = {
    date: {
      gte: new Date(`${year}-${month}-01`),
      lt: new Date(`${year}-${Number(month) + 1}-01`),
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