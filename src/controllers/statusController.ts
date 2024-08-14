import { Request, Response } from "express";
import prisma from "../prisma/client";

export const get = async (req: Request, res: Response) => {
  try {
    const status = await prisma.status.findMany();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    let id = req.query.id;
    if (!id) throw new Error("undefined ID");
    const idStatus = parseInt(id.toString());
    const status = await prisma.status.findUnique({
      where: { id: idStatus },
    });
    if (!status) return res.status(404).json({ error: "Status not found" });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const status = await prisma.status.create({
      data: req.body,
    });
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const status = await prisma.status.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
