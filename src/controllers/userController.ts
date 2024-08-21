import { PrismaClient, Role, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import BcryptService from "../services/bcryptService";

const bcryptService = new BcryptService();
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

    const list: User[] = await prisma.user.findMany({
      where: filters,
      orderBy: {
        id: "asc",
      },
      include: {
        Service: true,
        Branch: true,
        Reservation: true,
        Invoice: true,
      },
    });
    response.json(list);
  } catch (error) {
    next(error);
  }
};

// Obtener listado
export const getEmployees = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const list: User[] = await prisma.user.findMany({
      where: {
        role: Role.EMPLOYEE,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        Service: true,
        Branch: true,
        Reservation: true,
        Invoice: true,
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
    const idUser = parseInt(id.toString());
    const objUser = await prisma.user.findUnique({
      where: { id: idUser },
      include: {
        Service: true,
        Branch: true,
        Reservation: true,
        Invoice: true,
      },
    });
    response.json(objUser);
  } catch (error) {
    next(error);
  }
};

export const getEmployeesWithoutBranch = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const employees: User[] = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
        branchId: null,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        Service: true,
        Branch: true,
        Reservation: true,
        Invoice: true,
      },
    });
    response.json(employees);
  } catch (error) {
    next(error);
  }
};

// Obtener por Email
export const getByEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const emailUser = request.params.email;
    const objUser = await prisma.user.findUnique({
      where: { email: emailUser },
      include: {
        Service: true,
        Branch: true,
        Reservation: true,
        Invoice: true,
      },
    });
    response.json(objUser);
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
    body.password = await bcryptService.encryptText(body.password);
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        surname: body.surname,
        phone: body.phone,
        email: body.email,
        address: body.address,
        birthdate: new Date(body.birthdate),
        password: body.password,
        role: body.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        Service: true,
        Branch: true,
        Reservation: true,
        Invoice: true,
      },
    });
    response.json(newUser);
  } catch (error) {
    next(error);
  }
};

// Actualizar un usuario
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const idUser = parseInt(body.id);

    // Obtener usuario existente
    const oldUser = await prisma.user.findUnique({
      where: { id: idUser },
      include: {
        Service: true,
        Branch: true,
        Reservation: true,
        Invoice: true,
      },
    });

    if (!oldUser) {
      return response.status(404).json({ message: "User not found" });
    }

    // Preparar los datos de actualización
    const updateData: any = {
      name: body.name,
      surname: body.surname,
      phone: body.phone,
      email: body.email,
      address: body.address,
      birthdate: body.birthdate ? new Date(body.birthdate) : oldUser.birthdate,
      role: body.role,
      updatedAt: new Date(),
    };

    // Si se recibe un password, encriptarlo
    if (body.password) {
      body.password = await bcryptService.encryptText(body.password);
    }

    // Si se recibe un branchId, actualizar la relación con Branch
    if (body.branchId) {
      updateData.branchId = parseInt(body.branchId);
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: {
        id: idUser,
      },
      data: updateData,
      include: {
        Service: true,
        Branch: true,
        Reservation: true,
        Invoice: true,
      },
    });

    response.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
