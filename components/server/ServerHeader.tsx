'use client';
import { ServerWithMembersAndProfiles } from '@/lib/types';
import { MemberRole } from '@prisma/client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Settings, UserPlus } from 'lucide-react';
interface Props {
  server: ServerWithMembersAndProfiles;
  role: MemberRole | undefined;
}

const ServerHeader = ({ role, server }: Props) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='focus:outline-none no-focus'>
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all'>
          {server.name} <ChevronDown className='size-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium dark:text-neutral-400 space-y-0.5'>
        <DropdownMenuLabel>Manage Server</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isModerator && (
          <DropdownMenuItem className='text-indigo-600 px-3 py-2 cursor-pointer dark:text-indigo-400'>
            Invite People <UserPlus className='size-5' />
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className=' px-3 py-2 cursor-pointer '>
          Server Settings <Settings className='size-4 ml-auto' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
