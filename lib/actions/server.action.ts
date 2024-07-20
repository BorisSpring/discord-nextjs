'use server';

import { ChannelType, MemberRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { currentProfle } from '../utils/current-profile';
import {
  ChannelsByType,
  CreateServerParams,
  DeleteServerParams,
  FindGeneralChannelParams,
  FindServerChannelParams,
  GetServerDetailsParams,
  GetUserServerParams,
  JoinServerParams,
  KickUserFromServerParams,
  LeaveServerParams,
  UpdateMemberRole,
  UpdateServerParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import prisma from '../prisma';

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

export async function generateNewInviteLinkForServer(
  params: GetServerDetailsParams
) {
  try {
    const { serverId } = params;
    const profile = await currentProfle();

    if (!profile) throw new Error('Unathorized!');

    if (!serverId) throw new Error('Server id missing!');

    const server = await prisma?.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
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

    return server;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function joinServer(params: JoinServerParams) {
  try {
    const { inviteCode } = params;

    if (!inviteCode) return redirect('/');

    const profile = await currentProfle();

    if (!profile) return redirect('/sign-in');

    const server = await prisma.server.findFirst({
      where: {
        inviteCode: inviteCode,
      },
      include: {
        members: {
          select: {
            profileId: true,
          },
        },
      },
    });

    if (!server) return redirect('/');

    if (server.members.some((member) => member.profileId === profile.id)) {
      return redirect(`/servers/${server.id}`);
    }

    const updatedServer = await prisma.server.update({
      where: {
        inviteCode: inviteCode,
      },
      data: {
        members: {
          create: {
            profileId: profile.id,
          },
        },
      },
    });

    return redirect(updatedServer ? `/servers/${updatedServer?.id}` : '/');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateServer(params: UpdateServerParams) {
  try {
    const { id, name, imageUrl } = params;

    if (!id || !name || !imageUrl) throw new Error('Missing required fields!');

    const profile = await currentProfle();

    if (!profile) {
      return redirect('/sign-in');
    }

    await prisma.server.update({
      where: {
        id,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    revalidatePath(`/servers/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateMemberRole(params: UpdateMemberRole) {
  try {
    const { serverId, memberId, role } = params;

    if (!serverId || !memberId || !role)
      throw new Error('Mising required fields!');

    const profile = await currentProfle();

    if (!profile) throw new Error('Unathorized!');

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
        members: {
          some: {
            id: memberId,
          },
        },
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
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

    if (!server) throw new Error('Fail to update user role!');

    return server;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function kickUserFromServer(params: KickUserFromServerParams) {
  try {
    const { serverId, memberId, route } = params;

    if (!serverId || !memberId) throw new Error('Missing required fields');

    const profile = await currentProfle();

    if (!profile) {
      return redirect('/sign-in');
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            OR: [{ role: 'ADMIN' }, { role: 'MODERATOR' }],
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
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

    return server;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function leaveServer(params: LeaveServerParams) {
  try {
    const { serverId, route } = params;

    if (!serverId || !route) throw new Error('Missing server ID!');

    const profile = await currentProfle();

    if (!profile) throw new Error('Unauthorized');

    await prisma.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteServer(params: DeleteServerParams) {
  try {
    const { serverId, route } = params;

    const profile = await currentProfle();

    if (!profile) return redirect('/sign-in');

    await prisma.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    revalidatePath(route);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findGeneralChannel(params: FindGeneralChannelParams) {
  try {
    const { serverId } = params;

    if (!serverId) return redirect('/');

    const profile = await currentProfle();

    if (!profile) return redirect('/sign-in');

    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: {
          where: {
            name: 'general',
          },
        },
      },
    });

    return redirect(
      server ? `/servers/${server.id}/channels/${server.channels[0].id}` : '/'
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
