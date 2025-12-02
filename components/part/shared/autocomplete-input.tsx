import { predefinedRecipientsAtom } from '@/states';
import { Autocomplete, TextField } from '@mui/material';
import { useAtomValue } from 'jotai';

interface Props {
  value: string;
  hasError: boolean | undefined;
  inputChangeHandler: (val: string) => void;
}
const AutocompleteInput = ({
  value,
  hasError = false,
  inputChangeHandler,
}: Props) => {
  const predefinedRecipients = useAtomValue(predefinedRecipientsAtom);

  return (
    <>
      <Autocomplete
        id='recipient-input'
        options={predefinedRecipients}
        getOptionLabel={(option) => option.title}
        inputValue={value}
        onChange={(_, newValue) => {
          inputChangeHandler(newValue?.address ?? '');
        }}
        onInputChange={(_, val, reason) => {
          if (reason !== 'reset') {
            inputChangeHandler(val ?? '');
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={hasError}
            placeholder='Please enther the recipient wallet address'
            sx={{ '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
            value={value}
          />
        )}
      />
    </>
  );
};

export default AutocompleteInput;
