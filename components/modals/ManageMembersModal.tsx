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
import UserAvatar from '../UserAvatar';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import { usePathname } from 'next/navigation';
import {
  kickUserFromServer,
  updateMemberRole,
} from '@/lib/actions/server.action';

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='size-4 text-indigo-500 ml-1' />,
  ADMIN: <ShieldAlert className='size-4 text-rose-500 ml-1' />,
};

const ManageMembersModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModalStore();
  const pathName = usePathname();

  const [loadingId, setLoadingId] = useState('');

  const { server } = data;

  const isDialogOpen = isOpen && type === 'members';

  const onHandleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const updatedServer = await updateMemberRole({
        memberId,
        role,
        route: pathName!,
        serverId: server?.id,
      });
      if (updatedServer) {
        onOpen('members', { server: updatedServer });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onHandleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const updatedServer = await kickUserFromServer({
        memberId,
        serverId: server?.id,
        route: pathName!,
      });
      onOpen('members', { server: updatedServer });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => onClose()}>
      <DialogContent className='bg-white text-black dark:bg-zinc-800 dark:text-white  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Manage Members
          </DialogTitle>
          <DialogDescription className='text-center my-2'>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {server?.members?.map((member) => (
            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
              <UserAvatar
                src={member.profile.imageUrl}
                fallback={`${member.profile.name.charAt(0)}`}
              />
              <div className='flex flex-col gap-y-1 ml-1'>
                <div className='text-xs font-semibold flex items-center'>
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className='text-xs text-zinc-500 dark:text-zinc-200'>
                  {member.profile.email}
                </p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className='no-focus ml-auto'>
                      <MoreVertical className='no-focus' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='left'>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='flex cursor-pointer items-center'>
                          <ShieldQuestion className='size-4 mr-2' />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className='z-[9999] right-0 bg-black/80'>
                            <DropdownMenuItem
                              onClick={() =>
                                onHandleRoleChange(member.id, 'GUEST')
                              }
                              className='cursor-pointer flex items-center'
                            >
                              <Shield className='size-4 mr-1' />
                              Guest
                              {member?.role === 'GUEST' && (
                                <Check className='size-4 ml-1' />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onHandleRoleChange(member.id, 'MODERATOR')
                              }
                              className='cursor-pointer flex items-center'
                            >
                              <Shield className='size-4 mr-1' />
                              Moderator
                              {member?.role === 'MODERATOR' && (
                                <Check className='size-4 ml-1' />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onHandleKick(member.id)}
                        className='cursor-pointer flex items-center'
                      >
                        <Gavel className='size-4 mr-2' />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              {loadingId === member.id && (
                <Loader2 className='animate-spin text-zinc-500 ml-auto size-4' />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
