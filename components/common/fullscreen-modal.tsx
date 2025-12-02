import { MediaQuery } from '@/typings';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
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
  fullscreenBasedUponMediaQuery?: MediaQuery;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  onModalClose?: () => void;
}

const FullscreenModal = ({
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
  fullscreenBasedUponMediaQuery = 'sm',
  onModalClose,
}: Props) => {
  const theme = useTheme();
  const fs = useMediaQuery(
    theme.breakpoints.down(fullscreenBasedUponMediaQuery)
  );

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
        fullScreen={fs}
        onClose={onCloseHandler}
        className={classNames('bg-white', modalClassName)}
      >
        {header && (
          <DialogTitle className={headerClassName}>{header}</DialogTitle>
        )}

        <DialogContent className={classNames('p-2 sm:p-6', contentClassName)}>
          {children}
        </DialogContent>

        {footer && (
          <DialogActions className={classNames('mb-3', footerClassName)}>
            {footer}
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default FullscreenModal;
