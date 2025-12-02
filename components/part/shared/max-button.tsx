import DefaultButton from '@/components/common/default-button';
import { MouseEvent } from 'react';

interface Props {
  onClick: (e?: MouseEvent<HTMLButtonElement>) => void;
}
const MaxButton = ({ onClick }: Props) => {
  return (
    <DefaultButton
      className='text-primary! mx-0! w-fit! bg-transparent hover:bg-transparent'
      btnName='MAX'
      onClick={onClick}
    />
  );
};

export default MaxButton;
