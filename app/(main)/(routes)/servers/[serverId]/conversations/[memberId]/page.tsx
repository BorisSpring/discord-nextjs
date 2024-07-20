import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/chat/MediaRoom';
import { findOrCreateConversation } from '@/lib/actions/conversation.action';
import React from 'react';

interface Props {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const ConversationIdPage = async ({ params, searchParams }: Props) => {
  const { conversation, otherMember, loggedMember } =
    await findOrCreateConversation({
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
      {!searchParams.video && (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            member={loggedMember}
            chatId={conversation.id}
            apiUrl='/api/direct-messages'
            socketUrl='/api/socket/direct-messages'
            socketQuery={{
              serverId: params?.serverId,
              conversationId: conversation.id,
            }}
            paramKey='conversationId'
            paramValue={conversation.id}
            type='conversation'
          />
          <ChatInput
            name={otherMember.profile.name}
            type='conversation'
            apiUrl='/api/socket/direct-messages'
            query={{ conversationId: conversation.id }}
          />
        </>
      )}

      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ConversationIdPage;
