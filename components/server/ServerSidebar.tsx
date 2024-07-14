import { findServerChannels } from '@/lib/actions/server.action';
import { currentProfle } from '@/lib/utils/current-profile';
import { redirect } from 'next/navigation';
import React from 'react';
import ServerHeader from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './ServerSearch';
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import ServerSection from './ServerSection';
import ServerChannel from './ServerChannel';
import ServerMember from './ServerMember';

interface Props {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 size-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 size-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 size-4' />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className='mr-2 size-4 text-indigo-500' />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className='mr-2 size-4 text-rose-500' />,
};

const ServerSidebar = async ({ serverId }: Props) => {
  const profile = await currentProfle();

  if (!profile) return redirect('/sign-in');

  const { members, textChannels, audioChannels, videoChannels, role, server } =
    await findServerChannels({
      serverId,
      profileId: profile.id,
    });

  return (
    // <div className='hidden md:flex h-full w-60  fixed z-20 flex-col inset-y-0'>
    <div className='hidden md:flex h-full w-60  text-primary   fixed z-20 flex-col dark:bg-[#2B2D31] bg-[#F2F3F5] inset-y-0'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map(({ id, name, type }) => ({
                  id,
                  name,
                  icon: iconMap[type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map(({ id, name, type }) => ({
                  id,
                  name,
                  icon: iconMap[type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map(({ id, name, type }) => ({
                  id,
                  name,
                  icon: iconMap[type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map(({ id, profile, role }) => ({
                  id,
                  name: profile.name,
                  icon: roleIconMap[role],
                })),
              },
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />

        {!!textChannels.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.TEXT}
              role={role}
              server={server}
              label='Text Channels'
            />
            <div className='pl-2'>
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              role={role}
              server={server}
              label='Video Channels'
            />
            <div className='pl-2'>
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              role={role}
              server={server}
              label='Audio Channels'
            />
            <div className='pl-2'>
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='members'
              channelType={ChannelType.AUDIO}
              role={role}
              label='Members'
              server={server}
            />
            <div className='pl-2'>
              {members.map((member) => (
                <ServerMember member={member} key={member.id} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
