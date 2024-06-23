import { PrismaClient, Product } from "@prisma/client";
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


    const list: Product[] = await prisma.product.findMany({
      where: filters,
      orderBy: {
        id: "asc",
      },
      include: {
        category: true,
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
    const idProduct = parseInt(request.params.id);
    const objProduct = await prisma.product.findFirst({
      where: { id: idProduct },
      include: {
        category: true,
      },
    });
    response.json(objProduct);
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
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image,
        quantity: parseInt(body.quantity, 10),
        category: {
          connect: { id: parseInt(body.categoryId, 10) },
        },
      },
    });
    response.json(newProduct);
  } catch (error) {
    next(error);
  }
};

// Actualizar un producto
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const idProduct = parseInt(request.params.id);

    // Obtener producto viejo
    const oldProduct = await prisma.product.findUnique({
      where: { id: idProduct },
      include: {
        category: true,
      },
    });

    if (!oldProduct) {
      return response.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: idProduct,
      },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image,
        quantity: parseInt(body.quantity, 10),
        category: {
          connect: { id: parseInt(body.categoryId, 10) },
        },
      },
    });
    response.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
