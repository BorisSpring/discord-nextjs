import { getUserServers } from '@/lib/actions/server.action';
import { currentProfle } from '@/lib/utils/current-profile';
import { redirect } from 'next/navigation';
import React from 'react';
import NavigationAction from './NavigationAction';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavigationItem from './NavigationItem';
import ModeToggle from '../ModeToggle';
import { UserButton } from '@clerk/nextjs';

const NavigationSidebar = async () => {
  const profile = await currentProfle();

  if (!profile) return redirect('/');

  const servers = await getUserServers({ userId: profile.id });

  return (
    <aside className='space-y-4  bg-[#E3E5E8]  break-words flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22]'>
      <NavigationAction />
      <Separator className='h-0.5 bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto ' />

      <ScrollArea className='flex-1 w-full'>
        {servers?.map((server) => (
          <div key={server.id}>
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <ModeToggle />
        <UserButton
          afterSwitchSessionUrl='/'
          appearance={{
            elements: {
              avatarBox: 'size-12',
            },
          }}
        />
      </div>
    </aside>
  );
};

export default NavigationSidebar;
