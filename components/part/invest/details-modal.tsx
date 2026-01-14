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
        contentClassName='!w-full !max-w-md sm:!max-w-2xl mx-auto'
      >
        <Card sx={{ width: '100%', mt: 3, border: 1, borderColor: '#B1B1B1' }}>
          <CardContent sx={{ py: 3, px: { xs: 2, sm: 4 } }}>
            {/* Header Section */}
            <Box mb={3}>
              <Typography
                fontSize={{ xs: 16, sm: 18 }}
                fontWeight={700}
                mb={0.5}
              >
                {poolInfo.name}
              </Typography>
              <Typography
                className='text-xs sm:text-sm leading-6 font-medium tracking-[0.15px] text-[#2C2C2C] cursor-pointer hover:underline'
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

            {/* APY Section */}
            <Box mb={3}>
              <ApyCalculation />
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mb: 3 }} />

            {/* Pool Statistics - Grid Layout on Large Screens */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2, sm: 3 },
                mb: 3,
              }}
            >
              <Box>
                <Typography className='text-xs font-medium text-[#666] mb-1'>
                  Total Supply Amount
                </Typography>
                <Typography className='text-sm sm:text-base font-semibold text-[#2c2c2c]'>
                  {`${formatCurrency(
                    formatUnits(poolInfo.totalSupply, poolInfo.decimals)
                  )} ${assetSymbol}`}
                </Typography>
              </Box>

              <Box>
                <Typography className='text-xs font-medium text-[#666] mb-1'>
                  Remaining
                </Typography>
                <Typography className='text-sm sm:text-base font-semibold text-[#2c2c2c]'>
                  {`${formatCurrency(
                    formatUnits(poolInfo.availableAssets, poolInfo.decimals)
                  )} ${assetSymbol}`}
                </Typography>
              </Box>

              <Box>
                <Typography className='text-xs font-medium text-[#666] mb-1'>
                  Invested
                </Typography>
                <Typography className='text-sm sm:text-base font-semibold text-[#2c2c2c]'>
                  {`${formatCurrency(
                    formatUnits(poolInfo.totalInvested, poolInfo.decimals)
                  )} ${assetSymbol}`}
                </Typography>
              </Box>

              <Box>
                <Typography className='text-xs font-medium text-[#666] mb-1'>
                  Receivables Value
                </Typography>
                <Typography className='text-sm sm:text-base font-semibold text-[#2c2c2c]'>
                  {`${formatCurrency(
                    formatUnits(
                      poolInfo.totalValueOfReceivables,
                      poolInfo.decimals
                    )
                  )} ${assetSymbol}`}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mb: 3 }} />

            {/* My Investment Section */}
            <Box>
              <Typography className='text-sm font-bold text-black mb-2'>
                My Investment
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: '#F5F5F5',
                  borderRadius: 1,
                }}
              >
                <Typography className='text-xs font-medium text-[#666]'>
                  Amount
                </Typography>
                <Typography className='text-sm sm:text-base font-semibold text-[#2c2c2c]'>
                  {`${formatCurrency(
                    formatUnits(
                      investmentRecord.investedAmount,
                      poolInfo.decimals
                    )
                  )} ${assetSymbol}`}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </FullscreenModal>
    </>
  );
};

export default DetailsModal;
