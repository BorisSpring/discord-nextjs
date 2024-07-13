import { cn } from '@/lib/utils';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Props {
  src?: string;
  className?: string;
  fallback?: String;
}

const UserAvatar = ({ src, className, fallback }: Props) => {
  return (
    <div>
      <Avatar className={cn('size-7 md:size-10 rounded-full', className)}>
        <AvatarImage src={src} />
        <AvatarFallback className='uppercase'>{fallback}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserAvatar;
