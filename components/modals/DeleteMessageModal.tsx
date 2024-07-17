'use client';
import React, { useState } from 'react';
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
import queryString from 'query-string';
import axios from 'axios';

const DeleteMessageModal = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, type, onClose, data } = useModalStore();
  const isDialogOpen = isOpen && type === 'deleteMessage';

  const { apiUrl, query } = data;

  const onHandleDeleteMessage = async () => {
    try {
      setIsDeleting(true);
      const url = queryString.stringifyUrl({
        url: apiUrl || '',
        query,
      });

      console.log({ url });
      await axios.delete(url);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => onClose()}>
      <DialogContent className='bg-white text-black rounded-md  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Delete Server
          </DialogTitle>
          <DialogDescription className='text-center text-base'>
            Are you sure you want to this? The message will be permanently
            deleted.
          </DialogDescription>
          <DialogFooter>
            <div className='p-6 flex justify-center w-fit m-auto gap-3'>
              <Button
                disabled={isDeleting}
                onClick={onClose}
                className='shadow-sm border no-focus border-zinc-300 w-[120px]'
              >
                Cancel
              </Button>
              <Button
                disabled={isDeleting}
                variant='primary'
                onClick={onHandleDeleteMessage}
                className='w-[120px] transition  border no-focus border-indigo-500 text-white text-lg'
                type='submit'
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
