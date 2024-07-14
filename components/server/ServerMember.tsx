'use client';
import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile } from '@prisma/client';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import UserAvatar from '../UserAvatar';

interface Props {
  member: Member & { profile: Profile };
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className='size-4 text-indigo-500 ml-2' />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className='size-4 text-rose-500 ml-2' />,
};

const ServerMember = ({ member }: Props) => {
  const params = useParams();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
      }
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-1 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar className='size-6 md:size-8' src={member.profile.imageUrl} />
      <p className='line-clamp-1 ml-1 font-semibold text-sm text-zinc-500 dark:text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-primary transition'>
        {member.profile.name}
      </p>
      {roleIconMap[member.role]}
    </button>
  );
};

export default ServerMember;
