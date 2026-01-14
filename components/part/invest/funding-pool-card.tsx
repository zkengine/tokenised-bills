import { fundingPoolAbi } from '@/abis/fundingPool';
import { hyperPoolingAbi } from '@/abis/part';
import { ArrowForwardIcon } from '@/components/common/icons';
import { NETWORK_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { investmentRecordAtom, poolInfoAtom } from '@/states';
import {
  Box,
  Card,
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
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 3,
              mt: 3,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                  fontWeight={600}
                  fontSize={14}
                >
                  {`${formatCurrency(
                    formatUnits(totalSupplyResult!, decimalsResult!)
                  )} ${assetSymbol}`}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                  fontWeight={600}
                  fontSize={14}
                >
                  {`${formatCurrency(
                    formatUnits(totalAssetsResult!, decimalsResult!)
                  )} ${assetSymbol}`}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                  fontWeight={600}
                  fontSize={14}
                >
                  {`${formatCurrency(
                    formatUnits(pooledAssetsValue, decimalsResult)
                  )} ${assetSymbol}`}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                  fontWeight={600}
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
        <Divider sx={{ borderStyle: 'dashed', mx: 2 }} />
        <Collapse in={true} timeout='auto' unmountOnExit>
          <CardContent sx={{ pt: 2, pb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                className='text-[#666]'
                fontWeight={500}
                fontSize={12}
              >
                My Investment:
              </Typography>
              {!myInvestment || !decimalsResult || !address || !assetSymbol ? (
                <Typography
                  className='text-[#2C2C2C]'
                  fontWeight={600}
                  fontSize={14}
                >
                  -
                </Typography>
              ) : (
                <Typography
                  className='text-[#2C2C2C]'
                  fontWeight={600}
                  fontSize={14}
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
