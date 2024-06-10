import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const get = async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const reservation = await prisma.reservation.create({
      data: req.body,
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};