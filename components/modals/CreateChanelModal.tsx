'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModalStore } from '@/hooks/useModalStore';
import ChannelForm from '../forms/ChannelForm';
const CreateChannelModal = () => {
  const { isOpen, type, onClose, data } = useModalStore();

  const isDialogOpen =
    isOpen && (type === 'createChannel' || type === 'editChannel');

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => onClose()}>
      <DialogContent className='bg-white text-black  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            {data?.channel ? 'Edit' : ' Create New'} Channel
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            <ChannelForm
              channel={data?.channel}
              server={data?.server}
              channelType={data?.channelType}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
