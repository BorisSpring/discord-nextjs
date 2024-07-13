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
import ServerForm from '../forms/ServerForm';
const EditServerSettingsModal = () => {
  const { isOpen, type, onClose, data } = useModalStore();

  const isDialogOpen = isOpen && type === 'editServer';

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => onClose()}>
      <DialogContent className='bg-white text-black  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Create Your Server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <ServerForm server={data?.server} />
      </DialogContent>
    </Dialog>
  );
};

export default EditServerSettingsModal;
