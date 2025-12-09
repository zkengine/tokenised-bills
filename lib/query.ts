import { ReceivablesQuery } from '@/graphql/queries';
import { Receivable } from '@/typings';
import { infiniteQueryOptions } from '@tanstack/react-query';
import request from 'graphql-request';
import { Hex } from 'viem';
import { NETWORK_CONFIG } from './constants';

interface ReceivableQueryOption {
  chainId: number;
  account: Hex | undefined;
  pageSize: number;
  state: string;
  dueIn: string;
  queryStates: string[];
  queryDueIn: number;
}
export const receivableQueryOptions = ({
  chainId,
  account,
  pageSize,
  state,
  dueIn,
  queryStates,
  queryDueIn,
}: ReceivableQueryOption) => {
  return infiniteQueryOptions({
    queryKey: ['receivables', chainId, account, state, dueIn],
    queryFn: async ({ pageParam = 1 }) => {
      return request(NETWORK_CONFIG[chainId].graphUrl, ReceivablesQuery, {
        pageSize,
        skip: (pageParam - 1) * pageSize,
        account,
        states: queryStates,
        dueIn: queryDueIn,
        // sortBy: 'invoice__dueDate',
        // sortDirection: 'asc',
      }).then((response: { Receivable: Receivable[] }) => response?.Receivable);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.length >= pageSize ? allPages.length + 1 : undefined;
      return nextPage;
    },
    enabled: !!account && !!chainId,
  });
};
