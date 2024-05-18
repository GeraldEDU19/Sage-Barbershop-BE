import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function getUsers(req: Request, res: Response): Promise<void> {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email, age } = req.body;
  
  console.log(req.body)

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const newUser = await userService.createUser({ name, email, age });
  res.status(201).json(newUser);
}

// Implementa otros controladores como getUserById, updateUser, etc.
