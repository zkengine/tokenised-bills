import ArrowLeft from '@/assets/images/arrow-left.svg';
import SvgBox from '@/components/part/shared/svg-box';
import { Dialog, DialogTitle } from '@mui/material';
import Image from 'next/image';

interface Props {
  onModalClose: () => void;
  invoiceId?: string;
}

const InvoiceImageModal = ({ onModalClose, invoiceId }: Props) => {
  return (
    <>
      <Dialog
        open={true}
        onClose={onModalClose}
        className='fixed inset-0 flex items-center justify-center overflow-y-auto bg-[#000000]/40'
      >
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <div className='my-6 mt-16 flex w-full max-w-2xl flex-col rounded-lg bg-white px-2 py-6 text-black sm:min-w-[595px]'>
              <DialogTitle className='p-0!'>
                <Image
                  src={ArrowLeft}
                  alt='arrow-left'
                  className='cursor-pointer'
                  onClick={onModalClose}
                />
              </DialogTitle>
              <SvgBox invoiceNumber={invoiceId} usedFor='payable' />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default InvoiceImageModal;
