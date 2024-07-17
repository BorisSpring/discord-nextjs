import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import { findOrCreateConversation } from '@/lib/actions/conversation.action';
import React from 'react';

interface Props {
  params: {
    memberId: string;
    serverId: string;
  };
}

const ConversationIdPage = async ({ params }: Props) => {
  const { conversation, otherMember } = await findOrCreateConversation({
    serverId: params.serverId,
    memberId: params.memberId,
  });

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type='conversation'
      />
      <div className='flex-1'>future messages</div>
      {/* <ChatInput type='channel' name='' /> */}
    </div>
  );
};

export default ConversationIdPage;
