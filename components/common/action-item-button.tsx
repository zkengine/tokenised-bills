import { ArrowForwardIcon } from '@/components/common/icons';
import {
  Box,
  FormHelperText,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import classNames from 'classnames';
import { JSX } from 'react';

interface Props {
  startIcon?: JSX.Element;
  primaryText: string;
  secondaryText: string;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  endIcon?: JSX.Element;
  actionHandler: () => void;
}

const ActionItemButton = ({
  startIcon,
  primaryText,
  secondaryText,
  helperText,
  errorText,
  disabled,
  endIcon = <ArrowForwardIcon sx={{ height: '1rem' }} />,
  actionHandler,
  ...props
}: Props) => {
  return (
    <Box>
      <ListItem
        disablePadding
        className={classNames(
          'rounded-xl bg-white',
          disabled && 'cursor-not-allowed!'
        )}
        {...props}
      >
        <ListItemButton
          className='hover:rounded-xl hover:bg-white'
          disabled={disabled}
          onClick={actionHandler}
        >
          {startIcon && <ListItemIcon>{startIcon}</ListItemIcon>}
          <ListItemText
            primary={primaryText}
            secondary={secondaryText}
            className='-ml-3.75'
          />
          {endIcon}
        </ListItemButton>
      </ListItem>
      {(!!helperText || !!errorText) && (
        <Typography className='mt-1 flex flex-col pl-1'>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
          {errorText && (
            <FormHelperText className='text-sm text-red-500'>
              {errorText}
            </FormHelperText>
          )}
        </Typography>
      )}
    </Box>
  );
};

export default ActionItemButton;
