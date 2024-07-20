import { NextApiResponseServerIo } from '@/lib/types';
import { currentProflePages } from '@/lib/utils/current-profile-page';
import { NextApiRequest } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not supported' });
  }

  try {
    const { conversationId } = req.query;
    const { fileUrl, content } = req.body;

    if (!conversationId)
      return res.status(400).json({ message: 'Missing conversation ID!' });

    if (!fileUrl && !content)
      return res.status(400).json({ message: 'Missing required fields!' });

    const profile = await currentProflePages(req);

    if (!profile) return res.redirect('/sign-in');

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
      return res.status(404).json({ message: 'Conversation not found!' });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    const message = await prisma.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
