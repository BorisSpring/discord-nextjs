'use client';
import { ServerWithMembersAndProfiles } from '@/lib/types';
import { Channel, ChannelType, MemberRole } from '@prisma/client';
import React from 'react';
import ActionToolTip from '../ActionToolTip';
import { Plus, Settings } from 'lucide-react';
import { useModalStore } from '@/hooks/useModalStore';

interface Props {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: ChannelType;
  server?: ServerWithMembersAndProfiles;
  channel?: Channel;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
  channel,
}: Props) => {
  const { onOpen } = useModalStore();
  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionToolTip label='Create Channel' side='top' align='center'>
          <button
            onClick={() => onOpen('createChannel', { channelType, server })}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Plus className='size-4' />
          </button>
        </ActionToolTip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionToolTip label='Manage Members' side='top' align='center'>
          <button
            onClick={() => onOpen('members', { channel, server })}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Settings className='size-4' />
          </button>
        </ActionToolTip>
      )}
    </div>
  );
};

export default ServerSection;
