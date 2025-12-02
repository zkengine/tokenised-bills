import { PayableAbi } from '@/abis/payable';
import ActionItemButton from '@/components/common/action-item-button';
import { PayIcon } from '@/components/common/icons';
import PartTxProcessingModal from '@/components/part/shared/part-tx-processing-modal';
import useWriteContractWithReceipt from '@/hooks/use-write-contract-with-receipt';
import { NETWORK_CONFIG, QUERY_GC_TIME } from '@/lib/constants';
import { Payable } from '@/typings';
import { CircularProgress } from '@mui/material';
import { useMemo, useState } from 'react';
import { erc20Abi } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';

interface Props {
  payable: Payable | undefined;
  onPaidHandler: () => void;
}
const PayButton = ({ payable, onPaidHandler }: Props) => {
  const [openLoadingModal, setLoadingModal] = useState(false);
  const [requiredApprove, setRequiredApprove] = useState(false);

  const chainId = useChainId();
  const { address } = useAccount();
  const networkContracts = useMemo(
    () => NETWORK_CONFIG[chainId].contracts,
    [chainId]
  );

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: networkContracts.uaContract.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        address: networkContracts.uaContract.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address!, networkContracts.invoiceAddress],
      },
    ],
    query: {
      enabled: !!address,
      gcTime: QUERY_GC_TIME,
      refetchInterval: 3000,
    },
  });
  const [balance, allowance] = data || [];

  const { primaryText, isDisabled, errorText } = useMemo(() => {
    const ret = { primaryText: 'Pay', isDisabled: false, errorText: '' };

    if (
      !!balance?.status &&
      Number(balance?.result ?? '0') < Number(payable?.totalValue)
    ) {
      return {
        ...ret,
        isDisabled: true,
        errorText: 'Insufficient balance to pay the invoice.',
      };
    } else if (
      allowance?.status === 'success' &&
      allowance?.result < Number(payable?.totalValue)
    ) {
      return { ...ret, primaryText: 'Approve to Pay' };
    }

    return ret;
  }, [balance, allowance, payable]);

  const { write, txHash, isSuccess, failureReason, isError } =
    useWriteContractWithReceipt();

  const onPaymentHandler = () => {
    if (!payable || !payable.id) return;

    setLoadingModal(true);
    setRequiredApprove(false);

    if (
      allowance?.status === 'success' &&
      allowance.result < Number(payable.totalValue)
    ) {
      setRequiredApprove(true);
      write({
        abi: erc20Abi,
        address: networkContracts.uaContract.address,
        functionName: 'approve',
        args: [networkContracts.invoiceAddress, BigInt(payable.totalValue!)],
      });
    } else {
      write({
        abi: PayableAbi,
        address: networkContracts.invoiceAddress,
        functionName: 'pay',
        args: [BigInt(payable.id!)],
      });
    }
  };

  const onTxModalClose = () => {
    refetch();
    setLoadingModal(false);
    setRequiredApprove(false);

    if (!requiredApprove && isSuccess) {
      onPaidHandler();
    }
  };

  return (
    <>
      <ActionItemButton
        primaryText={primaryText}
        secondaryText={`Pay your invoice #${payable?.id}`}
        errorText={errorText}
        startIcon={
          isLoading ? (
            <CircularProgress color='inherit' size={16} />
          ) : (
            <PayIcon />
          )
        }
        disabled={isLoading || isDisabled}
        actionHandler={onPaymentHandler}
      />

      {openLoadingModal && (
        <PartTxProcessingModal
          tx={{
            txHash: txHash,
            isError,
            isSuccess,
            failureReason: failureReason,
            successText: `${
              isSuccess
                ? `You have successfully ${
                    requiredApprove ? 'approved' : 'paid'
                  } this invoice`
                : ''
            }`,
            defaultText: `${`You are ${
              requiredApprove ? 'approving' : 'paying'
            }...`}`,
          }}
          onTxModalClose={onTxModalClose}
          invoiceNumber={payable?.id}
        />
      )}
    </>
  );
};

export default PayButton;
