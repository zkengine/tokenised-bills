import { svgAbi } from '@/abis/svg';
import { NETWORK_CONFIG } from '@/lib/constants';
import { toBase64 } from '@/lib/utils';
import classNames from 'classnames';
import { useMemo } from 'react';
import { ScaleLoader } from 'react-spinners';
import { useChainId, useReadContract } from 'wagmi';

interface Props {
  usedFor: 'payable' | 'receivable';
  invoiceNumber: string | undefined;
  className?: string;
}
const SvgBox = ({ usedFor, invoiceNumber, className }: Props) => {
  const chainId = useChainId();

  const networkContracts = useMemo(
    () => NETWORK_CONFIG[chainId].contracts,
    [chainId]
  );

  const result = useReadContract({
    abi: svgAbi,
    address:
      usedFor === 'payable'
        ? networkContracts.invoiceSvgAddress
        : networkContracts.receivableSvgAddress,
    functionName: 'generateSVG',
    args: [
      usedFor === 'payable'
        ? networkContracts.invoiceAddress
        : networkContracts.receivableAddress,
      BigInt(invoiceNumber!),
    ],
    query: {
      enabled: !!invoiceNumber,
    },
  });

  return (
    <div
      className={classNames(
        'flex h-[85%] min-h-122.5 justify-center pt-4',
        className
      )}
    >
      {!!result.data ? (
        <img src={toBase64(result.data)} className='w-full' />
      ) : (
        // <svg data-src={toBase64(result.data)} className="w-full" data-cache="disabled" />
        <div role='status' className='flex items-center justify-center'>
          <ScaleLoader color='#FF5C00' />
        </div>
      )}
    </div>
  );
};

export default SvgBox;
