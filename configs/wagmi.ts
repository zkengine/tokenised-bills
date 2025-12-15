import { loadBalance, rateLimit } from '@ponder/utils';
import { createConfig } from '@privy-io/wagmi';
import { mantleSepoliaTestnet } from 'viem/chains';
import { fallback, http, webSocket } from 'wagmi';

const transport = loadBalance([
  http(
    `https://mantle-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  ),
  webSocket('wss://mantle-sepolia.drpc.org'),
  rateLimit(http('https://mantle-sepolia.drpc.org'), {
    requestsPerSecond: 100,
  }),
  http('https://rpc.sepolia.mantle.xyz'),
  rateLimit(
    http(
      `https://rpc.ankr.com/mantle_sepolia/${process.env.NEXT_PUBLIC_ANKR_API_KEY}`
    ),
    { requestsPerSecond: 30 }
  ),
]);

export const wagmiConfig = createConfig({
  chains: [mantleSepoliaTestnet],
  transports: {
    [mantleSepoliaTestnet.id]: fallback([transport, http()]),
  },
});
