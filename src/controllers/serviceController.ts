import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const get = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.create({
      data: req.body,
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};