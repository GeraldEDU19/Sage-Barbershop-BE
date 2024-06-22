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
    const idBranch = parseInt(request.params.id);
    const objBranch = await prisma.branch.findFirst({
      where: { id: idBranch },
    });
    response.json(objBranch);
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
    const newBranch = await prisma.branch.create({
      data: {
        name: body.name,
        description: body.description,
        phone: body.phone,
        address: body.address,
        email: body.email,
      },
    });
    response.json(newBranch);
  } catch (error) {
    next(error);
  }
};

// Actualizar una sucursal
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const idBranch = parseInt(request.params.id);

    // Obtener sucursal vieja
    const oldBranch = await prisma.branch.findUnique({
      where: { id: idBranch },
    });

    if (!oldBranch) {
      return response.status(404).json({ message: "Branch not found" });
    }

    const updatedBranch = await prisma.branch.update({
      where: {
        id: idBranch,
      },
      data: {
        name: body.name,
        description: body.description,
        phone: body.phone,
        address: body.address,
        email: body.email,
      },
    });
    response.json(updatedBranch);
  } catch (error) {
    next(error);
  }
};
