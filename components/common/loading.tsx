import { ScaleLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className='flex h-full items-center justify-center'>
      <ScaleLoader color='#FF5C00' />
    </div>
  );
};

export default Loading;
