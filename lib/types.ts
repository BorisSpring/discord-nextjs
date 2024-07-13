import { Channel, Member, Profile, Server } from '@prisma/client';

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type ServerWithMembersAndProfiles = Server & {
  members: MemberWithProfile[];
  channels: Channel[];
};
