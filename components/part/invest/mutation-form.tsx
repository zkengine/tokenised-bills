import { formatCurrency } from '@/lib/utils';
import { FormControl, FormHelperText, OutlinedInput } from '@mui/material';
import { ChangeEvent, MouseEvent } from 'react';
import { formatUnits } from 'viem';
import MaxButton from '../shared/max-button';

interface Props {
  secondaryAmountLabel: string;
  secondaryAmountValue: bigint;
  decimalsResult: number;
  symbolResult: string | undefined;
  amountHasError: boolean;
  onSubmitting: boolean;
  amount: string;
  formattedAssetBalance: string;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClickMaxButton: (e?: MouseEvent<HTMLButtonElement>) => void;
}
const MutationForm = ({
  secondaryAmountLabel,
  secondaryAmountValue,
  decimalsResult,
  symbolResult,
  amountHasError,
  onSubmitting,
  amount,
  formattedAssetBalance,
  onInputChange,
  onClickMaxButton,
}: Props) => {
  return (
    <>
      <FormControl>
        <div className='flex items-center justify-between'>
          <label htmlFor='amount-input' className='text-base'>
            Amount
          </label>
          <div className='flex items-center gap-2 text-sm'>
            <span>
              {secondaryAmountLabel}:{' '}
              {formatCurrency(
                formatUnits(BigInt(secondaryAmountValue || '0'), decimalsResult)
              )}{' '}
              {symbolResult}
            </span>
          </div>
        </div>

        <OutlinedInput
          id='amount-input'
          name='amount'
          error={amountHasError && onSubmitting}
          value={amount}
          inputProps={{ type: 'number' }}
          onChange={onInputChange}
          placeholder={`Enter an amount between 1 and ${formattedAssetBalance}`}
          endAdornment={<MaxButton onClick={onClickMaxButton} />}
        />
        {amountHasError && onSubmitting && (
          <FormHelperText className='mx-0! text-red-500'>
            Invalid amount, please enter amount between 1 and{' '}
            {formattedAssetBalance}.
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};

export default MutationForm;
