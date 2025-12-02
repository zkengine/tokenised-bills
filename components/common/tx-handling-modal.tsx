import FailureIcon from '@/assets/images/failure.svg';
import SuccessIcon from '@/assets/images/success.svg';
import Modal from '@/components/common/modal';
import { NETWORK_CONFIG } from '@/lib/constants';
import { Transaction } from '@/typings';
import { Theme, useMediaQuery } from '@mui/material';
import classNames from 'classnames';
import Image from 'next/image';
import { ReactNode, useMemo } from 'react';
import { ScaleLoader } from 'react-spinners';
import { Hash } from 'viem';
import { useChainId } from 'wagmi';

const ViewOnExpolorer = ({ txHash }: { txHash: Hash }) => {
  const chainId = useChainId();
  const network = useMemo(() => NETWORK_CONFIG[chainId], [chainId]);
  const isOnMobileScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  return (
    <a
      href={`${network.blockExplorer.tx}/${txHash}`}
      className='mx-auto mt-3 text-[#FF9104]'
      target={isOnMobileScreen ? '_blank' : '_ample-art'}
    >
      View on Explorer
    </a>
  );
};

export const FailureContent = ({ tx }: { tx: Transaction }) => {
  return (
    <div className='flex w-full flex-col gap-8'>
      <Image src={FailureIcon} alt='failure' className='mx-auto' />
      <div className='text-center text-base text-[#EC364C]'>
        {tx.failureReason}
      </div>

      <div className='flex flex-col items-center justify-center text-xs text-[#6E747A]'>
        Something&apos;s not right.
        {tx.txHash && <ViewOnExpolorer txHash={tx.txHash} />}
      </div>
    </div>
  );
};

export const SucessContent = ({ tx }: { tx: Transaction }) => {
  return (
    <div className='flex w-full flex-col gap-8'>
      <Image src={SuccessIcon} alt='success' className='mx-auto' />
      <div className='text-primary mt-3 text-center text-base'>
        {tx.successText}
      </div>
      {tx.txHash && <ViewOnExpolorer txHash={tx.txHash} />}
    </div>
  );
};

export const DefaultContent = ({ tx }: { tx: Transaction }) => {
  return (
    <div className='flex flex-col gap-8'>
      <div className='text-primary mb-3 text-center text-base font-semibold'>
        {tx.defaultText}
      </div>

      <div role='status' className='flex items-center justify-center'>
        <ScaleLoader color='#FF5C00' />
      </div>

      {tx.txHash && <ViewOnExpolorer txHash={tx.txHash} />}
    </div>
  );
};

interface TxHandlingModalProps {
  tx: Transaction;
  closeTxConfirmation: () => void;
  modalClassName?: string;
  children?: ReactNode;
}
const TxHandlingModal = (props: TxHandlingModalProps) => {
  const { tx, closeTxConfirmation, modalClassName, children } = props;

  return (
    <div className='container w-[20.7143rem]'>
      <Modal
        isOpen={true}
        onClose={closeTxConfirmation}
        modalClassName={classNames('!w-[20.7143rem]', modalClassName)}
        showCloseIcon={tx.isError || tx.isSuccess}
        contentClassName='mb-[3rem] mt-[0rem]'
      >
        <div
          className={'flex w-full flex-col items-center justify-center gap-6'}
        >
          {tx.isSuccess ? (
            <SucessContent tx={tx} />
          ) : tx.isError ? (
            <FailureContent tx={tx} />
          ) : (
            <DefaultContent tx={tx} />
          )}
        </div>

        {children}
      </Modal>
    </div>
  );
};

export default TxHandlingModal;
