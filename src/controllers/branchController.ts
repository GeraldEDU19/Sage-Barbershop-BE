import { PrismaClient, Branch } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Obtener listado
export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const list: Branch[] = await prisma.branch.findMany({
      orderBy: {
        id: "asc",
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
    let id = request.query.id
    if(!id) throw new Error("undefined ID")
    const idBranch = parseInt(id.toString());
    const objBranch = await prisma.branch.findFirst({
      where: { id: idBranch },
      include:{
        user: true,
        Schedule: true,
        Reservation: true,
        Invoice: true,
      }
    });
    response.json(objBranch);
  } catch (error) {
    next(error);
  }
};

// Crear
export const create = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { name, description, phone, address, email, users } = request.body;

    const newBranch = await prisma.branch.create({
      data: {
        name,
        description,
        phone,
        address,
        email,
        user: {
          connect: users.map((userId: string) => ({ id: parseInt(userId) })),
        },
      },
    });

    response.json(newBranch);
  } catch (error) {
    next(error);
  }
};

// Actualización de una `Branch` con usuarios
export const update = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id, name, description, phone, address, email, users } = request.body;
    const idBranch = parseInt(id);

    const oldBranch = await prisma.branch.findUnique({
      where: { id: idBranch },
      include: { user: true },
    });

    if (!oldBranch) {
      return response.status(404).json({ message: "Branch not found" });
    }

    const updatedBranch = await prisma.branch.update({
      where: { id: idBranch },
      data: {
        name,
        description,
        phone,
        address,
        email,
        user: {
          set: [], // Limpiar las conexiones existentes
          connect: users.map((userId: string) => ({ id: parseInt(userId) })),
        },
      },
    });

    response.json(updatedBranch);
  } catch (error) {
    next(error);
  }
};