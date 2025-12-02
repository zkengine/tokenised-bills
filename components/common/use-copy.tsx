import { CheckIcon, CopyIcon } from '@/components/common/icons';
import useCopyClipboard from '@/hooks/use-copy-clipboard';

const UseCopy = ({ copyText }: { copyText: string }) => {
  const [isCopied, onCopy] = useCopyClipboard();

  return (
    <>
      {isCopied ? (
        <CheckIcon className='w-fit' sx={{ height: '1rem' }} />
      ) : (
        <CopyIcon
          className='w-fit pl-1'
          sx={{ height: '1rem', cursor: 'pointer' }}
          onClick={() => onCopy(copyText)}
        />
      )}
    </>
  );
};

export default UseCopy;
