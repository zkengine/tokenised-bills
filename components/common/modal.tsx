import CloseAltIcon from '@/assets/images/close-alt.svg';
import BaseModal from '@/components/common/base-modal';
import classNames from 'classnames';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
  showCloseIcon?: boolean;
  closeOnOverlayClick?: boolean;
  modalClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const Modal = ({
  isOpen,
  children,
  title = '',
  onClose,
  showCloseIcon,
  closeOnOverlayClick = false,
  modalClassName = '',
  headerClassName,
  contentClassName,
}: Props) => {
  const modalHeader = (
    <>
      <div className='text-[1.7143rem] font-semibold text-black'>{title}</div>
      {showCloseIcon && !!onClose && (
        <div className='cursor-pointer' onClick={onClose}>
          <Image src={CloseAltIcon} alt='close' width={18} height={18} />
        </div>
      )}
    </>
  );

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onModalClose={onClose}
        modalClassName={classNames('fixed', modalClassName)}
        closeOnOverlayClick={closeOnOverlayClick}
        closeOnEscape={false}
        header={modalHeader}
        headerClassName={classNames(
          'flex items-center justify-between p-6',
          headerClassName
        )}
        contentClassName={contentClassName}
      >
        {children}
      </BaseModal>
    </>
  );
};

export default Modal;
