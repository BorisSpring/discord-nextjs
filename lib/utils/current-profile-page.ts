import { getAuth } from '@clerk/nextjs/server';
import prisma from '../prisma';
import { NextApiRequest } from 'next';

export const currentProflePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) return null;

  return await prisma?.profile.findUnique({ where: { userId } });
};
