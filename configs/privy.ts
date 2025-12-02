import type { PrivyClientConfig } from '@privy-io/react-auth';
import { mantleSepoliaTestnet } from 'viem/chains';

export const privyConfig: PrivyClientConfig = {
  defaultChain: mantleSepoliaTestnet,
  supportedChains: [mantleSepoliaTestnet],
  loginMethods: ['google', 'wallet'],
  embeddedWallets: {
    showWalletUIs: true,
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
  appearance: {
    accentColor: '#6A6FF5',
    theme: '#FFFFFF',
    showWalletLoginFirst: false,
    walletChainType: 'ethereum-only',
    walletList: ['detected_ethereum_wallets', 'metamask', 'wallet_connect', 'okx_wallet'],
  },
};
