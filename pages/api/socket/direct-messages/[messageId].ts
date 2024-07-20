import { NextApiResponseServerIo } from '@/lib/types';
import { NextApiRequest } from 'next';
import prisma from '../../../../lib/prisma';
import { currentProflePages } from '@/lib/utils/current-profile-page';
import { MemberRole } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not supported' });
  }

  try {
    const { messageId, conversationId, serverId } = req.query;
    const { content } = req.body;

    if (!messageId || !conversationId) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }

    const profile = await currentProflePages(req);

    if (!profile) {
      return res.redirect('/sign-in');
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          { memberOne: { profileId: profile.id } },
          { memberTwo: { profileId: profile.id } },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ message: 'Message not found!' });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    let directMessage = await prisma.directMessage.findFirst({
      where: {
        id: messageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted)
      return res.status(404).json({ message: 'Message not found!' });

    const updateKey = `chat:${conversationId}:messages:update`;

    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const isMessageOwner = member.id === directMessage.memberId;
    const canModify = isAdmin || isModerator || isMessageOwner;

    const updateData =
      req.method === 'DELETE'
        ? {
            fileUrl: null,
            content: 'This message has been deleted.',
            deleted: true,
          }
        : { content };

    directMessage = await prisma.directMessage.update({
      where: { id: directMessage.id },
      data: updateData,
      include: { member: { include: { profile: true } } },
    });

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json({ message: directMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
