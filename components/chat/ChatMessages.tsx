'use client';
import { Member } from '@prisma/client';
import React, { Fragment } from 'react';
import ChatWelcome from './ChatWelcome';
import { Loader2, ServerCrash } from 'lucide-react';
import { useChatQuery } from '../../hooks/useChatQuery';
import { MessageWithMemberWithProfile } from '@/lib/types';
import ChatItem from './ChatItem';
import { formatDate } from 'date-fns';

interface Props {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: Props) => {
  const { data, fetchNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey: `chat:${chatId}`,
    apiUrl,
    paramKey,
    paramValue,
  });

  console.log({ data });

  if (status === 'pending') {
    return (
      <div className='flex flex-col flex-1 items-center justify-center'>
        <Loader2 className='size-8 text-zinc-500 my-4 animate-spin' />
        <p>Loading messages...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex flex-col flex-1 items-center justify-center'>
        <ServerCrash className='size-8 text-zinc-500 my-4' />
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
      <div className='flex-1' />
      <ChatWelcome type={type} name={name} />
      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                currentMember={member}
                member={message.member}
                key={message.id}
                id={message.id}
                content={message.content}
                deleted={message.deleted}
                fileUrl={message.fileUrl}
                timestamp={formatDate(message.createdAt, 'd MMM yyyy HH:mm')}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
