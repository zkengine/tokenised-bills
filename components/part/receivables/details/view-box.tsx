import { CheckIcon, CopyIcon } from '@/components/common/icons';
import useCopyClipboard from '@/hooks/use-copy-clipboard';
import { shortenAddress } from '@/lib/utils';
import { NetworkConfig } from '@/typings';
import { Theme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import InvoiceImageModal from './invoice-image-modal';

interface Props {
  tokenId: string | undefined;
  invoiceNumber: string | undefined;
  networkConfig: NetworkConfig;
}

const ViewBox = ({ tokenId, invoiceNumber, networkConfig }: Props) => {
  const [isCopied, onCopy] = useCopyClipboard();
  const [showInvoiceImageModal, setShowInvoiceImageModal] = useState(false);
  const isOnMobileScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  const goto = () => {
    window.open(
      `${networkConfig.blockExplorer.nft}/${networkConfig.contracts.receivableAddress}/${tokenId}`,
      isOnMobileScreen ? '_blank' : '_ample-art'
    );
  };

  return (
    <>
      <div className='flex w-full items-center justify-center py-[24px]'>
        <div className='w-[80%] gap-[5px] text-[14px]'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-[#6E747A]'>Invoice image</span>
            <span
              className='cursor-pointer text-[#0D1821]'
              onClick={() => setShowInvoiceImageModal(true)}
            >
              Click to check
            </span>
          </div>

          <div className='flex flex-row items-center justify-between'>
            <span className='text-[#6E747A]'>Contract address</span>
            <div className='flex items-center'>
              <span
                onClick={goto}
                className='mr-2 cursor-pointer text-[#0D1821]'
              >
                {shortenAddress(networkConfig.contracts.receivableAddress)}
              </span>
              {isCopied ? (
                <CheckIcon />
              ) : (
                <span
                  className='cursor-pointer'
                  onClick={() =>
                    onCopy(networkConfig.contracts.receivableAddress)
                  }
                >
                  <CopyIcon />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInvoiceImageModal && (
        <InvoiceImageModal
          onModalClose={() => setShowInvoiceImageModal(!showInvoiceImageModal)}
          invoiceId={invoiceNumber || tokenId}
        />
      )}
    </>
  );
};

export default ViewBox;
