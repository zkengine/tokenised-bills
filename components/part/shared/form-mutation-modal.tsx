import DefaultButton from '@/components/common/default-button';
import FullscreenModal from '@/components/common/fullscreen-modal';
import { ArrowBackIcon } from '@/components/common/icons';
import { Stack } from '@mui/material';
import classNames from 'classnames';
import { JSX } from 'react';

interface Props {
  actionTitle: string;
  showModal?: boolean;
  actionBtnDisabled?: boolean;
  children: JSX.Element;
  onModalClose: () => void;
  onActionHandler: () => void;
}

const FormMutationModal = ({
  actionTitle,
  actionBtnDisabled = false,
  onModalClose,
  children,
  onActionHandler,
}: Props) => {
  return (
    <>
      <FullscreenModal
        header={
          <ArrowBackIcon
            className='w-fit'
            sx={{ height: '1rem', cursor: 'pointer' }}
            onClick={onModalClose}
          />
        }
        contentClassName='px-[1.5rem]'
        footer={
          <DefaultButton
            btnName={actionTitle}
            className={classNames(
              'w-45',
              actionBtnDisabled && 'cursor-not-allowed!'
            )}
            variant='contained'
            onClick={onActionHandler}
            disabled={actionBtnDisabled}
          />
        }
        footerClassName='flex items-center justify-center mx-[1.0625rem]'
        maxWidth='xs'
        fullWidth
      >
        <form noValidate autoComplete='off'>
          <Stack className='mt-5 gap-8'>{children}</Stack>
        </form>
      </FullscreenModal>
    </>
  );
};

export default FormMutationModal;
