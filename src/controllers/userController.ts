import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function getUsers(req: Request, res: Response): Promise<void> {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function createUser(req: Request, res: Response): Promise<void> {
  let { name, email, lastname, dob, password } = req.body;
  
  if(dob) dob = new Date(dob)


  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const newUser = await userService.createUser({ name, lastname, dob, password, email });
  res.status(201).json(newUser);
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const passwordMatches = await userService.comparePassword(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Implementa otros controladores como getUserById, updateUser, etc.
