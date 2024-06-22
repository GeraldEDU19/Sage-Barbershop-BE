import { PrismaClient, Reservation } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Obtener listado
export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const list: Reservation[] = await prisma.reservation.findMany({
      orderBy: {
        id: "asc",
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
    const idReservation = parseInt(request.params.id);
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
        service: body.serviceId
          ? {
              connect: { id: parseInt(body.serviceId, 10) },
            }
          : undefined,
        User: body.userId
          ? {
              connect: { id: parseInt(body.userId, 10) },
            }
          : undefined,
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
    const idReservation = parseInt(request.params.id);

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
        service: body.serviceId
          ? {
              connect: { id: parseInt(body.serviceId, 10) },
            }
          : undefined,
        User: body.userId
          ? {
              connect: { id: parseInt(body.userId, 10) },
            }
          : undefined,
      },
    });
    response.json(updatedReservation);
  } catch (error) {
    next(error);
  }
};
