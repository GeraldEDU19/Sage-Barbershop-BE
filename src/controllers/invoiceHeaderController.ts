import { PrismaClient, InvoiceHeader } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Obtener listado de invoice headers
export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id, date, branchId, userId, status, administratorId } = request.query;

    const filters: any = {};

    if (date) filters.date = new Date(date.toString());
    if (id) filters.id = parseInt(id.toString(), 10);
    if (branchId) filters.branchId = parseInt(branchId.toString(), 10);
    if (userId) filters.userId = parseInt(userId.toString(), 10);
    if (status) filters.status = status === 'true';

    let branchFilter: any = {};

    if (administratorId) {
      const adminId = parseInt(administratorId.toString(), 10);
      branchFilter = {
        user: {
          some: {
            id: adminId
          }
        }
      };
    }

    const list = await prisma.invoiceHeader.findMany({
      where: {
        ...filters,
        branch: branchFilter
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        branch: true,
        User: true,
        InvoiceDetail: {
          include: {
            service: true,
            product: true,
          },
        },
      },
    });

    response.json(list);
  } catch (error) {
    next(error);
  }
};

// Obtener invoice header por Id
export const getById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const idInvoiceHeader = parseInt(request.params.id);
    const objInvoiceHeader = await prisma.invoiceHeader.findUnique({
      where: { id: idInvoiceHeader },
      include: {
        branch: {
        },
        User: true,
        InvoiceDetail: true,
      },
    });
    response.json(objInvoiceHeader);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo invoice header
export const create = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const newInvoiceHeader = await prisma.invoiceHeader.create({
      data: {
        date: new Date(body.date),
        branch: {
          connect: { id: parseInt(body.branchId, 10) },
        },
        User: {
          connect: { id: parseInt(body.userId, 10) },
        },
        total: parseFloat(body.total),
        status: body.status === 'true', // Convertir a booleano
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        branch: true,
        User: true,
        InvoiceDetail: true,
      },
    });
    response.json(newInvoiceHeader);
  } catch (error) {
    next(error);
  }
};

// Actualizar un invoice header
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const idInvoiceHeader = parseInt(request.params.id);

    // Obtener invoice header viejo
    const oldInvoiceHeader = await prisma.invoiceHeader.findUnique({
      where: { id: idInvoiceHeader },
      include: {
        branch: true,
        User: true,
        InvoiceDetail: true,
      },
    });

    if (!oldInvoiceHeader) {
      return response.status(404).json({ message: "InvoiceHeader not found" });
    }

    const updatedInvoiceHeader = await prisma.invoiceHeader.update({
      where: {
        id: idInvoiceHeader,
      },
      data: {
        date: new Date(body.date),
        branch: {
          connect: { id: parseInt(body.branchId, 10) },
        },
        User: {
          connect: { id: parseInt(body.userId, 10) },
        },
        total: parseFloat(body.total),
        status: body.status === 'true', // Convertir a booleano
        updatedAt: new Date(),
      },
      include: {
        branch: true,
        User: true,
        InvoiceDetail: true,
      },
    });
    response.json(updatedInvoiceHeader);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo invoice detail
export const createDetail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    // Obtener el último sequence para este invoiceHeader
    const lastInvoiceDetail = await prisma.invoiceDetail.findFirst({
      where: { invoiceHeaderId: parseInt(body.invoiceHeaderId, 10) },
      orderBy: { sequence: "desc" },
    });

    // Determinar el nuevo sequence
    const newSequence = (lastInvoiceDetail?.sequence || 0) + 1;

    // Crear el nuevo invoice detail
    const newInvoiceDetail = await prisma.invoiceDetail.create({
      data: {
        sequence: newSequence,
        invoiceHeader: {
          connect: { id: parseInt(body.invoiceHeaderId, 10) },
        },
        service: body.serviceId
          ? { connect: { id: parseInt(body.serviceId, 10) } }
          : undefined,
        product: body.productId
          ? { connect: { id: parseInt(body.productId, 10) } }
          : undefined,
        quantity: body.quantity,
        price: parseFloat(body.price),
        subtotal: parseFloat(body.subtotal),
      },
      include: {
        invoiceHeader: true,
        service: true,
        product: true,
      },
    });

    response.json(newInvoiceDetail);
  } catch (error) {
    next(error);
  }
};

// Actualizar un invoice detail
export const updateDetail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;
    const invoiceHeaderId = parseInt(body.invoiceHeaderId, 10);
    const sequence = parseInt(request.params.id)

    // Actualizar el invoice detail
    const updatedInvoiceDetail = await prisma.invoiceDetail.update({
      where: { invoiceHeaderId_sequence: { invoiceHeaderId, sequence } },
      data: {
        serviceId: body.serviceId ? parseInt(body.serviceId, 10) : undefined,
        productId: body.productId ? parseInt(body.productId, 10) : undefined,
        quantity: body.quantity,
        price: parseFloat(body.price),
        subtotal: parseFloat(body.subtotal),
      },
      include: {
        invoiceHeader: true,
        service: true,
        product: true,
      },
    });

    response.json(updatedInvoiceDetail);
  } catch (error) {
    next(error);
  }
};