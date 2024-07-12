'use server';

import { ChannelType, MemberRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { currentProfle } from '../utils/current-profile';
import {
  ChannelsByType,
  CreateServerParams,
  FindServerChannelParams,
  GetUserServerParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { profile } from 'console';

export async function getUserServers(params: GetUserServerParams) {
  try {
    const { userId } = params;

    return await prisma?.server.findMany({
      where: {
        members: {
          some: {
            profileId: userId,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createServer(params: CreateServerParams) {
  try {
    const { name, imageUrl, route } = params;
    const profile = await currentProfle();

    if (!profile) throw new Error('Unathorized!');

    await prisma?.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: 'general',
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    revalidatePath(route);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findServerChannels(params: FindServerChannelParams) {
  try {
    const { serverId, profileId } = params;

    const server = await prisma?.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId,
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    if (!server) return redirect('/');

    const channelsByTypes = server?.channels.reduce<ChannelsByType>(
      (acc, channel) => {
        switch (channel.type) {
          case ChannelType.TEXT:
            acc.textChannels.push(channel);
            break;
          case ChannelType.AUDIO:
            acc.audioChannels.push(channel);
            break;
          case ChannelType.VIDEO:
            acc.videoChannels.push(channel);
            break;
          default:
            break;
        }
        return acc;
      },
      { textChannels: [], audioChannels: [], videoChannels: [] }
    );

    const members = server.members.filter((member) => member.id !== profileId);

    const role = server.members.find(
      (member) => member.profileId === profileId
    )?.role;

    return { members, ...channelsByTypes, role, server };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
