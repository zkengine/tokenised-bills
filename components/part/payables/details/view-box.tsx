import { CheckIcon, CopyIcon } from '@/components/common/icons';
import useCopyClipboard from '@/hooks/use-copy-clipboard';
import { NETWORK_CONFIG } from '@/lib/constants';
import { shortenAddress } from '@/lib/utils';
import { Payable } from '@/typings';
import { Theme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';

interface Props {
  invoice?: Payable;
}

const ViewBox = ({ invoice }: Props) => {
  const [isInvoiceToCopied, onCopyInvoiceTo] = useCopyClipboard();
  const [isContractAddrCopied, onCopyContractAddr] = useCopyClipboard();
  const chainId = useChainId();

  const network = useMemo(() => NETWORK_CONFIG[chainId], [chainId]);
  const isOnMobileScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  const goto = () => {
    window.open(
      `${network.blockExplorer.nft}/${network.contracts.invoiceAddress}/${invoice?.id}`,
      isOnMobileScreen ? '_blank' : '_ample-art'
    );
  };

  return (
    <div className='w-[80%] gap-[5px] text-[14px]'>
      {!!invoice?.buyerAddr && (
        <div className='mb-2 flex flex-row items-center justify-between'>
          <span className='text-[#6E747A]'>Invoice To</span>
          <div className='flex items-center'>
            <a
              href={`${network.blockExplorer.address}/${invoice.buyerAddr}`}
              target={isOnMobileScreen ? '_blank' : '_ample-art'}
              className='mr-2 cursor-pointer text-[#0D1821]'
            >
              {shortenAddress(invoice.buyerAddr)}
            </a>
            {isInvoiceToCopied ? (
              <CheckIcon />
            ) : (
              <span
                className='cursor-pointer'
                onClick={() => onCopyInvoiceTo(invoice.buyerAddr)}
              >
                <CopyIcon />
              </span>
            )}
          </div>
        </div>
      )}

      {invoice?.invoiceLink && (
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-[#6E747A]'>Suppl. documents</span>
          <a
            href={
              invoice.invoiceLink.startsWith('http')
                ? invoice.invoiceLink
                : `https://${invoice.invoiceLink}`
            }
            target={isOnMobileScreen ? '_blank' : '_ample-art'}
            className='text-[#0D1821]'
          >
            Click to view
          </a>
        </div>
      )}

      <div className='flex flex-row items-center justify-between'>
        <span className='text-[#6E747A]'>Contract address</span>
        <div className='flex items-center'>
          <span onClick={goto} className='mr-2 cursor-pointer text-[#0D1821]'>
            {shortenAddress(network.contracts.invoiceAddress)}
          </span>
          {isContractAddrCopied ? (
            <CheckIcon />
          ) : (
            <span
              className='cursor-pointer'
              onClick={() =>
                onCopyContractAddr(network.contracts.invoiceAddress)
              }
            >
              <CopyIcon />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBox;
