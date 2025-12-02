import { NETWORK_CONFIG } from '@/lib/constants';
import { Receivable } from '@/typings';
import { useInfiniteQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';

interface Props {
  state: string;
  dueIn: string;
  pageSize: number;
  queryStates: string[];
  queryDueIn: number;
  queryDoc: string;
  sortBy: string;
  sortDirection?: string;
}
const useInfiniteQueryWrapper = ({
  state,
  dueIn,
  pageSize,
  queryStates,
  queryDueIn,
  queryDoc,
  sortBy,
  sortDirection = 'asc',
}: Props) => {
  const chainId = useChainId();
  const { address } = useAccount();

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    ...rest
  } = useInfiniteQuery({
    queryKey: ['receivables', chainId, address, state, dueIn],
    queryFn: async ({ pageParam = 1 }) => {
      return request(NETWORK_CONFIG[chainId].graphUrl, queryDoc, {
        pageSize,
        skip: (pageParam - 1) * pageSize,
        account: address,
        states: queryStates,
        dueIn: `${queryDueIn}`,
        sortBy: sortBy,
        sortDirection: sortDirection,
      }).then(
        (response: { receivables: Receivable[] }) => response?.receivables || []
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.length >= pageSize ? allPages.length + 1 : undefined;
      return nextPage;
    },
    enabled: !!address,
  });

  return useMemo(
    () => ({
      data,
      status,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch,
      ...rest,
    }),
    [
      data,
      status,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch,
      rest,
    ]
  );
};

export default useInfiniteQueryWrapper;
