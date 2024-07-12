import { Channel } from '@prisma/client';

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
