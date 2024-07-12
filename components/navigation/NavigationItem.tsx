'use client';
import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ActionToolTip from '../ActionToolTip';
import { cn } from '@/lib/utils';

interface Props {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem = ({ id, imageUrl, name }: Props) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionToolTip side='right' align='center' label={name}>
      <button
        onClick={onClick}
        className='group relative flex items-center mb-4 justify-center'
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-1',
            params?.serverId !== id && 'group-hover:h-5',
            params?.serverId === id ? 'h-9' : 'h-2'
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 size-12 rounded-[24px] group-hover:rounded-[16px] transition-all',
            params?.serverId === id &&
              'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image
            fill
            src={imageUrl}
            className='size-12 rounded-full'
            alt='server image'
          />
        </div>
      </button>
    </ActionToolTip>
  );
};

export default NavigationItem;
