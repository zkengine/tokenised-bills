import closeAlt from '@/assets/images/close-alt.svg';
import plusPrimary from '@/assets/images/plus-primary.svg';
import noinvioceImage from '@/assets/invioce/no-invioce.svg';
import NoDataFound from '@/components/common/no-data-found';
import QuerySelect from '@/components/common/query-select';
import InvoiceCard from '@/components/part/shared/invoice-card';
import InvoiceSkeleton from '@/components/part/shared/invoice-skeleton';
import { PayablesQuery } from '@/graphql/queries';
import { NETWORK_CONFIG, dueInItems, stateItems } from '@/lib/constants';
import { getDayDiffs, unixTimestampInDays } from '@/lib/utils';
import { pageSizeAtom } from '@/states';
import { Payable } from '@/typings';
import { Drawer, Grid, Stack } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { useAccount, useChainId } from 'wagmi';
import CreateInvoice from '../issue';
import CardActions from './card-actions';

const Payables = () => {
  const [state, setState] = useState('');
  const [dueIn, setDueIn] = useState('');
  const [openActionDrawer, setOpenActionDrawer] = useState(false);
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<Payable>();

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
  } = useInfiniteQuery({
    queryKey: ['payables', chainId, account, state, dueIn],
    queryFn: async ({ pageParam = 1 }) => {
      if (!account || !chainId) {
        return [];
      }

      return request(NETWORK_CONFIG[chainId].graphUrl, PayablesQuery, {
        pageSize,
        skip: (pageParam - 1) * pageSize,
        account,
        states: queryStates.map(Number),
        dueIn: queryDueIn,
      })
        .then((response: { Invoice: Payable[] }) => {
          return response?.Invoice;
        })
        .catch((error: Error) => {
          console.log(error);
          return [];
        });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.length >= pageSize ? allPages.length + 1 : undefined;
      return nextPage;
    },
    enabled: !!account && !!chainId,
  });

  const drawerCloseHandler = useCallback(() => {
    setOpenActionDrawer(false);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useLayoutEffect(() => {
    setTimeout(() => {
      drawerCloseHandler();
    }, 0);
  }, [chainId, account, drawerCloseHandler]);

  const stateConverter = (state: string, dueDate: string) => {
    return state === '0'
      ? 'tbc'
      : state === '1'
      ? getDayDiffs(dueDate) > 0
        ? 'unpaid'
        : 'overdue'
      : state === '2'
      ? 'finalised'
      : '';
  };

  if (!account || status === 'pending') {
    return <InvoiceSkeleton />;
  }

  return (
    <>
      <Stack
        className='w-full'
        direction={'row'}
        justifyContent={'space-between'}
        my={1.5}
      >
        <div className='mb-[-0.45rem] flex w-[80%] flex-row justify-start'>
          <QuerySelect
            label='Status'
            value={state}
            changeHandler={setState}
            menuItems={stateItems}
          />

          <QuerySelect
            label='Due In'
            value={dueIn}
            changeHandler={setDueIn}
            menuItems={dueInItems}
          />
        </div>
      </Stack>

      {(!data || data.pages.flatMap((val) => val).length === 0) &&
      !hasNextPage ? (
        <NoDataFound title='payables'>
          <Image
            src={noinvioceImage}
            alt='no payables found'
            className='h-24 w-24'
          />
        </NoDataFound>
      ) : (
        <>
          <Grid
            container
            spacing={2}
            className='w-full'
            sx={{ height: '100%' }}
          >
            {data?.pages.map((payables: Payable[], pageIdx: number) =>
              payables.map((payable: Payable, idx: number) => {
                return (
                  <Grid size={{ xs: 12, md: 6 }} key={`${pageIdx}-${idx}`}>
                    <InvoiceCard
                      title='payable of Tax Invoice'
                      innerRef={payables.length === idx + 1 ? ref : null}
                      data={payable}
                      state={stateConverter(
                        payable.state || '0',
                        payable.dueDate
                      )}
                      onClick={() => {
                        setSelectedPayable(payable);
                        setOpenActionDrawer(true);
                      }}
                    />
                  </Grid>
                );
              })
            )}

            {isFetchingNextPage && (
              <Grid size={{ xs: 12 }}>
                <div className='text-primary mt-3 text-center'>Loading...</div>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {openActionDrawer && (
        <CardActions
          payable={selectedPayable}
          openActionDrawer={openActionDrawer}
          onDrawerCloseHandler={drawerCloseHandler}
        />
      )}

      <div
        className='fixed bottom-6 mr-6 z-50 flex h-[60px] w-[60px] cursor-pointer items-center justify-center self-end rounded-full bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)]'
        onClick={() => setOpenCreateDrawer(true)}
        title='Issue a new invoice'
      >
        <Image src={plusPrimary} alt='create invoice' width={24} height={24} />
      </div>

      <Drawer
        anchor='bottom'
        open={openCreateDrawer}
        onClose={() => setOpenCreateDrawer(false)}
        PaperProps={{
          className: 'h-full w-full',
          style: { height: '100%', width: '100%' },
        }}
      >
        <div className='relative h-full w-full flex flex-col'>
          <div className='absolute right-6 top-6 z-50'>
            <Image
              src={closeAlt}
              alt='close'
              className='cursor-pointer'
              onClick={() => setOpenCreateDrawer(false)}
            />
          </div>
          <section className='overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full h-full'>
            <CreateInvoice />
          </section>
        </div>
      </Drawer>
    </>
  );
};

export default Payables;
