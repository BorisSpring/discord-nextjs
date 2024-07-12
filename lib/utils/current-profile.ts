import { auth } from '@clerk/nextjs/server';

export const currentProfle = async () => {
  const { userId } = auth();

  if (!userId) return null;

  return await prisma?.profile.findUnique({ where: { userId } });
};
