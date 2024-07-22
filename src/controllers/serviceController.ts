import { PrismaClient, Service } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import imageService from "../services/imageService";

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
        user: true,
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
    const idservice = parseInt(id.toString());
    const objservice = await prisma.service.findFirst({
      where: { id: idservice },
      include: {
        user: true,
      },
    });

    if (request.query.image && objservice?.image)
      objservice.image = (
        await imageService.getImageAsBase64(
          objservice.image,
          parseInt(request.query.image.toString())
        )
      ).toString();
    response.json(objservice);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;

    let data: any = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      duration: parseInt(body.duration, 10),
      user: {
        connect: { id: parseInt(body.user, 10) },
      },
    };

    if (request.file) {
      const maxId = await prisma.service.findMany({
        select: { id: true },
        orderBy: { id: "desc" },
        take: 1,
      });
      const nextId = maxId.length ? maxId[0].id + 1 : 1;

      const imageName = `service_${nextId}`;

      await imageService.uploadImage(request.file, imageName);

      data.image = imageName;
    }

    const newService = await prisma.service.create({
      data,
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
    const idService = parseInt(body.id);
    body.duration = parseInt(body.duration);
    delete body.id;

    if (body.userId) body.userId = parseInt(body.userId);
    //We have to parsed all strings to ints

    const oldService = await prisma.service.findUnique({
      where: { id: idService },
      include: {
        user: true,
      },
    });

    if (!oldService) {
      return response.status(404).json({ message: "Service not found" });
    }

    let imageName = oldService.image;

    if (request.file) {
      const newImageName = `service_${idService}`;

      await imageService.uploadImage(request.file, newImageName);

      imageName = newImageName;
    }

    let data: any = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      duration: parseInt(body.duration, 10),
      user: {
        connect: { id: parseInt(body.user, 10) },
      },
    };

    const updatedService = await prisma.service.update({
      where: {
        id: idService,
      },
      data: data,
    });

    response.json(updatedService);
  } catch (error) {
    next(error);
  }
};
