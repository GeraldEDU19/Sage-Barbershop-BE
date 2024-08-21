import { PrismaClient, InvoiceHeader } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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
const generateInvoicePDF = async (invoice: any, invoiceDetails: any[], filePath: string) => {
  const doc = new PDFDocument({ margin: 50 });
  
  // Guardar el archivo PDF en la ruta especificada
  doc.pipe(fs.createWriteStream(filePath));

  // Estilo de factura moderna
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown(2);

  // Mostrar estado de la factura
  const statusText = invoice.status ? 'Paid' : 'Unpaid';
  doc.font('Helvetica-Bold').fontSize(16).text(`Status: ${statusText}`, { align: 'right' });
  doc.moveDown();

  // Información de la factura
  doc.fontSize(12).text(`Invoice Number: ${invoice.id}`, { align: 'right' });
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, { align: 'right' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text(`Billed to:`);
  doc.font('Helvetica').text(`${invoice.User.name}`, { indent: 20 });
  doc.text(`${invoice.User.email}`, { indent: 20 });
  doc.moveDown(2);

  doc.font('Helvetica-Bold').text(`Branch:`);
  doc.font('Helvetica').text(`${invoice.branch.name}`, { indent: 20 });
  doc.moveDown(2);

  // Tabla de Detalles
  doc.font('Helvetica-Bold').text('Invoice Details:');
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const itemMargin = 50;
  const tableHeaders = ['Item', 'Quantity', 'Price', 'Subtotal'];

  // Dibujar encabezados de la tabla
  tableHeaders.forEach((header, i) => {
    doc.fontSize(10).font('Helvetica-Bold').text(header, itemMargin + i * 100, tableTop);
  });

  // Dibujar líneas de la tabla
  let position = tableTop + 15;
  for (const [index, detail] of invoiceDetails.entries()) {
    let item: any = {};
    if (detail.productId && detail.productId !== '') {
      item = await prisma.product.findUnique({ where: { id: detail.productId } });
    } else if (detail.serviceId && detail.serviceId !== '') {
      item = await prisma.service.findUnique({ where: { id: detail.serviceId } });
    }

    // Establecer los valores de cada fila
    const name = item?.name || 'Unknown';
    const quantity = detail.quantity || 0;
    const price = `$${detail.price.toFixed(2)}`;
    const subtotal = `$${detail.subtotal.toFixed(2)}`;

    // Agregar datos al PDF asegurando que el nombre no se desborde
    doc.font('Helvetica')
      .text(name, itemMargin, position, { width: 90, ellipsis: true }) // Limitando el ancho del texto y truncando si es necesario
      .text(quantity, itemMargin + 100, position)
      .text(price, itemMargin + 200, position)
      .text(subtotal, itemMargin + 300, position);

    position += 20;
  }

  // Total
  doc.moveDown(2);
  doc.font('Helvetica-Bold').fontSize(12).text(`Total: $${invoice.total.toFixed(2)}`, { align: 'right' });
  
  // Finalizar el documento
  doc.end();
};






// Función para enviar el correo con el PDF adjunto
const sendInvoiceEmail = async (invoice: any, pdfFilePath: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: invoice.User.email,
    subject: `Invoice #${invoice.id}`,
    text: 'Sage Invoice.',
    attachments: [
      {
        filename: `factura_${invoice.id}.pdf`,
        path: pdfFilePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar la factura por correo:', error);
  }
};

// Crear un nuevo invoice header
export const create = async (request: Request, response: Response, next: NextFunction) => {
  try {
    let { branchId, date, invoiceDetails, total, userId } = request.body;

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
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        InvoiceDetail: {
          create: invoiceDetails.map((detail: any, index: number) => ({
            sequence: index + 1,
            serviceId: detail.serviceId ? parseInt(detail.serviceId, 10) : null,
            productId: detail.productId ? parseInt(detail.productId, 10) : null,
            quantity: detail.quantity ? parseInt(detail.quantity, 10) : null,
            price: parseFloat(detail.price),
            subtotal: parseFloat(detail.price) * (detail.quantity ? parseInt(detail.quantity, 10) : 1),
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

    // Generar el PDF de la factura


    let invoiceToPdf = await prisma.invoiceHeader.findUnique({
      where: { id: newInvoiceHeader.id },
      include: {
        branch: {
        },
        User: true,
        InvoiceDetail: true,
      },
    });

    if(invoiceToPdf) {
      const pdfFilePath = path.join(__dirname, `factura_${newInvoiceHeader.id}.pdf`);
      generateInvoicePDF(invoiceToPdf, invoiceToPdf?.InvoiceDetail, pdfFilePath);
      await sendInvoiceEmail(invoiceToPdf, pdfFilePath);
    }
    
    // Enviar el correo con la factura adjunta
    

    response.json(newInvoiceHeader);
  } catch (error) {
    next(error);
  }
};

// Actualizar un invoice header
export const update = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;
    const idInvoiceHeader = parseInt(body.id, 10);

    const updatedInvoiceHeader = await prisma.invoiceHeader.update({
      where: { id: idInvoiceHeader },
      data: {
        date: new Date(body.date),
        branch: {
          connect: { id: parseInt(body.branchId, 10) },
        },
        User: {
          connect: { id: parseInt(body.userId, 10) },
        },
        total: parseFloat(body.total),
        status: body.status === 'true',
        updatedAt: new Date(),
    
        // Primero eliminamos los InvoiceDetails antiguos
        InvoiceDetail: {
          deleteMany: {
            invoiceHeaderId: idInvoiceHeader,
          },
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
    
    // Luego creamos los nuevos InvoiceDetails
    await prisma.invoiceDetail.createMany({
      data: body.invoiceDetails.map((detail: any, index: number) => ({
        invoiceHeaderId: idInvoiceHeader,
        sequence: index + 1,
        serviceId: detail.serviceId ? parseInt(detail.serviceId, 10) : null,
        productId: detail.productId ? parseInt(detail.productId, 10) : null,
        quantity: detail.quantity ? parseInt(detail.quantity, 10) : null,
        price: parseFloat(detail.price),
        subtotal: parseFloat(detail.price) * (detail.quantity ? parseInt(detail.quantity, 10) : 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
    

    // Generar el PDF de la factura

    let invoiceToPdf = await prisma.invoiceHeader.findUnique({
      where: { id: idInvoiceHeader },
      include: {
        branch: {
        },
        User: true,
        InvoiceDetail: true,
      },
    });

    if(invoiceToPdf) {
      const pdfFilePath = path.join(__dirname, `factura_${idInvoiceHeader}.pdf`);
      generateInvoicePDF(invoiceToPdf, invoiceToPdf?.InvoiceDetail, pdfFilePath);
      await sendInvoiceEmail(invoiceToPdf, pdfFilePath);
    }

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


    let invoiceToPdf = await prisma.invoiceHeader.findUnique({
      where: { id: idInvoiceHeader },
      include: {
        branch: {
        },
        User: true,
        InvoiceDetail: true,
      },
    });

    if(invoiceToPdf) {
      const pdfFilePath = path.join(__dirname, `factura_${idInvoiceHeader}.pdf`);
      generateInvoicePDF(invoiceToPdf, invoiceToPdf?.InvoiceDetail, pdfFilePath);
      await sendInvoiceEmail(invoiceToPdf, pdfFilePath);
    }


    response.json(updatedInvoiceHeader);
  } catch (error) {
    next(error);
  }
};
