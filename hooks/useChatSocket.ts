import { useSocketContext } from '@/components/theme-provider/SocketProvider';
import { MessageWithMemberWithProfile } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (prevData: any) => {
        if (!prevData || !prevData.pages) return;

        const newData = prevData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) return message;
              console.log('retunrin item');
              return item;
            }),
          };
        });

        return { ...prevData, pages: newData };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (prevData: any) => {
        if (!prevData || !prevData.pages) {
          return {
            pages: [{ items: [message] }],
          };
        }

        const newData = [...prevData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return { ...prevData, pages: newData };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [addKey, updateKey, socket, queryKey, queryClient]);
};
