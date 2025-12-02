import noinvioceImage from '@/assets/invioce/no-invioce.svg';
import DefaultButton from '@/components/common/default-button';
import NoDataFound from '@/components/common/no-data-found';
import QuerySelect from '@/components/common/query-select';
import CardActions from '@/components/part/receivables/card-actions';
import InvoiceCard from '@/components/part/shared/invoice-card';
import InvoiceSkeleton from '@/components/part/shared/invoice-skeleton';
import { dueInItems, recvStateItems } from '@/lib/constants';
import { receivableQueryOptions } from '@/lib/query';
import { getDayDiffs, unixTimestampInDays } from '@/lib/utils';
import { pageSizeAtom } from '@/states';
import { Receivable } from '@/typings';
import SellIcon from '@mui/icons-material/Sell';
import { Stack } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAccount, useChainId } from 'wagmi';
import SellableList from './sell/sellable-list';

const Receivables = () => {
  const [state, setState] = useState('');
  const [dueIn, setDueIn] = useState('');
  const [openActionDrawer, setOpenActionDrawer] = useState(false);
  const [startSellProcess, setStartSellProcess] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable>();

  const { address: account } = useAccount();
  const chainId = useChainId();

  const pageSize = useAtomValue(pageSizeAtom);

  const { ref, inView } = useInView();

  const queryStates = useMemo(
    () => (state === '' ? ['0', '1', '2'] : [state]),
    [state]
  );
  const queryDueIn = useMemo(
    () => unixTimestampInDays(dueIn === '' ? 365 * 99 : Number(dueIn)),
    [dueIn]
  );

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    receivableQueryOptions({
      chainId,
      account,
      pageSize,
      state,
      dueIn,
      queryStates,
      queryDueIn,
    })
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const stateConverter = (state: string, dueDate: string) => {
    return state === '0'
      ? getDayDiffs(dueDate) > 0
        ? 'unpaid'
        : 'overdue'
      : state === '1'
      ? 'paid'
      : 'finalised';
  };

  const drawerCloseHandler = () => {
    setOpenActionDrawer(false);
    setStartSellProcess(false);
    refetch();
  };

  if (!account || status === 'pending') {
    return <InvoiceSkeleton />;
  }

  return (
    <>
      <Stack
        className='w-full'
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        my={1.5}
      >
        <div className='mb-[-0.45rem] flex w-[80%] flex-row justify-start'>
          <QuerySelect
            label='Status'
            value={state}
            changeHandler={setState}
            menuItems={recvStateItems}
          />

          <QuerySelect
            label='Due In'
            value={dueIn}
            changeHandler={setDueIn}
            menuItems={dueInItems}
          />
        </div>

        {data && data.pages.flatMap((val) => val).length > 0 && (
          <DefaultButton
            btnName='Sell'
            onClick={() => setStartSellProcess(true)}
            className='!hover:bg-[#FFAA00] mx-0! h-[1.6625rem]! w-19.25! bg-[#ff7d13]!'
            startIcon={<SellIcon />}
          />
        )}
      </Stack>

      {(!data || data.pages.flatMap((val) => val).length === 0) &&
      !hasNextPage ? (
        <NoDataFound title='receivables'>
          <Image
            src={noinvioceImage}
            alt='no receivables found'
            className='h-24 w-24'
          />
        </NoDataFound>
      ) : (
        <Stack
          className='w-full'
          direction={'column'}
          gap={2}
          height={'100%'}
          mb={2}
        >
          {data?.pages.map((receivables: Receivable[]) =>
            receivables.map((receivable, idx) => {
              return (
                <InvoiceCard
                  key={idx}
                  title='receivable'
                  innerRef={receivables.length === idx + 1 ? ref : null}
                  data={receivable}
                  state={stateConverter(
                    receivable.state || '0',
                    receivable.invoice.dueDate
                  )}
                  onClick={() => {
                    setSelectedReceivable(receivable);
                    setOpenActionDrawer(true);
                  }}
                />
              );
            })
          )}

          {isFetchingNextPage && (
            <div className='text-primary mt-3 text-center'>Loading...</div>
          )}
        </Stack>
      )}

      {openActionDrawer && (
        <CardActions
          receivable={selectedReceivable}
          openActionDrawer={openActionDrawer}
          onDrawerCloseHandler={drawerCloseHandler}
        />
      )}

      {startSellProcess && (
        <SellableList onSellFinishHandler={drawerCloseHandler} />
      )}
    </>
  );
};

export default Receivables;
