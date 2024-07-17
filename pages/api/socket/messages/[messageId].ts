import { NextApiResponseServerIo } from '@/lib/types';
import { currentProflePages } from '@/lib/utils/current-profile-page';
import { NextApiRequest } from 'next';
import prisma from '../../../../lib/prisma';
import { MemberRole } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed!' });
  }

  try {
    const profile = await currentProflePages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized!' });
    }

    if (!serverId) {
      return res.status(401).json({ error: 'Missing server Id!' });
    }

    if (!channelId) {
      return res.status(401).json({ error: 'Missing channel Id!' });
    }

    const server = await prisma.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
        channels: {
          some: {
            id: channelId as string,
          },
        },
      },
      include: {
        members: true,
        channels: {
          where: {
            id: channelId as string,
          },
        },
      },
    });

    const member = server?.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) return res.status(404).json({ error: 'Member not found!' });

    let message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted)
      return res.status(404).json({ error: 'Message not found!' });

    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const isMessageOwner = member.id === message.memberId;
    const canModify = isAdmin || isModerator || isMessageOwner;

    if (!canModify || (req.method === 'PATCH' && !isMessageOwner)) {
      return res.status(401).json({ error: 'Unathorized' });
    }

    const updateData =
      req.method === 'DELETE'
        ? {
            fileUrl: null,
            content: 'This message has been deleted.',
            deleted: true,
          }
        : { content };

    const updatedMessage = await prisma.message.update({
      where: { id: message.id },
      data: updateData,
      include: { member: { include: { profile: true } } },
    });

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, updatedMessage);

    return res.status(200).json(message);
  } catch (error) {
    return res.status(400).json({ error: 'Internal error!' });
  }
}
