import { currentProfle } from '@/lib/utils/current-profile';
import { Message } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const profile = await currentProfle();

    if (!profile) return NextResponse.redirect('/sign-in');

    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get('channelId');
    const cursor = searchParams.get('cursor');

    if (!channelId) {
      return new NextResponse('Missing channel Id!', { status: 400 });
    }

    let messages: Message[] = [];
    if (cursor) {
      messages = await prisma.message.findMany({
        where: {
          channelId: channelId,
        },
        take: 15,
        skip: 1,
        cursor: {
          id: cursor,
        },
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
    } else {
      messages = await prisma.message.findMany({
        take: 15,
        where: {
          channelId: channelId as string,
        },
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
    }

    let nextCursor = null;

    if (messages.length === 15) {
      nextCursor = messages[14].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
