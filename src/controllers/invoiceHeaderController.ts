import { Request, Response } from "express";
import prisma from "../prisma/client";

export const get = async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoiceHeader.findMany();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoiceHeader.findUnique({
      where: { id: Number(id) },
    });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const invoiceHeader = await prisma.invoiceHeader.create({
      data: req.body,
    });
    res.status(201).json(invoiceHeader);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoiceHeader = await prisma.invoiceHeader.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.status(200).json(invoiceHeader);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
