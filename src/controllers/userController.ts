import { Request, Response } from "express";
import * as userService from "../services/userService";
import prisma from "../prisma/client";

export async function get(req: Request, res: Response): Promise<void> {
  const users = await userService.getAllUsers();
  res.json(users);
}

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, surname, phone, email, address, birthdate, password, role } = req.body;
    const user = await prisma.user.create({
      data: { name, surname, phone, email, address, birthdate: new Date(birthdate), password, role },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, surname, phone, email, address, birthdate, password, role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, surname, phone, email, address, birthdate: new Date(birthdate), password, role },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
