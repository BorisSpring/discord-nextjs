import { auth } from '@clerk/nextjs/server';
import prisma from '../prisma';

export const currentProfle = async () => {
  const { userId } = auth();

  if (!userId) return null;

  return await prisma?.profile.findUnique({ where: { userId } });
};
