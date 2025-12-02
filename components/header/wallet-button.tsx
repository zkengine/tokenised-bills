'use client';

import { shortenAddress } from '@/lib/helper';
import { Button } from '@mui/material';
import {
  useLogin,
  useLogout,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';
import { useSetActiveWallet } from '@privy-io/wagmi';
import React from 'react';
import { mantleSepoliaTestnet } from 'viem/chains';
import { useSwitchChain } from 'wagmi';

const WalletButton: React.FC = () => {
  const { ready, authenticated, user } = usePrivy();
  const { logout } = useLogout();
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const { switchChain } = useSwitchChain();

  const { login } = useLogin({
    onComplete: async ({ wasAlreadyAuthenticated }) => {
      if (!wasAlreadyAuthenticated) {
        const newActiveWallet = wallets.find(
          (wallet) => wallet.chainId === 'eip155:5003'
        );
        if (newActiveWallet) {
          await setActiveWallet(newActiveWallet);
          switchChain({ chainId: mantleSepoliaTestnet.id });
        }
      }
    },
  });

  if (ready && authenticated) {
    return (
      <Button
        variant='outlined'
        className='border-primary! text-primary! hover:border-primary! max-w-44 min-w-28 gap-2 rounded-[5px] border text-xs'
        onClick={() => {
          logout();
        }}
      >
        {shortenAddress(user?.wallet?.address)}
      </Button>
    );
  }

  return (
    <Button
      variant='outlined'
      className='border-primary! text-primary! hover:border-primary! max-w-44 min-w-28 gap-2 rounded-[5px] border text-xs normal-case! dark:bg-neutral-500'
      onClick={() => {
        login();
      }}
      disabled={authenticated}
    >
      Log in
    </Button>
  );
};

export default WalletButton;
