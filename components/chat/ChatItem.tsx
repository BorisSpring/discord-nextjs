'use client';
import { Member, MemberRole, Profile } from '@prisma/client';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';
import ActionToolTip from '../ActionToolTip';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { messageSchema } from '@/lib/validations';
import queryString from 'query-string';
import { useModalStore } from '@/hooks/useModalStore';
import { useParams, useRouter } from 'next/navigation';

interface Props {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | undefined | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='size-4 text-indigo-500 ml-1' />,
  ADMIN: <ShieldAlert className='size-4 text-rose-500 ml-1' />,
};

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: Props) => {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModalStore();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content,
    },
  });

  const fileType = fileUrl?.split('.').pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isOwner = currentMember?.id === member?.id;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileType === 'pdf' && fileUrl;
  const isImage = fileType !== 'pdf' && fileUrl;

  const isSubmiting = form.formState.isSubmitting;

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    const url = queryString.stringifyUrl({
      url: `${socketUrl}/${id}`,
      query: socketQuery,
    });

    try {
      await axios.patch(url, values);
      setIsEditing(false);
      form.reset();
    } catch (error: any) {
      console.error(error?.repsonse?.data?.message);
    } finally {
      setIsEditing(false);
    }
  }

  const onMemberClick = () => {
    if (member?.id === currentMember?.id) return;

    router.push(`/servers/${params?.serverId}/conversations/${member?.id}`);
  };

  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <button
          onClick={onMemberClick}
          className='cursor-pointer hover:drop-shadow-md transition'
        >
          <UserAvatar src={member?.profile?.imageUrl} />
        </button>
        <div className='flex flex-col w-full'>
          <div onClick={onMemberClick} className='flex items-center space-x-2'>
            <div className='flex items-center'>
              <p className='font-semibold text-sm hover:underline cursor-pointer'>
                {member?.profile?.name}
              </p>
              <ActionToolTip label={member?.role} align='center'>
                {roleIconMap[member?.role]}
              </ActionToolTip>
            </div>
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary size-48'
            >
              <Image
                className='size-48 object-cover'
                fill
                src={fileUrl}
                alt='user sent image'
              />
            </a>
          )}

          {isPdf && (
            <div className='relative  flex items-center justify-start w-fit   p-2 mt-2 rounded-md bg-background/10'>
              <FileIcon className='size-10 fill-indigo-200 stroke-indigo-400 ' />
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                  (edited)
                </span>
              )}
            </p>
          )}

          {isEditing && !fileUrl && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex  items-center w-full gap-x-2 pt-2'
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          disabled={isSubmiting}
                          placeholder='Edit Message'
                          {...field}
                          className='no-focus  bg-zinc-100 border-none mt-1 text-sm dark:bg-zinc-700/50 dark:group-hover:bg-zinc-700/60 group-hover:bg-zinc-200 transition'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isSubmiting}
                  size='sm'
                  variant='primary'
                  type='submit'
                >
                  Save
                </Button>
              </form>
              <span className='text-[12px] mt-1 text-zinc-400'>
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border-rounded-sm'>
          {canEditMessage && (
            <ActionToolTip label='Edit' align='center'>
              <Edit
                onClick={() => setIsEditing(true)}
                className='cursor-pointer ml-auto size-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
              />
            </ActionToolTip>
          )}
          <ActionToolTip label='Delete' align='center'>
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className='cursor-pointer ml-auto size-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
            />
          </ActionToolTip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
