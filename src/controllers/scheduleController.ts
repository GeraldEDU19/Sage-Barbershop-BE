import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const get = async (req: Request, res: Response) => {
  try {
    const schedules = await prisma.schedule.findMany();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(id) },
    });
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const schedule = await prisma.schedule.create({
      data: req.body,
    });
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schedule = await prisma.schedule.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};