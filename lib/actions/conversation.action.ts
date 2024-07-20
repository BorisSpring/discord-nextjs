'use server';

import { FindConversationParams } from './shared.types';
import { redirect } from 'next/navigation';
import { currentProfle } from '../utils/current-profile';
import prisma from '../prisma';

export async function findOrCreateConversation(params: FindConversationParams) {
  try {
    const { serverId, memberId } = params;

    if (!serverId || !memberId) return redirect('/');

    const profile = await currentProfle();

    if (!profile) return redirect('/sign-in');

    const loggedUserMember = await prisma.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    if (!loggedUserMember) return redirect('/');

    let conversation = await prisma?.conversation.findFirst({
      where: {
        serverId: serverId,
        OR: [
          { memberOneId: loggedUserMember.id, memberTwoId: memberId },
          { memberTwoId: loggedUserMember.id, memberOneId: memberId },
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

    if (!conversation) {
      const server = await prisma.server.findUnique({
        where: {
          id: serverId,
          AND: [
            { members: { some: { id: memberId } } },
            { members: { some: { id: loggedUserMember.id } } },
          ],
        },
      });

      if (!server) return redirect('/');

      conversation = await prisma.conversation.create({
        data: {
          memberOneId: loggedUserMember.id,
          memberTwoId: memberId,
          serverId,
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
    }

    if (!conversation) return redirect(`/servers/${serverId}`);

    const otherMember =
      conversation.memberOneId === loggedUserMember.id
        ? conversation.memberTwo
        : conversation.memberOne;

    const loggedMember =
      conversation.memberOneId !== loggedUserMember.id
        ? conversation.memberTwo
        : conversation.memberOne;

    return { conversation, otherMember, loggedMember };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
