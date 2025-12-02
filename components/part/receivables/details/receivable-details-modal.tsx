import Modal from '@/components/common/modal';
import SvgBox from '@/components/part/shared/svg-box';
import { NETWORK_CONFIG } from '@/lib/constants';
import { Receivable } from '@/typings';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import ViewBox from './view-box';

interface Props {
  isPreview: boolean;
  handlePreviewClose: () => void;
  receivable?: Receivable;
}
const ReceivableDetailsModal = ({
  isPreview,
  handlePreviewClose,
  receivable,
}: Props) => {
  const chainId = useChainId();

  const network = useMemo(() => NETWORK_CONFIG[chainId], [chainId]);

  return (
    <Modal
      isOpen={isPreview}
      onClose={handlePreviewClose}
      showCloseIcon
      title={''}
      closeOnOverlayClick={true}
      modalClassName='w-full !p-2 sm:min-w-[595px]'
    >
      <SvgBox invoiceNumber={receivable?.id} usedFor='receivable' />

      <ViewBox
        tokenId={receivable?.id}
        invoiceNumber={receivable?.invoiceNumber}
        networkConfig={network}
      />
    </Modal>
  );
};

export default ReceivableDetailsModal;
