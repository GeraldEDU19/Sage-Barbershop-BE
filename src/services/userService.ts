import prisma from '../prisma/client';
import { User } from '../models/userModel';

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany();
}

export async function createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const newUser = await prisma.user.create({
    data: {
      ...data,
      createdAt: new Date(), // Asegúrate de manejar el campo creado automáticamente
    },
  });
  return newUser;
}

// Implementa otros servicios como getUserById, updateUser, etc.
