import CloseAltIcon from '@/assets/images/close-alt.svg';
import noinvioceImage from '@/assets/invioce/no-invioce.svg';
import DefaultButton from '@/components/common/default-button';
import FullscreenModal from '@/components/common/fullscreen-modal';
import { ArrowBackIcon } from '@/components/common/icons';
import Modal from '@/components/common/modal';
import NoDataFound from '@/components/common/no-data-found';
import InvoiceCard from '@/components/part/shared/invoice-card';
import InvoiceSkeleton from '@/components/part/shared/invoice-skeleton';
import { receivableQueryOptions } from '@/lib/query';
import { getDayDiffs, toggleElement, unixTimestampInDays } from '@/lib/utils';
import { pageSizeAtom } from '@/states';
import { Receivable } from '@/typings';
import { Box, Checkbox, Stack } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ScaleLoader } from 'react-spinners';
import { useAccount, useChainId } from 'wagmi';
import EstimatedScreen from './estimated-screen';

interface Props {
  onSellFinishHandler: () => void;
}
const SellableList = ({ onSellFinishHandler }: Props) => {
  const [state] = useState(['0']);
  const [dueIn] = useState(unixTimestampInDays(365 * 99));
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedReceivables, setSelectedReceivables] = useState<Receivable[]>(
    []
  );
  const [startEstimation, setStartEstimation] = useState(false);
  const [isEstimated, setEstimated] = useState(false);

  const { address: account } = useAccount();
  const chainId = useChainId();

  const pageSize = useAtomValue(pageSizeAtom);

  const { ref, inView } = useInView();

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
      state: '0',
      dueIn: `${dueIn}`,
      queryStates: state,
      queryDueIn: dueIn,
    })
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (startEstimation) {
      timerId = setTimeout(() => {
        setSelectedReceivables(
          data?.pages
            .flatMap((val: Receivable[]) => val)
            .filter((val) => selectedItems.includes(val.id!)) || []
        );
        setEstimated(true);
      }, 3000);
    }
    return () => clearTimeout(timerId);
  }, [startEstimation, setStartEstimation, setEstimated, data, selectedItems]);

  const onCloseHandler = (succeeded?: boolean) => {
    refetch();
    setStartEstimation(false);
    setEstimated(false);

    if (succeeded) {
      onSellFinishHandler();
    }
  };

  return (
    <>
      <FullscreenModal
        header={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              <ArrowBackIcon
                className='w-fit sm:hidden'
                sx={{ height: '1rem', cursor: 'pointer' }}
                onClick={onSellFinishHandler}
              />
            </span>
            <span>Sell Receivables</span>
            <span>
              <div
                className='hidden cursor-pointer sm:flex'
                onClick={onSellFinishHandler}
              >
                <Image src={CloseAltIcon} alt='close-alt' />
              </div>
            </span>
          </Box>
        }
        footer={
          <DefaultButton
            btnName='Sell'
            className={classNames('w-45')}
            variant='contained'
            onClick={() => setStartEstimation(true)}
            disabled={
              status === 'pending' ||
              selectedItems.length === 0 ||
              startEstimation
            }
          />
        }
        isOpen={true}
        onModalClose={onSellFinishHandler}
        contentClassName='flex justify-center sm:min-w-[500px]'
        footerClassName='flex items-center justify-center'
      >
        {status === 'pending' ? (
          <Stack className='w-[90%] sm:w-full' direction={'column'}>
            <InvoiceSkeleton />
          </Stack>
        ) : (!data || data.pages.flatMap((val) => val).length === 0) &&
          !hasNextPage ? (
          <NoDataFound title='sellable receivables'>
            <Image
              src={noinvioceImage}
              alt='no receivables found'
              className='h-24 w-24'
            />
          </NoDataFound>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', gap: 26 }}>
            {data?.pages.map((receivables: Receivable[]) =>
              receivables.map((receivable, idx) => {
                return (
                  <ListItem
                    alignItems='center'
                    key={idx}
                    onClick={() =>
                      setSelectedItems((prev) =>
                        toggleElement(prev, receivable.id!)
                      )
                    }
                    className='w-full gap-2'
                  >
                    <Checkbox
                      inputProps={{ 'aria-label': 'controlled' }}
                      className='w-fit px-0'
                      checked={selectedItems.includes(receivable.id!)}
                      color='default'
                    />
                    <InvoiceCard
                      key={idx}
                      title='receivable'
                      innerRef={receivables.length === idx + 1 ? ref : null}
                      data={receivable}
                      state={
                        getDayDiffs(receivable.invoice.dueDate) > 0
                          ? 'unpaid'
                          : 'overdue'
                      }
                    />
                  </ListItem>
                );
              })
            )}

            {isFetchingNextPage && (
              <div className='text-primary mt-3 text-center'>Loading...</div>
            )}
          </List>
        )}
      </FullscreenModal>

      {startEstimation && (
        <Modal
          isOpen={startEstimation}
          onClose={onCloseHandler}
          showCloseIcon
          modalClassName='w-[80%] !p-2 sm:min-w-[595px]'
        >
          <div className='mb-8 flex flex-col gap-8 text-center'>
            <div role='status' className='flex items-center justify-center'>
              <ScaleLoader color='#FF5C00' />
            </div>
            <div className='text-primary mb-3 text-base font-semibold'>
              The system is evaluating the value of selected assets
            </div>
          </div>
        </Modal>
      )}

      {isEstimated && (
        <EstimatedScreen
          receivables={selectedReceivables}
          onEstimatedModalClose={onCloseHandler}
        />
      )}
    </>
  );
};

export default SellableList;
