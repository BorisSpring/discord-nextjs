import { Channel, ChannelType, MemberRole } from '@prisma/client';

export interface GetUserServerParams {
  userId: string;
}

export interface CreateServerParams {
  imageUrl: string;
  name: string;
  route: string;
}

export interface FindServerChannelParams {
  serverId: string;
  profileId: string;
}

export interface ChannelsByType {
  textChannels: Channel[];
  audioChannels: Channel[];
  videoChannels: Channel[];
}

export interface GetServerDetailsParams {
  serverId: string | undefined;
}

export interface JoinServerParams {
  inviteCode: strings;
}

export interface UpdateServerParams {
  id: string;
  name: string;
  imageUrl: string;
}

export interface UpdateMemberRole {
  memberId: string;
  serverId: string | undefined;
  role: MemberRole;
  route: string;
}

export interface KickUserFromServerParams {
  serverId: string | undefined;
  memberId: string;
  route: string;
}

export interface LeaveServerParams {
  serverId?: string;
  route: string;
}

export interface DeleteServerParams {
  serverId?: string;
  route: string;
}

export interface CreateChannelParams {
  serverId?: string;
  type: ChannelType;
  name: string;
  route: string;
}

export interface UpdateChannelParams extends CreateChannelParams {
  channelId: string;
}

export interface DeleteChannelParams {
  channelId: string | undefined;
  serverId: string | undefined;
  route: string;
}
