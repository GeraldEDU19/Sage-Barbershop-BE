import { Request, Response } from "express";
import prisma from "../prisma/client";

export const get = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const branch = await prisma.branch.findUnique({
      where: { id: Number(id) },
    });
    if (!branch) return res.status(404).json({ error: "Branch not found" });
    res.json(branch);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const branch = await prisma.branch.create({
      data: req.body,
    });
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const branch = await prisma.branch.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
