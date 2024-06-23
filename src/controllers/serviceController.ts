import { PrismaClient, Service } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Obtener listado
export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.query;

    const filters: any = {};

    if (id) filters.id = parseInt(id.toString(), 10);

    const list: Service[] = await prisma.service.findMany({
      where: filters,
      orderBy: {
        id: "asc",
      },
      include: {
        employee: true,
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
    const idService = parseInt(request.params.id);
    const objService = await prisma.service.findFirst({
      where: { id: idService },
      include: {
        employee: true,
      },
    });
    response.json(objService);
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
    const newService = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        duration: parseInt(body.duration, 10),
        image: body.image || 'image-not-found.jpg',
        employee: {
          connect: { id: parseInt(body.userId, 10) },
        },
      },
    });
    response.json(newService);
  } catch (error) {
    next(error);
  }
};

// Actualizar un servicio
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const idService = parseInt(request.params.id);

    // Obtener servicio viejo
    const oldService = await prisma.service.findUnique({
      where: { id: idService },
      include: {
        employee: true,
      },
    });

    if (!oldService) {
      return response.status(404).json({ message: "Service not found" });
    }

    const updatedService = await prisma.service.update({
      where: {
        id: idService,
      },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        duration: parseInt(body.duration, 10),
        image: body.image || 'image-not-found.jpg',
        employee: {
          connect: { id: parseInt(body.userId, 10) },
        },
      },
    });
    response.json(updatedService);
  } catch (error) {
    next(error);
  }
};
