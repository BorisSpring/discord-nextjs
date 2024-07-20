'use client';
import React from 'react';
import queryString from 'query-string';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ActionToolTip from '../ActionToolTip';
import { Video, VideoOff } from 'lucide-react';

const ChatVideoButton = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isVideo = searchParams?.get('video');

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathName || '',
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <ActionToolTip
      align='center'
      side='bottom'
      label={isVideo ? 'End video call' : 'Start video call'}
    >
      <button onClick={onClick}>
        {isVideo ? (
          <VideoOff className='size-6 text-zinc-500 dark:text-zinc-400 hover:opacity-75 transition mr-4' />
        ) : (
          <Video className='size-6 text-zinc-500 dark:text-zinc-400 hover:opacity-75 transition mr-4' />
        )}
      </button>
    </ActionToolTip>
  );
};

export default ChatVideoButton;
