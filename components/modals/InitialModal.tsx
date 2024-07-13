'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ServerForm from '../forms/ServerForm';
import { useModalStore } from '@/hooks/useModalStore';
const InitialModal = () => {
  const { onClose } = useModalStore();

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className='bg-white text-black  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Create Your Server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
          <ServerForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
