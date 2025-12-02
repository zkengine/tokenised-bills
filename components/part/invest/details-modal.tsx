import CloseAltIcon from '@/assets/images/close-alt.svg';
import FullscreenModal from '@/components/common/fullscreen-modal';
import { ArrowBackIcon } from '@/components/common/icons';
import UseCopy from '@/components/common/use-copy';
import { NETWORK_CONFIG } from '@/lib/constants';
import { formatCurrency, shortenAddress } from '@/lib/utils';
import { investmentRecordAtom, poolInfoAtom } from '@/states';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { Hex, formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import ApyCalculation from './apy-calculation';

interface Props {
  poolAddress: Hex;
  underlyAssetAddr: Hex | undefined;
  onDetailsModalClose: () => void;
}
const DetailsModal = ({ poolAddress, onDetailsModalClose }: Props) => {
  const chainId = useChainId();

  const investmentRecord = useAtomValue(investmentRecordAtom);
  const poolInfo = useAtomValue(poolInfoAtom);
  const assetSymbol = poolInfo.symbol?.slice(1);
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
                onClick={onDetailsModalClose}
              />
            </span>
            <Typography fontSize={18} fontWeight={700}>
              {poolInfo.name}
            </Typography>
            <span>
              <div
                className='hidden cursor-pointer sm:flex'
                onClick={onDetailsModalClose}
              >
                <Image src={CloseAltIcon} alt='close' />
              </div>
            </span>
          </Box>
        }
        contentClassName='!w-[22.3125rem] mx-auto'
      >
        <Card sx={{ width: '100%', mt: 3, border: 1, borderColor: '#B1B1B1' }}>
          <CardContent className='my-7'>
            <Box mb={'0.5rem'}>
              <Typography fontSize={16} fontWeight={700}>
                {poolInfo.name}
              </Typography>
              <Typography
                className='text-xs leading-6 font-medium tracking-[0.15px] text-[#2C2C2C]'
                onClick={() =>
                  window.open(
                    `${NETWORK_CONFIG[chainId].blockExplorer.token}/${poolAddress}`,
                    isOnMobileScreen ? '_blank' : '_ample-art'
                  )
                }
              >
                {shortenAddress(poolAddress)} <UseCopy copyText={poolAddress} />
              </Typography>
            </Box>
            <ApyCalculation />

            <Divider className='my-4' sx={{ borderStyle: 'dashed' }} />

            {/* <Box
              display={'hidden'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography className="text-xs font-medium leading-[1.375rem] text-[#666]">
                Investors
              </Typography>
              <Typography className="text-xs font-medium leading-[1.375rem] text-[#2c2c2c]">
                108
              </Typography>
            </Box> */}
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              className='text-xs leading-5.5 font-medium'
            >
              <Typography className='text-xs leading-5.5 font-medium text-[#666]'>
                Total Supply Amount
              </Typography>
              <Typography className='text-xs leading-5.5 font-medium text-[#2c2c2c]'>
                {`${formatCurrency(
                  formatUnits(poolInfo.totalSupply, poolInfo.decimals)
                )} ${assetSymbol}`}
              </Typography>
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography className='text-xs leading-5.5 font-medium text-[#666]'>
                Remaining
              </Typography>
              <Typography className='text-xs leading-5.5 font-medium text-[#2c2c2c]'>
                {`${formatCurrency(
                  formatUnits(poolInfo.availableAssets, poolInfo.decimals)
                )} ${assetSymbol}`}
              </Typography>
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography className='text-xs leading-5.5 font-medium text-[#666]'>
                Invested
              </Typography>
              <Typography className='text-xs leading-5.5 font-medium text-[#2c2c2c]'>
                {`${formatCurrency(
                  formatUnits(poolInfo.totalInvested, poolInfo.decimals)
                )} ${assetSymbol}`}
              </Typography>
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography className='text-xs leading-5.5 font-medium text-[#666]'>
                Receivables Value
              </Typography>
              <Typography className='text-xs leading-5.5 font-medium text-[#2c2c2c]'>
                {`${formatCurrency(
                  formatUnits(
                    poolInfo.totalValueOfReceivables,
                    poolInfo.decimals
                  )
                )} ${assetSymbol}`}
              </Typography>
            </Box>

            <Divider className='my-4' sx={{ borderStyle: 'dashed' }} />

            <Typography className='text-[0.6875rem] leading-5.5 font-bold text-black'>
              My Investment
            </Typography>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography className='text-xs leading-5.5 font-medium text-[#666]'>
                Amount
              </Typography>
              <Typography className='text-xs leading-5.5 font-medium text-[#2c2c2c]'>
                {`${formatCurrency(
                  formatUnits(
                    investmentRecord.investedAmount,
                    poolInfo.decimals
                  )
                )} ${assetSymbol}`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </FullscreenModal>
    </>
  );
};

export default DetailsModal;
