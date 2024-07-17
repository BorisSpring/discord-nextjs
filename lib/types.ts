import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

import { Channel, Member, Message, Profile, Server } from '@prisma/client';

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type ServerWithMembersAndProfiles = Server & {
  members: MemberWithProfile[];
  channels: Channel[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};
