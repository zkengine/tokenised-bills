import { PayableAbi } from '@/abis/payable';
import ActionItemButton from '@/components/common/action-item-button';
import { ConfirmIcon } from '@/components/common/icons';
import PartTxProcessingModal from '@/components/part/shared/part-tx-processing-modal';
import useWriteContractWithReceipt from '@/hooks/use-write-contract-with-receipt';
import { NETWORK_CONFIG } from '@/lib/constants';
import { Payable } from '@/typings';
import { useMemo, useState } from 'react';
import { useChainId } from 'wagmi';

interface Props {
  payable: Payable | undefined;
  onConfirmedHandler: () => void;
}
const ConfirmButton = ({ payable, onConfirmedHandler }: Props) => {
  const [openLoadingModal, setLoadingModal] = useState(false);

  const chainId = useChainId();
  const networkContracts = useMemo(
    () => NETWORK_CONFIG[chainId].contracts,
    [chainId]
  );

  const { write, txHash, isSuccess, failureReason, isError } =
    useWriteContractWithReceipt();

  const onConfirmationHandler = () => {
    if (!payable || !payable.id) return;

    setLoadingModal(true);

    write({
      abi: PayableAbi,
      address: networkContracts.invoiceAddress,
      functionName: 'confirm',
      args: [BigInt(payable.id!)],
    });
  };

  const onTxModalClose = () => {
    setLoadingModal(false);

    if (isSuccess) {
      onConfirmedHandler();
    }
  };

  return (
    <>
      <ActionItemButton
        primaryText={'Confirm'}
        secondaryText={`Confirm the invoice data #${payable?.id}`}
        errorText={undefined}
        startIcon={<ConfirmIcon />}
        actionHandler={onConfirmationHandler}
      />

      {openLoadingModal && (
        <PartTxProcessingModal
          tx={{
            txHash: txHash,
            isError,
            isSuccess,
            failureReason: failureReason,
            successText: `${
              isSuccess ? `You have successfully confirmed this invoice` : ''
            }`,
            defaultText: 'You are confirming...',
          }}
          onTxModalClose={onTxModalClose}
          invoiceNumber={payable?.id}
        />
      )}
    </>
  );
};

export default ConfirmButton;
