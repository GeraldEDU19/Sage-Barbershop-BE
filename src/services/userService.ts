import { Role, User as PrismaUser } from '@prisma/client'; // Importa los tipos directamente desde Prisma
import prisma from '../prisma/client';
import BcryptService from '../services/bcryptService';

const bcryptService = new BcryptService();

type SimplifiedUser = Omit<PrismaUser, 'createdAt' | 'updatedAt' | 'Service' | 'Branch' | 'Reservation' | 'Invoice'>;

export async function getAllUsers(): Promise<PrismaUser[]> {
  return prisma.user.findMany({
    include: {
      Service: true,
      Branch: true,
      Reservation: true,
      Invoice: true,
    },
  });
}

export async function createUser(data: Omit<SimplifiedUser, 'id'>): Promise<PrismaUser> {
  data.password = await bcryptService.encryptText(data.password);
  const newUser = await prisma.user.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: {
      Service: true,
      Branch: true,
      Reservation: true,
      Invoice: true,
    },
  });
  return newUser;
}

export async function getUserByEmail(email: string): Promise<PrismaUser | null> {
  return prisma.user.findUnique({
    where: { email },
    include: {
      Service: true,
      Branch: true,
      Reservation: true,
      Invoice: true,
    },
  });
}

export async function updateUser(id: number, data: Partial<SimplifiedUser>): Promise<PrismaUser> {
  if (data.password) {
    data.password = await bcryptService.encryptText(data.password);
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    include: {
      Service: true,
      Branch: true,
      Reservation: true,
      Invoice: true,
    },
  });
  return updatedUser;
}

export async function comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return bcryptService.compareText(plainTextPassword, hashedPassword);
}
