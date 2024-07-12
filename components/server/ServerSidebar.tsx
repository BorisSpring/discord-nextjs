import { findServerChannels } from '@/lib/actions/server.action';
import { currentProfle } from '@/lib/utils/current-profile';
import { redirect } from 'next/navigation';
import React from 'react';
import ServerHeader from './ServerHeader';

interface Props {
  serverId: string;
}

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
    </div>
  );
};

export default ServerSidebar;
