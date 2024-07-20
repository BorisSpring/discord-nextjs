import { currentProfle } from '@/lib/utils/current-profile';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { MemberRole } from '@prisma/client';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfle();

    if (!profile) return new NextResponse('Unathorized', { status: 401 });

    const server = await prisma.server.create({
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

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
