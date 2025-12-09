import { WriteParams } from '@/typings';
import { useCallback, useMemo } from 'react';
import { ContractFunctionRevertedError } from 'viem';
import { mantleSepoliaTestnet } from 'viem/chains';
import {
  BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

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
    chainId: mantleSepoliaTestnet.id,
  });

  const write = useCallback(
    (writeContractParms: WriteParams) => {
      if (
        writeContractParms?.abi &&
        writeContractParms?.address &&
        writeContractParms?.functionName
      ) {
        writeContract({ ...writeContractParms, chain: mantleSepoliaTestnet });
      }
    },
    [writeContract]
  );

  const failureReason = useMemo(
    () =>
      isTxReceiptError
        ? (txReceiptFailureReason as BaseError)?.shortMessage ||
          (txReceiptFailureReason as BaseError)?.details ||
          (txReceiptError as ContractFunctionRevertedError)?.reason ||
          (txReceiptError as BaseError)?.shortMessage ||
          (txReceiptError as BaseError)?.details ||
          (txReceiptError as BaseError)?.message
        : isTxAttemptError
        ? (txAttemptFailureReason as ContractFunctionRevertedError)?.reason ||
          (txAttemptFailureReason as BaseError)?.shortMessage ||
          (txAttemptFailureReason as BaseError)?.details ||
          (txAttemptError as BaseError)?.shortMessage ||
          (txAttemptError as BaseError)?.details ||
          (txAttemptError as BaseError)?.message
        : undefined,
    [
      isTxReceiptError,
      txReceiptFailureReason,
      txReceiptError,
      isTxAttemptError,
      txAttemptFailureReason,
      txAttemptError,
    ]
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
    [
      write,
      txHash,
      txAttemptError,
      isTxAttemptError,
      isTxReceiptError,
      isSuccess,
      txReceiptError,
      failureReason,
    ]
  );
};

export default useWriteContractWithReceipt;
