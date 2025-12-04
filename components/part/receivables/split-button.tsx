import { ReceivableAbi } from '@/abis/receivable';
import ActionItemButton from '@/components/common/action-item-button';
import { TransferIcon } from '@/components/common/icons';
import AutocompleteInput from '@/components/part/shared/autocomplete-input';
import FormMutationModal from '@/components/part/shared/form-mutation-modal';
import MaxButton from '@/components/part/shared/max-button';
import PartTxProcessingModal from '@/components/part/shared/part-tx-processing-modal';
import useWriteContractWithReceipt from '@/hooks/use-write-contract-with-receipt';
import { NETWORK_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
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
import { Hex, formatUnits, isAddress, parseUnits } from 'viem';
import { useChainId } from 'wagmi';

interface Props {
  receivable: Receivable | undefined;
  onDrawerCloseHandler: () => void;
}
const SplitButton = ({ receivable, onDrawerCloseHandler }: Props) => {
  const [openLoadingModal, setLoadingModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [onSubmitting, setOnSubmitting] = useState(false);
  const [formData, setFormData] = useState<MutationForm>({
    recipient: '',
    amount: '',
  });
  const uaTokenInfo = useAtomValue(uaTokenInfoAtom);

  const chainId = useChainId();
  const networkContracts = useMemo(
    () => NETWORK_CONFIG[chainId].contracts,
    [chainId]
  );

  const formattedReceivableBalance = formatUnits(
    BigInt(receivable?.amount || '0'),
    uaTokenInfo.decimals
  );

  const amountHasError =
    Number(formData.amount) > Number(formattedReceivableBalance);
  const recipientHasError = !isAddress(formData.recipient);

  const { write, txHash, isSuccess, failureReason, isError } =
    useWriteContractWithReceipt();

  const onSplitSubmit = () => {
    if (!receivable || !receivable.id || amountHasError || recipientHasError)
      return;

    setOnSubmitting(true);
    setLoadingModal(true);

    write({
      abi: ReceivableAbi,
      address: networkContracts.receivableAddress,
      functionName: 'transferFrom',
      args: [
        BigInt(receivable.id),
        formData.recipient as Hex,
        BigInt(parseUnits(formData.amount, uaTokenInfo.decimals)),
      ],
    });
  };

  const onTxModalClose = () => {
    setLoadingModal(false);
    setOnSubmitting(false);

    if (isSuccess) {
      setFormData({
        amount: '',
        recipient: '',
      });
      setShowSplitModal(false);
      onDrawerCloseHandler();
    }
  };

  return (
    <>
      <ActionItemButton
        primaryText='Split'
        secondaryText={`Split this receivable #${receivable?.id}`}
        startIcon={
          onSubmitting ? (
            <CircularProgress color='inherit' size={16} />
          ) : (
            <TransferIcon />
          )
        }
        disabled={!receivable?.amount}
        actionHandler={() => setShowSplitModal(true)}
      />

      {showSplitModal && (
        <FormMutationModal
          actionTitle='split'
          onModalClose={() => setShowSplitModal(false)}
          onActionHandler={onSplitSubmit}
          actionBtnDisabled={
            ((amountHasError || recipientHasError) && onSubmitting) ||
            !formData.amount ||
            !formData.recipient
          }
        >
          <>
            <FormControl>
              <label
                htmlFor='recipient-input'
                className='text-base font-medium'
              >
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
                <label htmlFor='amount-input' className='text-base font-medium'>
                  Amount
                </label>
                <div className='flex items-center gap-2 text-sm'>
                  <span>
                    Amount remaining:{' '}
                    {formatCurrency(
                      formatUnits(
                        BigInt(receivable?.amount || '0'),
                        uaTokenInfo.decimals
                      )
                    )}{' '}
                    {uaTokenInfo.symbol}
                  </span>
                </div>
              </div>

              <OutlinedInput
                id='amount-input'
                name='amount'
                error={amountHasError && onSubmitting}
                value={formData.amount}
                // inputProps={{ type: 'number' }}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value)) || !e.target.value) return;

                  setFormData({
                    ...formData,
                    amount: `${
                      Number(e.target.value) >
                      Number(formattedReceivableBalance)
                        ? Number(formattedReceivableBalance)
                        : Number(e.target.value)
                    }`,
                  });
                }}
                placeholder={`Split amount`}
                endAdornment={
                  <MaxButton
                    onClick={() => {
                      setFormData({
                        ...formData,
                        amount: formatUnits(
                          BigInt(receivable?.amount || '0'),
                          uaTokenInfo.decimals
                        ),
                      });
                    }}
                  />
                }
              />
              {amountHasError && onSubmitting && (
                <FormHelperText className='mx-0! text-red-500'>
                  Invalid amount, please enter amount between 0 and{' '}
                  {formattedReceivableBalance}.
                </FormHelperText>
              )}
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
              isSuccess ? `You have successfully split this receivable` : ''
            }`,
            defaultText: 'You are splitting...',
          }}
          onTxModalClose={onTxModalClose}
          invoiceNumber={receivable?.invoiceNumber}
        />
      )}
    </>
  );
};

export default SplitButton;
