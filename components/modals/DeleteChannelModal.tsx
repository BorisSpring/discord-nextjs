'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useModalStore } from '@/hooks/useModalStore';
import { Button } from '../ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { deleteChannel } from '@/lib/actions/channel.action';

const DeleteChannelModal = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { isOpen, type, onClose, data } = useModalStore();
  const isDialogOpen = isOpen && type === 'deleteChannel';

  const onHandleDeleteChannel = async () => {
    try {
      await deleteChannel({
        serverId: data.server?.id,
        route: pathName!,
        channelId: data.channel?.id,
      });
      onClose();
      router.push(`/servers/${data.server?.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => onClose()}>
      <DialogContent className='bg-white text-black  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Delete Channel
          </DialogTitle>
          <DialogDescription className='text-center text-base'>
            Are you sure you want to do this?
            <span className='font-semibold text-indigo-500'>
              {data.channel?.name}
            </span>{' '}
            will be permanently deleted.
          </DialogDescription>
          <DialogFooter className='p-6 flex justify-center w-fit m-auto gap-3'>
            <Button
              onClick={onClose}
              className='shadow-sm border no-focus border-zinc-300 w-[120px]'
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={onHandleDeleteChannel}
              className='w-[120px] transition  border no-focus border-indigo-500 text-white text-lg'
              type='submit'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
