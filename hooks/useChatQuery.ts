import qs from 'query-string';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSocketContext } from '@/components/theme-provider/SocketProvider';
import axios from 'axios';

interface Props {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramValue,
  paramKey,
}: Props) => {
  const { isConntected } = useSocketContext();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam = undefined }) => {
      const url = qs.stringifyUrl(
        {
          url: apiUrl,
          query: {
            cursor: pageParam,
            [paramKey]: paramValue,
          },
        },
        { skipNull: true }
      );
      const res = await axios.get(url).then((res) => res.data);

      return res;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    refetchInterval: isConntected ? undefined : 1000,
  });

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    status,
    hasNextPage,
    isFetching,
    error,
  };
};
