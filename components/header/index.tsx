import PaymentLogo from '@/assets/images/logo.svg';
import { darkModeAtom } from '@/states';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import WalletButton from './wallet-button';

const Header = () => {
  const [darkMode] = useAtom(darkModeAtom);

  return (
    <header className='z-10 my-3 flex justify-center'>
      <div className='flex h-5.75 w-full items-center justify-between rounded-[10px]'>
        <Box className='flex items-center gap-2'>
          <Image
            src={PaymentLogo.src}
            alt='Tokenised Invoices'
            width={100}
            height={100}
            className='h-8 w-8'
          />{' '}
          <span className='text-2xl font-bold'>Tokenised Invoices</span>
        </Box>
        <div className='flex items-center gap-2'>
          <div className='hidden cursor-pointer' onClick={() => {}}>
            {darkMode ? (
              <DarkModeIcon className='text-white' />
            ) : (
              <LightModeIcon />
            )}
          </div>

          <WalletButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
