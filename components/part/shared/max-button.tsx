import DefaultButton from '@/components/common/default-button';
import { MouseEvent } from 'react';

interface Props {
  onClick: (e?: MouseEvent<HTMLButtonElement>) => void;
}
const MaxButton = ({ onClick }: Props) => {
  return (
    <DefaultButton
      className='mx-0! w-fit! bg-transparent hover:bg-transparent'
      btnName='Max'
      onClick={onClick}
    />
  );
};

export default MaxButton;
