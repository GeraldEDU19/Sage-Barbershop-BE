import { PrismaClient, Product } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

import multer from 'multer';
import imageService from '../services/imageService';



const prisma = new PrismaClient();

// Obtener listado
export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id, image } = request.query;

    const filters: any = {};

    if (id) filters.id = parseInt(id.toString(), 10);

    // Obtener productos
    const list: Product[] = await prisma.product.findMany({
      where: filters,
      orderBy: {
        id: "asc",
      },
      include: {
        category: true,
      },
    });

    // Convertir las imágenes a base64 si están disponibles
    for (const product of list) {
      if (product.image && image) {
        try {
          const imageSize = parseInt(image.toString());
          product.image = await imageService.getImageAsBase64(product.image, imageSize);
        } catch (error) {
          next(error)
        }
      }
    }

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
    const idProduct = parseInt(id.toString());
    const objProduct = await prisma.product.findFirst({
      where: { id: idProduct },
      include: {
        category: true,
      },
    });

    if(request.query.image && objProduct?.image) objProduct.image = (await imageService.getImageAsBase64(objProduct.image, parseInt(request.query.image.toString()))).toString()
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

    let data:any = { 
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      
      quantity: parseInt(body.quantity, 10),
      category: {
        connect: { id: parseInt(body.category, 10) },
      },
    }

    if (request.file) {

      const maxId = await prisma.product.findMany({
        select: { id: true },
        orderBy: { id: 'desc' },
        take: 1,
      });
      const nextId = maxId.length ? maxId[0].id + 1 : 1;

      const imageName = `product_${nextId}`;

      await imageService.uploadImage(request.file, imageName);

      data.image = imageName
    }



    const newProduct = await prisma.product.create({
      data
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
    const idProduct = parseInt(body.id);
    body.quantity = parseInt(body.quantity);
    delete body.id

    if(body.categoryId) body.categoryId = parseInt(body.categoryId)
    //We have to parsed all strings to ints

    const oldProduct = await prisma.product.findUnique({
      where: { id: idProduct },
      include: {
        category: true,
      },
    });

    if (!oldProduct) {
      return response.status(404).json({ message: "Product not found" });
    }

    let imageName = oldProduct.image;

    if (request.file) {
      const newImageName = `product_${idProduct}`;

      await imageService.uploadImage(request.file, newImageName);

      imageName = newImageName;
    }

    let data:any = { 
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      
      quantity: parseInt(body.quantity, 10),
      category: {
        connect: { id: parseInt(body.category, 10) },
      },
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: idProduct,
      },
      data: data
    });

    response.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
