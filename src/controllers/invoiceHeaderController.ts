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
    const { id, date, branchId, userId, status, administratorId } =
      request.query;

    const filters: any = {};

    if (date) filters.date = new Date(date.toString());
    if (id) filters.id = parseInt(id.toString(), 10);
    if (branchId) filters.branchId = parseInt(branchId.toString(), 10);
    if (userId) filters.userId = parseInt(userId.toString(), 10);
    if (status) filters.status = status === "true";

    let branchFilter: any = {};

    if (administratorId) {
      const adminId = parseInt(administratorId.toString(), 10);
      branchFilter = {
        user: {
          some: {
            id: adminId,
          },
        },
      };
    }

    const list = await prisma.invoiceHeader.findMany({
      where: {
        ...filters,
        branch: branchFilter,
      },
      orderBy: {
        date: "desc",
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
        branch: {},
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
    let { branchId, date, invoiceDetails, total, userId } = request.body;
    console.log("🚀 ~ request.body:", request.body);
    // Crear el nuevo InvoiceHeader
    const newInvoiceHeader = await prisma.invoiceHeader.create({
      data: {
        date: new Date(date),
        branch: {
          connect: { id: parseInt(branchId, 10) },
        },
        User: {
          connect: { id: parseInt(userId, 10) },
        },
        total: parseFloat(total),
        status: false, // Puedes modificar esto si necesitas manejar un status inicial
        createdAt: new Date(),
        updatedAt: new Date(),
        // Creación de los detalles asociados
        InvoiceDetail: {
          create: invoiceDetails.map((detail: any, index: number) => ({
            sequence: index + 1,
            serviceId: detail.serviceId ? parseInt(detail.serviceId, 10) : null,
            productId: detail.productId ? parseInt(detail.productId, 10) : null,
            quantity: detail.quantity ? parseInt(detail.quantity, 10) : null,
            price: parseFloat(detail.price),
            subtotal:
              parseFloat(detail.price) *
              (detail.quantity ? parseInt(detail.quantity, 10) : 1),
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        },
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
    const idInvoiceHeader = parseInt(body.id, 10);

    // Obtener el invoice header existente
    const oldInvoiceHeader = await prisma.invoiceHeader.findUnique({
      where: { id: idInvoiceHeader },
      include: {
        InvoiceDetail: true,
      },
    });

    if (!oldInvoiceHeader) {
      return response.status(404).json({ message: "InvoiceHeader not found" });
    }

    // Eliminar todos los detalles actuales
    await prisma.invoiceDetail.deleteMany({
      where: { invoiceHeaderId: idInvoiceHeader },
    });

    // Crear nuevos detalles
    const newInvoiceDetails = body.invoiceDetails.map(
      (detail: any, index: number) => ({
        sequence: index + 1,
        serviceId: detail.serviceId ? parseInt(detail.serviceId, 10) : null,
        productId: detail.productId ? parseInt(detail.productId, 10) : null,
        quantity: detail.quantity ? parseInt(detail.quantity, 10) : null,
        price: parseFloat(detail.price),
        subtotal:
          parseFloat(detail.price) *
          (detail.quantity ? parseInt(detail.quantity, 10) : 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    // Actualizar el invoiceHeader y agregar nuevos detalles
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
        status: body.status === "true",
        updatedAt: new Date(),

        // Crear los nuevos detalles de factura
        InvoiceDetail: {
          create: newInvoiceDetails,
        },
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
    const sequence = parseInt(request.params.id);

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

// Actualizar el status de un invoice header a true
export const updateStatusToTrue = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const idInvoiceHeader = parseInt(request.body.id);

    // Verificar si el invoiceHeader existe
    const invoiceHeader = await prisma.invoiceHeader.findUnique({
      where: { id: idInvoiceHeader },
    });

    if (!invoiceHeader) {
      return response.status(404).json({ message: "InvoiceHeader not found" });
    }

    // Actualizar el status a true
    const updatedInvoiceHeader = await prisma.invoiceHeader.update({
      where: {
        id: idInvoiceHeader,
      },
      data: {
        status: true,
        updatedAt: new Date(),
      },
    });

    response.json(updatedInvoiceHeader);
  } catch (error) {
    next(error);
  }
};

// Obtener los 3 servicios más vendidos en todas las sucursales
export const getTopServices = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const topServices = await prisma.invoiceDetail.groupBy({
      by: ["serviceId"],
      _sum: {
        quantity: true,
      },
      where: {
        serviceId: {
          not: null, // Filtrar aquellos que tienen un serviceId válido
        },
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 3, // Limitar el resultado a los 3 primeros
    });

    // Enriquecer los datos con información del servicio
    const detailedTopServices = await Promise.all(
      topServices.map(async (service) => {
        const serviceDetails = await prisma.service.findUnique({
          where: { id: service.serviceId! },
          select: { name: true, price: true },
        });
        return {
          serviceId: service.serviceId,
          serviceName: serviceDetails?.name,
          totalQuantity: service._sum.quantity,
        };
      })
    );

    response.json(detailedTopServices);
  } catch (error) {
    next(error);
  }
};

// Obtener los 3 productos más vendidos en todas las sucursales
export const getTopProducts = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const topProducts = await prisma.invoiceDetail.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      where: {
        productId: {
          not: null, // Filtrar aquellos que tienen un productId válido
        },
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 3, // Limitar el resultado a los 3 primeros
    });

    // Enriquecer los datos con información del producto
    const detailedTopProducts = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await prisma.product.findUnique({
          where: { id: product.productId! },
          select: { name: true, price: true },
        });
        return {
          productId: product.productId,
          productName: productDetails?.name,
          totalQuantity: product._sum.quantity,
        };
      })
    );

    response.json(detailedTopProducts);
  } catch (error) {
    next(error);
  }
};
