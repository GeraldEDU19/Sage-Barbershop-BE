import { PrismaClient, Category } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Obtener listado de categorías
export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.query;

    const filters: any = {};

    if (id) filters.id = parseInt(id.toString(), 10);

    const list: Category[] = await prisma.category.findMany({
      where: filters,
      orderBy: {
        id: "asc",
      },
    });
    response.json(list);
  } catch (error) {
    next(error);
  }
};

// Obtener categoría por Id
export const getById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const idCategory = parseInt(request.params.id);
    const objCategory = await prisma.category.findFirst({
      where: { id: idCategory },
    });
    response.json(objCategory);
  } catch (error) {
    next(error);
  }
};

// Crear categoría
export const create = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const newCategory = await prisma.category.create({
      data: {
        description: body.description,
      },
    });
    response.json(newCategory);
  } catch (error) {
    next(error);
  }
};

// Actualizar una categoría
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const idCategory = parseInt(request.params.id);

    // Obtener categoría vieja
    const oldCategory = await prisma.category.findUnique({
      where: { id: idCategory },
    });

    if (!oldCategory) {
      return response.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: idCategory,
      },
      data: {
        description: body.description,
      },
    });
    response.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};
