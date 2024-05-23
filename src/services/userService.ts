import prisma from '../prisma/client';
import { User } from '../models/userModel';
import BcryptService from '../services/bcryptService'
const bcryptService = new BcryptService()

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany();
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {

  data.password = await bcryptService.encryptText(data.password)
  const newUser = await prisma.user.create({
    data: {
      ...data,
      createdAt: new Date(), // Asegúrate de manejar el campo creado automáticamente
    },
  });
  return newUser;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return bcryptService.compareText(plainTextPassword, hashedPassword);
}
// Implementa otros servicios como getUserById, updateUser, etc.
