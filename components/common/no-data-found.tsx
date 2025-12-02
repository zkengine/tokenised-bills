import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

const NoDataFound = ({ title, children }: Props) => {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      {children}
      <div className='w-90 text-center text-sm leading-snug'>
        No {title} found. <br /> Check here for upcoming {title}.
      </div>
    </div>
  );
};

export default NoDataFound;
