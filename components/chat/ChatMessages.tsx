'use client';
import { Member } from '@prisma/client';
import React, { ElementRef, Fragment, useRef } from 'react';
import ChatWelcome from './ChatWelcome';
import { Loader2, ServerCrash } from 'lucide-react';
import { useChatQuery } from '../../hooks/useChatQuery';
import { MessageWithMemberWithProfile } from '@/lib/types';
import ChatItem from './ChatItem';
import { formatDate } from 'date-fns';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatScroll } from '@/hooks/useChatScroll';

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
  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { data, fetchNextPage, isFetchingNextPage, status, hasNextPage } =
    useChatQuery({
      queryKey: `chat:${chatId}`,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatScroll({
    chatRef,
    bottomRef,
    shoudLoadMore: !isFetchingNextPage && hasNextPage,
    loadMore: fetchNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  useChatSocket({
    queryKey: `chat:${chatId}`,
    updateKey: `chat:${chatId}:messages:update`,
    addKey: `chat:${chatId}:messages`,
  });

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
    <div
      ref={chatRef}
      className='flex-1 flex flex-col py-4 overflow-y-auto   scrollbar-thin dark:scrollbar-thumb-zinc-500  scrollbar-thumb-zinc-700'
    >
      {!hasNextPage ? (
        <>
          <div className='flex-1' />
          <ChatWelcome type={type} name={name} />
        </>
      ) : (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='animate-spin size-6 text-zinc-500 my-4' />
          ) : (
            <button
              className='text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 text-xs my-4'
              onClick={() =>
                !isFetchingNextPage && hasNextPage && fetchNextPage()
              }
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

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
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
