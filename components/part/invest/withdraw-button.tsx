import ActionItemButton from '@/components/common/action-item-button';
import { ClaimIcon } from '@/components/common/icons';
import TxHandlingModal from '@/components/common/tx-handling-modal';
import useWriteContractWithReceipt from '@/hooks/use-write-contract-with-receipt';
import { investmentRecordAtom, poolInfoAtom } from '@/states';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { Hex, erc4626Abi, formatUnits, getAddress, parseUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import FormMutationModal from '../shared/form-mutation-modal';
import MutationForm from './mutation-form';

interface Props {
  poolAddress: Hex;
  underlyAssetAddr: Hex | undefined;
  onDrawerCloseHandler: () => void;
}
const WithdrawButton = ({
  poolAddress,
  underlyAssetAddr,
  onDrawerCloseHandler,
}: Props) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [onSubmitting, setOnSubmitting] = useState(false);
  const [openLoadingModal, setLoadingModal] = useState(false);
  const [requiredApprove, setRequiredApprove] = useState(false);
  const [amount, setAmount] = useState<string>('');

  const investedRecord = useAtomValue(investmentRecordAtom);
  const poolInfo = useAtomValue(poolInfoAtom);

  const { address } = useAccount();
  const { write, txHash, isSuccess, failureReason, isError } =
    useWriteContractWithReceipt();

  const result = useReadContract({
    abi: erc4626Abi,
    address: poolAddress,
    functionName: 'maxWithdraw',
    args: [address!],
    query: {
      enabled: !!poolAddress && !!address,
    },
  });

  const formattedMaxWithdrawAmount = formatUnits(
    result.data ?? 0n,
    poolInfo.decimals
  );
  const amountHasError = Number(amount) > Number(formattedMaxWithdrawAmount);

  const onInvestSubmit = () => {
    if (!poolAddress || !underlyAssetAddr || !address || Number(amount) < 1)
      return;

    setOnSubmitting(true);
    setLoadingModal(true);
    setRequiredApprove(false);

    const parsedAmount = parseUnits(amount, poolInfo.decimals);
    write({
      abi: erc4626Abi,
      address: poolAddress,
      functionName: 'withdraw',
      args: [parsedAmount, address, address],
    });
  };

  const onTxModalClose = () => {
    result.refetch();
    setOnSubmitting(false);
    setLoadingModal(false);
    setRequiredApprove(false);

    if (!requiredApprove && isSuccess) {
      setAmount('');
      setShowWithdrawModal(false);
      onDrawerCloseHandler();
    }
  };

  return (
    <>
      {!!investedRecord.investedAmount &&
        !!investedRecord.poolAddress &&
        !!poolAddress &&
        !!address &&
        !!investedRecord.address &&
        getAddress(address) === getAddress(investedRecord.address) &&
        getAddress(investedRecord.poolAddress) === getAddress(poolAddress) && (
          <ActionItemButton
            primaryText='Withdraw'
            secondaryText='Withdraw investments'
            startIcon={<ClaimIcon />}
            disabled={false}
            actionHandler={() => setShowWithdrawModal(true)}
          />
        )}

      {showWithdrawModal && (
        <FormMutationModal
          actionTitle='Withdraw'
          onModalClose={onDrawerCloseHandler}
          onActionHandler={onInvestSubmit}
          actionBtnDisabled={(amountHasError && onSubmitting) || !amount}
        >
          <MutationForm
            secondaryAmountLabel='Maximum redemption'
            secondaryAmountValue={result.data ?? 0n}
            decimalsResult={poolInfo.decimals}
            symbolResult={poolInfo?.symbol?.slice(1)}
            amountHasError={amountHasError}
            onSubmitting={onSubmitting}
            amount={amount}
            formattedAssetBalance={formattedMaxWithdrawAmount}
            onInputChange={(e) => {
              setAmount(
                `${
                  parseInt(e.target.value) < 1
                    ? 1
                    : Number(e.target.value) >
                      Number(formattedMaxWithdrawAmount)
                    ? Number(formattedMaxWithdrawAmount)
                    : Number(e.target.value)
                }`
              );
            }}
            onClickMaxButton={() => {
              setAmount(
                formatUnits(BigInt(result.data || '0'), poolInfo.decimals)
              );
            }}
          />
        </FormMutationModal>
      )}

      {openLoadingModal && (
        <TxHandlingModal
          tx={{
            txHash: txHash,
            isError,
            isSuccess,
            failureReason: failureReason,
            successText: `${
              isSuccess ? `You have successfully withdrawn` : ''
            }`,
            defaultText: `${`You are withdrawing...`}`,
          }}
          closeTxConfirmation={onTxModalClose}
          modalClassName='min-w-[256px]'
        />
      )}
    </>
  );
};

export default WithdrawButton;
