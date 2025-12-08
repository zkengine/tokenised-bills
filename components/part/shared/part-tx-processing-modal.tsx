import TxHandlingModal from '@/components/common/tx-handling-modal';
import UseCopy from '@/components/common/use-copy';
import { NETWORK_CONFIG } from '@/lib/constants';
import { shortenTxHash } from '@/lib/utils';
import { Transaction } from '@/typings';
import { Box, Theme, Typography, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useChainId } from 'wagmi';

interface Props {
  tx: Transaction;
  invoiceNumber: string | undefined;
  onTxModalClose: () => void;
}
const PartTxProcessingModal = ({
  tx,
  invoiceNumber,
  onTxModalClose,
}: Props) => {
  const { txHash, isError, isSuccess } = tx;
  const chainId = useChainId();
  const isOnMobileScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  return (
    <TxHandlingModal
      tx={tx}
      closeTxConfirmation={onTxModalClose}
      modalClassName='min-w-[256px] !p-6'
    >
      {!!txHash && (isError || isSuccess) && (
        <Box sx={{ mt: 9 }}>
          {!!invoiceNumber && (
            <div className='mb-2 flex justify-between'>
              <Typography>Invoice ID</Typography>
              <Typography className='flex justify-center text-sm text-gray-500'>
                #{invoiceNumber}
              </Typography>
            </div>
          )}

          <div className='flex justify-between'>
            <Typography>Tx Hash</Typography>
            <div className='flex items-center justify-center text-sm text-gray-500'>
              <a
                href={`${NETWORK_CONFIG[chainId].blockExplorer.tx}/${txHash}`}
                target={isOnMobileScreen ? '_blank' : '_ample-art'}
              >
                {shortenTxHash(txHash)}
              </a>
              <UseCopy copyText={txHash} />
              <Link
                href={`${NETWORK_CONFIG[chainId].blockExplorer.tx}/${txHash}`}
                target={isOnMobileScreen ? '_blank' : '_ample-art'}
              >
                <FaExternalLinkAlt className='ml-2 h-8' />
              </Link>
            </div>
          </div>
        </Box>
      )}
    </TxHandlingModal>
  );
};

export default PartTxProcessingModal;
