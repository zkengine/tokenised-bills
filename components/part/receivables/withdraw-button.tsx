import { ReceivableAbi } from '@/abis/receivable';
import ActionItemButton from '@/components/common/action-item-button';
import { ClaimIcon } from '@/components/common/icons';
import AutocompleteInput from '@/components/part/shared/autocomplete-input';
import FormMutationModal from '@/components/part/shared/form-mutation-modal';
import PartTxProcessingModal from '@/components/part/shared/part-tx-processing-modal';
import useWriteContractWithReceipt from '@/hooks/use-write-contract-with-receipt';
import { NETWORK_CONFIG } from '@/lib/constants';
import { uaTokenInfoAtom } from '@/states';
import { MutationForm, Receivable } from '@/typings';
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  OutlinedInput,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { Hex, formatUnits, isAddress } from 'viem';
import { useChainId } from 'wagmi';

interface Props {
  receivable: Receivable | undefined;
  onDrawerCloseHandler: () => void;
}
const WithdrawButton = ({ receivable, onDrawerCloseHandler }: Props) => {
  const uaTokenInfo = useAtomValue(uaTokenInfoAtom);
  const formattedReceivableBalance = formatUnits(
    BigInt(receivable?.amount || '0'),
    uaTokenInfo.decimals
  );

  const [openLoadingModal, setLoadingModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [onSubmitting, setOnSubmitting] = useState(false);
  const [formData, setFormData] = useState<MutationForm>({
    recipient: '',
    amount: formattedReceivableBalance,
  });

  const chainId = useChainId();
  const networkContracts = useMemo(
    () => NETWORK_CONFIG[chainId].contracts,
    [chainId]
  );

  const recipientHasError = !isAddress(formData.recipient);

  const { write, txHash, isSuccess, failureReason, isError } =
    useWriteContractWithReceipt();

  const onWithdrawalSubmit = () => {
    if (!receivable || !receivable.id || recipientHasError) return;

    setOnSubmitting(true);
    setLoadingModal(true);

    write({
      abi: ReceivableAbi,
      address: networkContracts.receivableAddress,
      functionName: 'withdraw',
      args: [formData.recipient as Hex, BigInt(receivable.id)],
    });
  };

  const onTxModalClose = () => {
    setLoadingModal(false);
    setOnSubmitting(false);

    if (isSuccess) {
      setShowWithdrawalModal(false);
      setFormData({
        amount: formattedReceivableBalance,
        recipient: '',
      });
      onDrawerCloseHandler();
    }
  };

  return (
    <>
      <ActionItemButton
        primaryText='Withdraw'
        secondaryText={`Withdraw your funds`}
        errorText={undefined}
        startIcon={
          onSubmitting ? (
            <CircularProgress color='inherit' size={16} />
          ) : (
            <ClaimIcon />
          )
        }
        disabled={!receivable?.amount}
        actionHandler={() => setShowWithdrawalModal(true)}
      />

      {showWithdrawalModal && (
        <FormMutationModal
          actionTitle='withdraw'
          onModalClose={() => setShowWithdrawalModal(false)}
          onActionHandler={onWithdrawalSubmit}
          actionBtnDisabled={recipientHasError || onSubmitting}
        >
          <>
            <FormControl>
              <label htmlFor='recipient-input' className='text-base'>
                Recipient
              </label>
              <AutocompleteInput
                value={formData.recipient}
                hasError={recipientHasError && onSubmitting}
                inputChangeHandler={(val) =>
                  setFormData({
                    ...formData,
                    recipient: val,
                  })
                }
              />
              {recipientHasError && onSubmitting && (
                <FormHelperText className='mx-0! text-red-500'>
                  Invalid receipient address.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <div className='flex items-center justify-between'>
                <label htmlFor='amount-input' className='text-base'>
                  Amount
                </label>
              </div>

              <OutlinedInput
                id='amount-input'
                name='amount'
                value={formData.amount}
                inputProps={{ type: 'number' }}
                endAdornment={<span>{uaTokenInfo.symbol}</span>}
                readOnly
              />
            </FormControl>
          </>
        </FormMutationModal>
      )}

      {openLoadingModal && (
        <PartTxProcessingModal
          tx={{
            txHash: txHash,
            isError,
            isSuccess,
            failureReason: failureReason,
            successText: `${
              isSuccess ? `You have successfully withdrawn this receivable` : ''
            }`,
            defaultText: 'You are withdrawing...',
          }}
          onTxModalClose={onTxModalClose}
          invoiceNumber={receivable?.invoiceNumber}
        />
      )}
    </>
  );
};

export default WithdrawButton;
