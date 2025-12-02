import { useCallback, useMemo } from 'react';
import { BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { WriteParams } from '@/typings';

const useWriteContractWithReceipt = () => {
  const {
    writeContract,
    data: txHash,
    error: txAttemptError,
    isError: isTxAttemptError,
    failureReason: txAttemptFailureReason,
  } = useWriteContract();
  const {
    isError: isTxReceiptError,
    error: txReceiptError,
    isSuccess,
    failureReason: txReceiptFailureReason,
  } = useWaitForTransactionReceipt({
    hash: txHash!,
    query: {
      enabled: !!txHash,
    },
  });

  const write = useCallback(
    (writeContractParms: WriteParams) => {
      if (writeContractParms?.abi && writeContractParms?.address && writeContractParms?.functionName) {
        writeContract({ ...writeContractParms });
      }
    },
    [writeContract],
  );

  const failureReason = useMemo(
    () =>
      isTxReceiptError
        ? txReceiptFailureReason?.message ||
          (txReceiptError as BaseError)?.shortMessage ||
          (txReceiptError as BaseError)?.message
        : isTxAttemptError
          ? txAttemptFailureReason?.message ||
            (txAttemptError as BaseError)?.shortMessage ||
            (txAttemptError as BaseError)?.message
          : undefined,
    [
      isTxReceiptError,
      txReceiptFailureReason?.message,
      txReceiptError,
      isTxAttemptError,
      txAttemptFailureReason?.message,
      txAttemptError,
    ],
  );

  return useMemo(
    () => ({
      write,
      txHash,
      txAttemptError,
      isTxAttemptError,
      isTxReceiptError,
      isError: isTxAttemptError || isTxReceiptError,
      isSuccess,
      txReceiptError,
      failureReason,
    }),
    [write, txHash, txAttemptError, isTxAttemptError, isTxReceiptError, isSuccess, txReceiptError, failureReason],
  );
};

export default useWriteContractWithReceipt;
