import Modal from '@/components/common/modal';
import SvgBox from '@/components/part/shared/svg-box';
import { Payable } from '@/typings';
import ViewBox from './view-box';

interface Props {
  isPreview: boolean;
  handlePreviewClose: () => void;
  invoice: Payable;
}
const PayableDetailsModal = ({
  isPreview,
  handlePreviewClose,
  invoice,
}: Props) => {
  return (
    <Modal
      isOpen={isPreview}
      showCloseIcon
      closeOnOverlayClick={false}
      onClose={handlePreviewClose}
      modalClassName='w-full sm:min-w-[595px]'
    >
      <>
        <SvgBox invoiceNumber={invoice.id} usedFor='payable' />

        <div className='flex w-full items-center justify-center py-[24px]'>
          <ViewBox invoice={invoice} />
        </div>
      </>
    </Modal>
  );
};

export default PayableDetailsModal;
