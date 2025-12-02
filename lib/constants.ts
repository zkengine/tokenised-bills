import { IMenuItem, NetworkConfig } from '@/typings';
import { mantleSepoliaTestnet } from 'viem/chains';

export const dueInItems: IMenuItem[] = [
  { value: '', label: 'Due in...' },
  { value: '5', label: 'Due in 5 days' },
  { value: '10', label: 'Due in 10 days' },
  { value: '15', label: 'Due in 15 days' },
  { value: '30', label: 'Due in 30 days' },
];

export const stateItems: IMenuItem[] = [
  { value: '', label: 'All' },
  { value: '0', label: 'TBC' },
  { value: '1', label: 'Unpaid' },
  { value: '2', label: 'Finalised' },
];

export const recvStateItems: IMenuItem[] = [
  { value: '', label: 'All' },
  { value: '0', label: 'Unpaid' },
  { value: '1', label: 'Paid' },
  { value: '2', label: 'Finalised' },
];

export const QUERY_GC_TIME = 20 * 1000; // 20 seconds
export const QUERY_REFETCH_INTERVAL = 5000; // 5 seconds

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NETWORK_CONFIG: { [key: number]: NetworkConfig } = {
  [mantleSepoliaTestnet.id]: {
    blockExplorer: {
      tx: 'https://sepolia.mantlescan.xyz/tx',
      address: 'https://sepolia.mantlescan.xyz/address',
      block: 'https://sepolia.mantlescan.xyz/block',
      token: 'https://sepolia.mantlescan.xyz/token',
      nft: 'https://sepolia.mantlescan.xyz/nft',
    },
    contracts: {
      invoiceAddress: '0xd27E904A3B44251255437DBA5Be18b4179B96f57',
      invoiceSvgAddress: '0xd10a2C1F7BA18CadBd1b31CB525F0998dA5b2dEE',
      receivableAddress: '0xB2A39E27783B4D7A84EBB0D549199F4D41D77cdF',
      receivableSvgAddress: '0x486477a1c32CDFc60431B27A3EA19c7b9cAe8b0f',
      uaContract: {
        address: '0xe618176813A7328CF2015730bd83e2AE2Db48878',
      },
      diamondAddress: '0x6b062b0D712A82201CE27dAe138d87199Ff497c5',
      fpAddresses: ['0x93D78c0B7745974a58057555ebADf91ca9f67800'],
    },
    graphUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL_MANTLE_TESTNET!,
  },
};

export const getNetworkInfo = (chainId?: number) => {
  if (!chainId) return NETWORK_CONFIG[mantleSepoliaTestnet.id];

  const hasConfig = Object.keys(NETWORK_CONFIG).some(
    (k) => Number(k) === chainId
  );

  return NETWORK_CONFIG[hasConfig ? chainId : mantleSepoliaTestnet.id];
};
