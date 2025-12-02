import { Button, ButtonProps } from '@mui/material';
import classNames from 'classnames';
import { FC, MouseEvent } from 'react';

interface Props extends ButtonProps {
  btnName: string;
  className?: string;
  onClick: (e?: MouseEvent<HTMLButtonElement>) => void;
}
const DefaultButton: FC<Props> = ({
  btnName,
  className,
  onClick,
  ...props
}) => {
  return (
    <Button
      size='small'
      variant='contained'
      {...props}
      className={classNames(
        'bg-primary hover:bg-primary/40 mx-6 h-8.5 w-full rounded-md py-2.5! text-sm font-semibold text-white uppercase! shadow-none hover:border-none hover:shadow-none',
        className
      )}
      onClick={onClick}
    >
      {btnName}
    </Button>
  );
};

export default DefaultButton;
