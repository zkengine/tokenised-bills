import CloseAltIcon from '@/assets/images/close-alt.svg';
import DefaultButton from '@/components/common/default-button';
import FullscreenModal from '@/components/common/fullscreen-modal';
import { ArrowBackIcon, CheckIcon, CopyIcon } from '@/components/common/icons';
import InvoiceCard from '@/components/part/shared/invoice-card';
import useCopyClipboard from '@/hooks/use-copy-clipboard';
import { NETWORK_CONFIG } from '@/lib/constants';
import { formatCurrency, getDayDiffs, shortenAddress } from '@/lib/utils';
import { uaTokenInfoAtom } from '@/states';
import { Receivable } from '@/typings';
import {
  Box,
  Divider,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import SellConfirmationButton from './sell-confirmation-button';

interface Props {
  receivables: Receivable[];
  onEstimatedModalClose: (succeeded?: boolean) => void;
}
const EstimatedScreen = ({ receivables, onEstimatedModalClose }: Props) => {
  const uaTokenInfo = useAtomValue(uaTokenInfoAtom);
  const [isCopied, onCopy] = useCopyClipboard();
  const chainId = useChainId();
  const network = useMemo(() => NETWORK_CONFIG[chainId], [chainId]);

  const assetTotalValue = receivables.reduce(
    (prev, curr) => prev + BigInt(curr.amount),
    0n
  );
  const isOnMobileScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

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
                onClick={() => onEstimatedModalClose()}
              />
            </span>
            <span>Sell Receivables</span>
            <span>
              <div
                className='hidden cursor-pointer sm:flex'
                onClick={() => onEstimatedModalClose()}
              >
                <Image src={CloseAltIcon} alt='close-alt' />
              </div>
            </span>
          </Box>
        }
        footer={
          <>
            <SellConfirmationButton
              receivables={receivables}
              onSucceededHandler={onEstimatedModalClose}
            />

            <DefaultButton
              btnName='Cancel'
              variant='contained'
              className='!hover:bg-[#EBEBEB]/80 ml-0! w-full! bg-[#EBEBEB]! text-[#2C2C2C]!'
              color='info'
              onClick={() => onEstimatedModalClose()}
            />
          </>
        }
        isOpen={true}
        onModalClose={onEstimatedModalClose}
        headerClassName='px-2'
        modalClassName='w-full'
        contentClassName='flex justify-center sm:min-w-[500px] mb-5'
        footerClassName='flex flex-col gap-3 w-full'
      >
        <Stack
          className='w-full px-2'
          direction={'column'}
          gap={1}
          height={'100%'}
          mb={2}
        >
          <Stack
            direction={'column'}
            bgcolor={'#F6F6F6'}
            sx={{ gap: 1.8, p: 2 }}
          >
            <div className='flex items-center justify-between gap-1.25'>
              <Typography fontWeight={500} fontSize={16}>
                Layer of Selected Assets
              </Typography>
              <DefaultButton
                btnName='Senior'
                variant='outlined'
                className='border-primary text-primary! mx-0 h-5 w-fit! border! bg-transparent! text-xs capitalize!'
                size='small'
                onClick={() => {}}
              />
            </div>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <div className='py-1 flex items-center justify-between'>
              <Typography
                className='text-xs'
                color={'#666666'}
                fontWeight={600}
              >
                Receive Funds
              </Typography>
              <span className='flex items-center'>
                <Typography color={'#FF5C00'} fontSize={16} fontWeight={700}>
                  {formatCurrency(
                    formatUnits(
                      BigInt(Number(assetTotalValue) * 0.9),
                      uaTokenInfo.decimals
                    )
                  )}
                </Typography>
                <Typography fontSize={16} fontWeight={500}>
                  &nbsp;{uaTokenInfo.symbol}
                </Typography>
              </span>
            </div>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div className='flex items-center justify-between'>
                <Typography
                  fontWeight={600}
                  className='text-xs'
                  color={'#666666'}
                >
                  Asset Value:
                </Typography>
                <Typography
                  fontWeight={500}
                  className='text-xs'
                  color={'#000000'}
                >
                  {formatCurrency(
                    formatUnits(assetTotalValue, uaTokenInfo.decimals)
                  )}{' '}
                  {uaTokenInfo.symbol}
                </Typography>
              </div>
              <div className='flex items-center justify-between'>
                <Typography
                  fontWeight={600}
                  className='text-xs'
                  color={'#666666'}
                >
                  Discounted Rate:
                </Typography>
                <Typography fontWeight={500} className='text-xs'>
                  10%
                </Typography>
              </div>
              <div className='flex items-center justify-between'>
                <Typography
                  fontWeight={600}
                  className='text-xs'
                  color={'#666666'}
                >
                  Receiving Asset Address:
                </Typography>
                <div className='flex justify-center text-xs'>
                  <a
                    href={`${network.blockExplorer.token}/${network.contracts.uaContract.address}`}
                    target={isOnMobileScreen ? '_blank' : '_ample-art'}
                  >
                    {shortenAddress(network.contracts.uaContract.address)}
                  </a>
                  {isCopied ? (
                    <CheckIcon className='w-fit' sx={{ height: '1rem' }} />
                  ) : (
                    <CopyIcon
                      className='w-fit pl-1'
                      sx={{ height: '1rem', cursor: 'pointer' }}
                      onClick={() =>
                        onCopy(network.contracts.uaContract.address)
                      }
                    />
                  )}
                </div>
              </div>
            </Box>
          </Stack>
          <Typography className='mt-5 text-[0.875rem] font-semibold'>
            Sell List
          </Typography>
          <Divider sx={{ borderStyle: 'dashed' }} />

          {!!receivables &&
            receivables.map((r, idx) => {
              return (
                <InvoiceCard
                  key={idx}
                  title='receivable'
                  data={r}
                  state={
                    getDayDiffs(r.invoice.dueDate) > 0 ? 'unpaid' : 'overdue'
                  }
                />
              );
            })}
        </Stack>
      </FullscreenModal>
    </>
  );
};

export default EstimatedScreen;
