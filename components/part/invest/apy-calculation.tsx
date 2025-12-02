import { ReceivablesPoolings } from '@/graphql/queries';
import { NETWORK_CONFIG } from '@/lib/constants';
import { formatUnixToDate } from '@/lib/utils';
import { PackagedReceivable, Pooling } from '@/typings';
import { Box, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { CashFlow, xirr } from '@webcarrot/xirr';
import request from 'graphql-request';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';

const ApyCalculation = () => {
  const chainId = useChainId();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      return request(
        NETWORK_CONFIG[chainId].graphUrl,
        ReceivablesPoolings
      ).then(
        (response: { ReceivablesPooling: Pooling[] }) =>
          response?.ReceivablesPooling ?? []
      );
    },
    refetchInterval: 60 * 1000, // 1 minute
  });

  const soldData =
    data?.map((val: Pooling) => ({
      amount: -Number(formatUnits(val.soldAmount, 6)),
      date: formatUnixToDate(val.blockTimestamp),
    })) ?? [];

  const yieldData =
    data
      ?.flatMap((v: Pooling) => v.receivables)
      ?.map((val: PackagedReceivable) => ({
        amount: Number(formatUnits(val.amount, 6)),
        date: formatUnixToDate(val.dueDate),
      })) ?? [];

  const flows: Array<CashFlow> = soldData.concat(yieldData);
  if (flows.length > 0 && process.env.NODE_ENV !== 'production') {
    console.log('XIRR:', xirr(flows), 'of', JSON.stringify(flows));
  }

  if (isError) {
    console.error('error to fetch stats data, msg:', error.message ?? error);
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {isPending ? (
          <Skeleton className='w-11' />
        ) : (
          <Typography fontSize={24} fontWeight={700} className='text-primary'>
            {flows.length > 0 ? `${(xirr(flows) * 100).toFixed(2)}%` : '-'}
          </Typography>
        )}
        <Typography color='#2C2C2C' fontWeight={500} fontSize={14}>
          APY
        </Typography>
      </Box>
    </>
  );
};

export default ApyCalculation;
