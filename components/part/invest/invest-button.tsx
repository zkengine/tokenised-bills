import ActionItemButton from '@/components/common/action-item-button';
import { InvestIcon } from '@/components/common/icons';
import TxHandlingModal from '@/components/common/tx-handling-modal';
import useWriteContractWithReceipt from '@/hooks/use-write-contract-with-receipt';
import { CircularProgress } from '@mui/material';
import { useMemo, useState } from 'react';
import { Hex, erc20Abi, erc4626Abi, formatUnits, parseUnits } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';
import FormMutationModal from '../shared/form-mutation-modal';
import MutationForm from './mutation-form';

interface Props {
  poolAddress: Hex;
  underlyAssetAddr: Hex | undefined;
  onDrawerCloseHandler: () => void;
}
const InvestButton = ({
  poolAddress,
  underlyAssetAddr,
  onDrawerCloseHandler,
}: Props) => {
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [onSubmitting, setOnSubmitting] = useState(false);
  const [openLoadingModal, setLoadingModal] = useState(false);
  const [requiredApprove, setRequiredApprove] = useState(false);
  const [amount, setAmount] = useState<string>('');

  const { address } = useAccount();
  const { write, txHash, isSuccess, failureReason, isError } =
    useWriteContractWithReceipt();

  const erc20Contract = {
    address: underlyAssetAddr,
    abi: erc20Abi,
  } as const;
  const { data, isLoading, refetch, isRefetching } = useReadContracts({
    contracts: [
      {
        ...erc20Contract,
        functionName: 'symbol',
      },
      {
        ...erc20Contract,
        functionName: 'decimals',
      },
      {
        ...erc20Contract,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        ...erc20Contract,
        functionName: 'allowance',
        args: [address!, poolAddress],
      },
    ],
    query: {
      enabled: !!address,
    },
  });
  const [symbol, decimals, balanceOf, allowance] = data || [];
  const symbolResult = symbol?.result;
  const decimalsResult = decimals?.result ?? 6;
  const myAssetBalance = balanceOf?.result ?? 0n;
  const allowanceResult = allowance?.result ?? 0n;

  const { primaryText, isDisabled, errorText } = useMemo(() => {
    const ret = { primaryText: 'Invest', isDisabled: false, errorText: '' };

    const parsedAmount = parseUnits(amount, decimalsResult);
    if (!!balanceOf?.status && myAssetBalance < parsedAmount) {
      return {
        ...ret,
        isDisabled: true,
        errorText: 'Insufficient balance to invest.',
      };
    } else if (
      allowance?.status === 'success' &&
      allowanceResult < parsedAmount
    ) {
      return { ...ret, primaryText: 'Approve to Invest' };
    }

    return ret;
  }, [
    amount,
    decimalsResult,
    balanceOf?.status,
    myAssetBalance,
    allowance?.status,
    allowanceResult,
  ]);

  const formattedAssetBalance = formatUnits(
    BigInt(myAssetBalance || '0'),
    decimalsResult
  );
  const amountHasError = Number(amount) > Number(formattedAssetBalance);

  const onInvestSubmit = () => {
    if (!poolAddress || !underlyAssetAddr || !address || Number(amount) < 1)
      return;

    setOnSubmitting(true);
    setLoadingModal(true);
    setRequiredApprove(false);

    const parsedAmount = parseUnits(amount, decimalsResult);
    if (allowance?.status === 'success' && allowanceResult < parsedAmount) {
      setRequiredApprove(true);
      write({
        abi: erc20Abi,
        address: underlyAssetAddr,
        functionName: 'approve',
        args: [poolAddress, parsedAmount],
      });
    } else {
      write({
        abi: erc4626Abi,
        address: poolAddress,
        functionName: 'deposit',
        args: [parsedAmount, address],
      });
    }
  };

  const onTxModalClose = () => {
    refetch();
    setOnSubmitting(false);
    setLoadingModal(false);
    setRequiredApprove(false);

    if (!requiredApprove && isSuccess) {
      setAmount('');
      setShowInvestModal(false);
      onDrawerCloseHandler();
    }
  };

  return (
    <>
      <ActionItemButton
        primaryText='Invest'
        secondaryText='Make investments'
        errorText={errorText}
        startIcon={
          isLoading ? (
            <CircularProgress color='inherit' size={16} />
          ) : (
            <InvestIcon />
          )
        }
        disabled={isLoading || isDisabled}
        actionHandler={() => setShowInvestModal(true)}
      />

      {showInvestModal && (
        <FormMutationModal
          actionTitle={primaryText}
          onModalClose={onDrawerCloseHandler}
          onActionHandler={onInvestSubmit}
          actionBtnDisabled={
            (amountHasError && onSubmitting) || !amount || isRefetching
          }
        >
          <MutationForm
            secondaryAmountLabel='Balance'
            secondaryAmountValue={myAssetBalance}
            decimalsResult={decimalsResult}
            symbolResult={symbolResult}
            amountHasError={amountHasError}
            onSubmitting={onSubmitting}
            amount={amount}
            formattedAssetBalance={formattedAssetBalance}
            onInputChange={(e) => {
              setAmount(
                `${
                  parseInt(e.target.value) < 1
                    ? 1
                    : Number(e.target.value) > Number(formattedAssetBalance)
                    ? Number(formattedAssetBalance)
                    : Number(e.target.value)
                }`
              );
            }}
            onClickMaxButton={() => {
              setAmount(
                formatUnits(BigInt(myAssetBalance || '0'), decimalsResult)
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
              isSuccess
                ? `You have successfully ${
                    requiredApprove ? 'approved' : 'invested'
                  }`
                : ''
            }`,
            defaultText: `${`You are ${
              requiredApprove ? 'approving' : 'investing'
            }...`}`,
          }}
          closeTxConfirmation={onTxModalClose}
          modalClassName='min-w-[256px]'
        />
      )}
    </>
  );
};

export default InvestButton;
