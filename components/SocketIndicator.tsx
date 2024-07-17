'use client';
import React from 'react';
import { useSocketContext } from './theme-provider/SocketProvider';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const SocketIndicator = () => {
  const { isConntected } = useSocketContext();

  return (
    <Badge
      variant='outline'
      className={cn(
        'bg-yellow-600 text-white border-none',
        isConntected && 'bg-emerald-600'
      )}
    >
      {!isConntected ? 'Fallback: Polling every 1s' : 'Live: Real-Time Updates'}
    </Badge>
  );
};

export default SocketIndicator;
