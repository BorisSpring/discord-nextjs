import { currentProfle } from '@/lib/utils/current-profile';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { DirectMessage } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfle();

    if (!profile) return NextResponse.redirect('/sign-in');

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get('cursor');
    const conversationId = searchParams?.get('conversationId');

    if (!conversationId)
      return new NextResponse('Missing conversation id!', { status: 400 });

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { memberOne: { profileId: profile.id } },
          { memberTwo: { profileId: profile.id } },
        ],
      },
    });

    if (!conversation) return new NextResponse('Unauthorized', { status: 401 });

    let messages: DirectMessage[] = [];
    let nextCursor = undefined;
    messages = await prisma.directMessage.findMany({
      where: {
        conversationId: conversationId as string,
      },
      take: 15,
      skip: cursor ? 1 : undefined,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (messages?.length === 15) {
      nextCursor = messages[14].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internela Error', { status: 500 });
  }
}
