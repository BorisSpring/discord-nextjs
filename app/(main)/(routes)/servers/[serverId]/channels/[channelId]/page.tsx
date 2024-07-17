import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import { findChannelByServerIdAndChannelId } from '@/lib/actions/channel.action';
import React from 'react';

interface Props {
  params: {
    channelId: string;
    serverId: string;
  };
}

const ChannelIdPage = async ({ params }: Props) => {
  const { channel, member } = await findChannelByServerIdAndChannelId({
    serverId: params.serverId,
    channelId: params.channelId,
  });

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
      />
      <ChatMessages
        member={member}
        name={channel.name}
        type='channel'
        apiUrl='/api/messages'
        socketUrl='/api/socket/messages'
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        chatId={channel.id}
        paramKey='channelId'
        paramValue={channel.id}
      />
      <ChatInput
        type='channel'
        name={channel.name}
        query={{ channelId: channel.id, serverId: params.serverId }}
        apiUrl='/api/socket/messages'
      />
    </div>
  );
};

export default ChannelIdPage;
