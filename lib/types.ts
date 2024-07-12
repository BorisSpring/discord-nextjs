import { Channel, Member, Profile, Server } from '@prisma/client';

export type ServerWithMembersAndProfiles = Server & {
  members: Member[];
  channels: Channel[];
};
