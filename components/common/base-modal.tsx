import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import classNames from 'classnames';
import { JSX, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  header?: JSX.Element;
  footer?: JSX.Element;
  modalClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  isOpen?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  onModalClose?: () => void;
}

const BaseModal = ({
  header,
  children,
  footer,
  modalClassName,
  headerClassName,
  contentClassName,
  footerClassName,
  isOpen = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  onModalClose,
}: Props) => {
  const onCloseHandler = (reason: string) => {
    if (
      (reason === 'backdropClick' && !closeOnOverlayClick) ||
      (reason === 'escapeKeyDown' && !closeOnEscape)
    ) {
      return;
    }

    onModalClose?.();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onCloseHandler}
        // className={classNames('bg-white', modalClassName)}
      >
        <div className='fixed inset-0 bg-black/30' aria-hidden='true' />

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <div
              className={classNames(
                'my-6 mt-16 flex max-w-2xl flex-col rounded-lg bg-white p-2 text-black',
                modalClassName
              )}
            >
              {header && (
                <DialogTitle className={headerClassName}>{header}</DialogTitle>
              )}

              <DialogContent
                className={classNames('p-2 sm:p-6', contentClassName)}
              >
                {children}
              </DialogContent>

              {footer && (
                <DialogActions
                  className={classNames(
                    'mb-3 flex items-center justify-center',
                    footerClassName
                  )}
                >
                  {footer}
                </DialogActions>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default BaseModal;
