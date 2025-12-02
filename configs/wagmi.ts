import { createConfig } from '@privy-io/wagmi';
import { mantleSepoliaTestnet } from 'viem/chains';
import { fallback, http } from 'wagmi';

export const wagmiConfig = createConfig({
  chains: [mantleSepoliaTestnet],
  transports: {
    [mantleSepoliaTestnet.id]: fallback([http(process.env.NEXT_PUBLIC_MANTLE_TESTNET_RPC_URL!), http()]),
  },
});
