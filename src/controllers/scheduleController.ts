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

// Obtener por Id
export const getById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const idSchedule = parseInt(request.params.id);
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

// Crear
export const create = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;

    const status: boolean = body.status === 'true';

    const newSchedule = await prisma.schedule.create({
      data: {
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
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
