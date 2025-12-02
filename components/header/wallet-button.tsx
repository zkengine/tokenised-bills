'use client';

import {
  CheckIcon,
  CopyIcon,
  DropDownIcon,
  WalletIcon,
} from '@/components/common/icons';
import useCopyClipboard from '@/hooks/use-copy-clipboard';
import { shortenAddress } from '@/lib/helper';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material';
import {
  useLogin,
  useLogout,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';
import { useSetActiveWallet } from '@privy-io/wagmi';
import React, { useState } from 'react';
import { mantleSepoliaTestnet } from 'viem/chains';
import { useSwitchChain } from 'wagmi';

const WalletButton: React.FC = () => {
  const { ready, authenticated, user } = usePrivy();
  const { logout } = useLogout();
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const { switchChain } = useSwitchChain();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCopied, onCopy] = useCopyClipboard();

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.wallet?.address) {
      onCopy(user.wallet.address);
      setTimeout(() => {
        handleClose();
      }, 500);
    }
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  if (ready && authenticated) {
    return (
      <>
        <Button
          variant='outlined'
          className='border-primary! text-primary! hover:border-primary! max-w-44 min-w-28 gap-2 rounded-[5px] border text-xs'
          onClick={handleClick}
          endIcon={
            <DropDownIcon
              style={{ fontSize: '0.75rem', marginLeft: '-0.25rem' }}
            />
          }
        >
          {shortenAddress(user?.wallet?.address)}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '0.375rem',
              border: '1px solid #e0e0e0',
              zIndex: 10,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              marginTop: '0.5rem',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disableRipple sx={{ cursor: 'default' }}>
            <ListItemIcon>
              <WalletIcon sx={{ width: 20, height: 20 }} />
            </ListItemIcon>
            <span className='mr-2 text-sm'>
              {shortenAddress(user?.wallet?.address)}
            </span>
            {isCopied ? (
              <CheckIcon sx={{ width: 16, height: 16 }} />
            ) : (
              <CopyIcon
                sx={{ width: 16, height: 16, cursor: 'pointer' }}
                onClick={handleCopy}
              />
            )}
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ width: 20, height: 20 }} />
            </ListItemIcon>
            <span className='text-sm'>Log out</span>
          </MenuItem>
        </Menu>
      </>
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
