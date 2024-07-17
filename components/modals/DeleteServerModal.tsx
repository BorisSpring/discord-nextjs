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
import { deleteServer } from '@/lib/actions/server.action';
import { usePathname, useRouter } from 'next/navigation';

const DeleteServerModal = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { isOpen, type, onClose, data } = useModalStore();
  const isDialogOpen = isOpen && type === 'deleteServer';

  const onHandleDeleteServer = async () => {
    try {
      await deleteServer({ serverId: data.server?.id, route: pathName! });
      onClose();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => onClose()}>
      <DialogContent className='bg-white text-black  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Delete Server
          </DialogTitle>
          <DialogDescription className='text-center text-base'>
            Are you sure you want to delete{' '}
            <span className='font-semibold text-indigo-500'>
              {data.server?.name}
            </span>
            ?
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
              onClick={onHandleDeleteServer}
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

export default DeleteServerModal;
