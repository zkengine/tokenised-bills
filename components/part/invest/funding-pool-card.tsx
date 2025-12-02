import { fundingPoolAbi } from '@/abis/fundingPool';
import { hyperPoolingAbi } from '@/abis/part';
import { ArrowForwardIcon } from '@/components/common/icons';
import { NETWORK_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { investmentRecordAtom, poolInfoAtom } from '@/states';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  IconButtonProps,
  Skeleton,
  Typography,
  styled,
} from '@mui/material';
import { useSetAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { Hex, erc20Abi, erc4626Abi, formatUnits } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';
import InvoiceSkeleton from '../shared/invoice-skeleton';
import ApyCalculation from './apy-calculation';
import DrawerCardActions from './card-actions';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Props {
  fpAddress: Hex;
}
const FundingPoolCard: FC<Props> = ({ fpAddress, ...props }) => {
  const [expanded, setExpanded] = useState(true);
  const [openActionDrawer, setOpenActionDrawer] = useState(false);
  const setInvestmentRecord = useSetAtom(investmentRecordAtom);
  const setPoolInfo = useSetAtom(poolInfoAtom);

  const { address } = useAccount();
  const chainId = useChainId();

  const erc20Contract = {
    address: fpAddress,
    abi: erc20Abi,
  } as const;
  const erc4626Contract = {
    address: fpAddress,
    abi: erc4626Abi,
  } as const;

  const { data, isLoading, refetch, isPending, isSuccess } = useReadContracts({
    contracts: [
      {
        ...erc20Contract,
        functionName: 'name',
      },
      {
        ...erc20Contract,
        functionName: 'symbol',
      },
      {
        ...erc20Contract,
        functionName: 'decimals',
      },
      {
        ...erc4626Contract,
        functionName: 'totalAssets',
      },
      {
        abi: fundingPoolAbi,
        address: fpAddress,
        functionName: 'totalAssetsSupplied',
      },
      {
        abi: fundingPoolAbi,
        address: fpAddress,
        functionName: 'suppliedAssets',
        args: [address!],
      },
      {
        abi: fundingPoolAbi,
        address: fpAddress,
        functionName: 'asset',
      },
      {
        abi: hyperPoolingAbi,
        address: NETWORK_CONFIG[chainId].contracts.diamondAddress,
        functionName: 'getPooledAssetsValue',
        args: [fpAddress],
      },
    ],
    query: {
      enabled: !!address,
    },
  });
  const [
    name,
    symbol,
    decimals,
    totalAssets,
    totalAssetsSupplied,
    suppliedAssets,
    asset,
    getPooledAssetsValue,
  ] = data || [];
  const nameResult = name?.result ?? '';
  const symbolResult = symbol?.result ?? 'SSGD';
  const decimalsResult = decimals?.result ?? 6;
  const totalAssetsResult = totalAssets?.result ?? 0n;
  const totalSupplyResult = totalAssetsSupplied?.result ?? 0n;
  const myInvestment = suppliedAssets?.result ?? 0n;
  const underlyAssetAddr = asset?.result;
  const pooledAssetsValue = getPooledAssetsValue?.result ?? 0n;
  const assetSymbol = symbolResult?.slice(1);

  useEffect(() => {
    if (!!address && isSuccess) {
      setInvestmentRecord((oldVal) => ({
        ...oldVal,
        investedAmount: myInvestment,
        address: address,
        poolAddress: fpAddress,
      }));
      setPoolInfo((prevInfo) => ({
        ...prevInfo,
        poolAddress: fpAddress,
        totalSupply: totalSupplyResult,
        availableAssets: totalAssetsResult,
        totalInvested: totalSupplyResult - totalAssetsResult,
        totalValueOfReceivables: pooledAssetsValue,
        name: nameResult,
        symbol: symbolResult,
        decimals: decimalsResult,
      }));
    }
  }, [
    myInvestment,
    address,
    symbolResult,
    nameResult,
    totalSupplyResult,
    totalAssetsResult,
    decimalsResult,
    pooledAssetsValue,
    isSuccess,
    setInvestmentRecord,
    setPoolInfo,
    fpAddress,
  ]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const drawerCloseHandler = () => {
    refetch();
    setOpenActionDrawer(false);
  };

  if (isLoading) {
    <InvoiceSkeleton />;
  }

  return (
    <>
      <Card
        sx={{
          width: '100%',
          mt: 3,
          border: 1,
          borderColor: '#B1B1B1',
          cursor: 'pointer',
        }}
        {...props}
        onClick={() => {
          if (!!suppliedAssets && !!address) {
            setOpenActionDrawer(true);
          }
        }}
      >
        <CardHeader
          action={<ArrowForwardIcon className='h-4' />}
          title={nameResult}
          className='text-base font-bold'
        />
        <CardContent>
          <ApyCalculation />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mt: 3,
            }}
          >
            <Box
              sx={{
                width: '45%',
                gap: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className='text-[#666]'
                fontWeight={500}
                fontSize={12}
              >
                Total Supply Amount
              </Typography>
              {isPending || !address ? (
                <Skeleton />
              ) : (
                <Typography
                  className='text-[#2C2C2C]'
                  fontWeight={500}
                  fontSize={14}
                >
                  {`${formatCurrency(
                    formatUnits(totalSupplyResult!, decimalsResult!)
                  )} ${assetSymbol}`}
                </Typography>
              )}
            </Box>

            <Divider flexItem orientation='vertical' />

            <Box
              sx={{
                width: '45%',
                gap: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className='text-[#666]'
                fontWeight={500}
                fontSize={12}
              >
                Remaining
              </Typography>
              {isPending || !address ? (
                <Skeleton />
              ) : (
                <Typography
                  className='text-[#2C2C2C]'
                  fontWeight={500}
                  fontSize={14}
                >
                  {`${formatCurrency(
                    formatUnits(totalAssetsResult!, decimalsResult!)
                  )} ${assetSymbol}`}
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mt: 3,
            }}
          >
            <Box
              sx={{
                width: '45%',
                gap: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className='text-[#666]'
                fontWeight={500}
                fontSize={12}
              >
                Receivables Value
              </Typography>
              {!address || isPending ? (
                <Skeleton />
              ) : (
                <Typography
                  className='text-[#2C2C2C]'
                  fontWeight={500}
                  fontSize={14}
                >
                  {`${formatCurrency(
                    formatUnits(pooledAssetsValue, decimalsResult)
                  )} ${assetSymbol}`}
                </Typography>
              )}
            </Box>

            <Divider flexItem orientation='vertical' />

            <Box
              sx={{
                width: '45%',
                gap: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className='text-[#666]'
                fontWeight={500}
                fontSize={12}
              >
                Invested
              </Typography>
              {isPending || !address ? (
                <Skeleton />
              ) : (
                <Typography
                  className='text-[#2C2C2C]'
                  fontWeight={500}
                  fontSize={14}
                >
                  {`${formatCurrency(
                    formatUnits(
                      totalSupplyResult! - totalAssetsResult!,
                      decimalsResult!
                    )
                  )} ${assetSymbol}`}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
        <Divider sx={{ borderStyle: 'dashed', pb: 0, mb: 0, mx: 2 }} />
        <CardActions
          disableSpacing
          className='hidden! items-center justify-between'
        >
          <Typography className='pl-2!'>My Investment:</Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={true} timeout='auto' unmountOnExit>
          <CardContent>
            <Typography fontSize={11} fontWeight={700} className='leading-5.5'>
              My Investment:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              pr={1}
            >
              <Typography
                className='text-[#666]'
                fontWeight={500}
                fontSize={12}
              >
                Amount
              </Typography>
              {!myInvestment || !decimalsResult || !address || !assetSymbol ? (
                <span>-</span>
              ) : (
                <Typography
                  className='text-[#2C2C2C]'
                  fontWeight={500}
                  fontSize={12}
                >
                  {`${formatCurrency(
                    formatUnits(myInvestment, decimalsResult)
                  )} ${assetSymbol}`}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Collapse>
      </Card>

      {openActionDrawer && (
        <DrawerCardActions
          poolAddress={fpAddress}
          underlyAssetAddr={underlyAssetAddr}
          openActionDrawer={openActionDrawer}
          onDrawerCloseHandler={drawerCloseHandler}
        />
      )}
    </>
  );
};

export default FundingPoolCard;
