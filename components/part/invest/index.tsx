import NoInvestImg from '@/assets/images/no-invest.svg';
import NoDataFound from '@/components/common/no-data-found';
import { NETWORK_CONFIG } from '@/lib/constants';
import Image from 'next/image';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import FundingPoolCard from './funding-pool-card';

const Invest = () => {
  const chainId = useChainId();

  const network = useMemo(() => NETWORK_CONFIG[chainId], [chainId]);

  if (
    !network.contracts.fpAddresses ||
    network.contracts.fpAddresses.length === 0
  ) {
    return (
      <NoDataFound title='funding pools'>
        <Image
          src={NoInvestImg}
          alt='no invest products found'
          className='h-24 w-24'
        />
      </NoDataFound>
    );
  }

  return (
    <>
      {network.contracts.fpAddresses.map((fp, idx) => {
        return <FundingPoolCard key={idx} fpAddress={fp} />;
      })}
    </>
  );
};

export default Invest;
