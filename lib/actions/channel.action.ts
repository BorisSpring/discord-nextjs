'use server';
import prisma from '../prisma';
import { redirect } from 'next/navigation';
import { currentProfle } from '../utils/current-profile';
import { CreateChannelParams } from './shared.types';
import { revalidatePath } from 'next/cache';
import { MemberRole } from '@prisma/client';

export async function createChannel(params: CreateChannelParams) {
  try {
    const { type, serverId, name, route } = params;

    if (
      !name ||
      name.toLowerCase() === 'general' ||
      !type ||
      !serverId ||
      !route
    ) {
      throw new Error('Invalid requred fields');
    }

    const profile = await currentProfle();

    if (!profile) return redirect('/sign-in');

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });

    if (!server) throw new Error('Fail to create new channel!');

    revalidatePath(route);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
