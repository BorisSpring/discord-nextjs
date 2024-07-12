'use client';
import React from 'react';
import { Plus } from 'lucide-react';
import ActionToolTip from '../ActionToolTip';
import { useModalStore } from '@/hooks/useModalStore';

const NavigationAction = () => {
  const { onOpen } = useModalStore();

  return (
    <div>
      <ActionToolTip align='center' label='Add Server' side='right'>
        <button
          className='group flex items-center my-4'
          onClick={() => onOpen('createServer')}
        >
          <div className='flex mx-3 size-12 justify-center rounded-[24px] bg-background dark:bg-neutral-700 group-hover:bg-emerald-500  group-hover:rounded-[16px] transition-all overflow-hidden         items-center'>
            <Plus
              className='group-hover:text-white transition-all text-emerald-500'
              size={25}
            />
          </div>
        </button>
      </ActionToolTip>
    </div>
  );
};

export default NavigationAction;
