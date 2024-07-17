import { Hash, Menu } from 'lucide-react';
import React from 'react';
import MobileToggle from '../MobileToggle';
import UserAvatar from '../UserAvatar';
import SocketIndicator from '../SocketIndicator';

interface Props {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: Props) => {
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 lg:h-[64px] border-neutral-200 dark:border-neutral-800 border-b-2'>
      <MobileToggle serverId={serverId} />
      {type === 'channel' ? (
        <Hash className='size-5 text-zinc-500 dark:text-zinc-400 mr-2' />
      ) : (
        <UserAvatar src={imageUrl} className='size-8 md:size-8 mr-2' />
      )}
      <p className='font-semibodl text-md text-black dark:text-white'>{name}</p>
      <div className='ml-auto flex items-center'>
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
