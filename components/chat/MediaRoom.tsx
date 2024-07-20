'use client';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  ControlBar,
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';

interface Props {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const MediaRoom = ({ chatId, video, audio }: Props) => {
  const { user } = useUser();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user?.firstName} ${user?.lastName}`;

    (async () => {
      try {
        console.log({ chatId });
        const resp = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
        console.log({ resp });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user?.lastName, user?.firstName, chatId]);

  if (token === '') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='size-7 text-zinc-500 animate-spin my-4 ' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme='default'
      style={{ height: '100dvh' }}
    >
      <VideoConference />
      <ControlBar />
    </LiveKitRoom>
  );
};

export default MediaRoom;
