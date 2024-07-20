'use server';

import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { currentProfle } from '../utils/current-profile';
import prisma from '../prisma';
import { GetMessagesParams } from './shared.types';
import { Message } from '@prisma/client';

export async function getMessages(params: GetMessagesParams) {
  try {
    const { channelId, cursor } = params;

    if (!channelId) {
      return new NextResponse('Missing channel Id!', { status: 400 });
    }

    const profile = await currentProfle();

    if (!profile) return NextResponse.redirect('/sign-in');

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

    return { items: messages, nextCursor };
  } catch (error) {
    console.error(error);
    return redirect('/');
  }
}
