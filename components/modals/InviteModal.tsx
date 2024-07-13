'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useModalStore } from '@/hooks/useModalStore';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/useOrigin';
import { generateNewInviteLinkForServer } from '@/lib/actions/server.action';
const InviteModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModalStore();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDialogOpen = isOpen && type === 'invite';
  const origin = useOrigin();

  const inviteUrl = `${origin}/invite/${data.server?.inviteCode}`;

  const onHandleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 1000);
  };

  const onHandleGenerateLink = async () => {
    try {
      setIsLoading(true);
      const server = await generateNewInviteLinkForServer({
        serverId: data.server?.id,
      });
      onOpen('invite', { server });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => onClose()}>
      <DialogContent className='bg-white text-black  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Invite Friends
          </DialogTitle>
          <div className='p-6'>
            <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
              Server invite link
            </Label>
            <div className='flex items-center mt-2 gap-x-2'>
              <Input
                disabled={isLoading}
                className='bg-zinc-300/50 border-0 no-focous'
                value={inviteUrl}
              />
              <Button disabled={isLoading} onClick={onHandleCopy} size='icon'>
                {copied ? (
                  <Check className='size-4' />
                ) : (
                  <Copy className='size-4' />
                )}
              </Button>
            </div>
            <Button
              onClick={onHandleGenerateLink}
              disabled={isLoading}
              variant='link'
              size='sm'
              className='text-xs text-zinc-500 mt-4'
            >
              Generate a new link <RefreshCw className='size-4 ml-2' />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
