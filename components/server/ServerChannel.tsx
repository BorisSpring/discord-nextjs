'use client';
import { cn } from '@/lib/utils';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, HashIcon, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import ActionToolTip from '../ActionToolTip';
import { ModalType, useModalStore } from '@/hooks/useModalStore';
import { ServerWithMembersAndProfiles } from '@/lib/types';
import { channel } from 'diagnostics_channel';

interface Props {
  channel: Channel;
  server: ServerWithMembersAndProfiles;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: (
    <HashIcon className='size-5 flex-shrink-0 dark:text-zinc-400 ' />
  ),
  [ChannelType.AUDIO]: (
    <Mic className='size-5 flex-shrink-0 dark:text-zinc-400 ' />
  ),
  [ChannelType.VIDEO]: (
    <Video className='size-5 flex-shrink-0 dark:text-zinc-400 ' />
  ),
};

const ServerChannel = ({ channel, server, role }: Props) => {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModalStore();

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };
  return (
    <button
      onClick={(e) => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
      }}
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      {iconMap[channel.type]}
      <p
        className={cn(
          'line-clamp-1 font-semibold text-xs text-zinc-500 group-hover:text-zinc-600 transition dark:group-hover:text-zinc-300',
          params?.channelId &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionToolTip label='Edit' align='center' side='top'>
            <Edit
              onClick={(e) => onAction(e, 'editChannel')}
              className='size-4  hidden group-hover:block text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionToolTip>
          <ActionToolTip label='Delete' align='center' side='top'>
            <Trash
              onClick={(e) => onAction(e, 'deleteChannel')}
              className='size-4  hidden group-hover:block text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionToolTip>
        </div>
      )}
      {channel.name === 'general' && role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionToolTip label='Locked' align='center' side='top'>
            <Lock className='size-4  hidden group-hover:block text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300 transition' />
          </ActionToolTip>
        </div>
      )}
    </button>
  );
};

export default ServerChannel;
