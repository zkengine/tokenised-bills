import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Hex } from 'viem';

export const predefinedRecipientsAtom = atom<
  { title: string; address: string }[]
>([]);

export const uaTokenInfoAtom = atomWithStorage('art-ua', {
  name: 'USDC',
  symbol: 'USDC',
  decimals: 6,
});

type InvestmentRecord = {
  poolAddress: Hex | undefined;
  address: Hex | undefined;
  investedAmount: bigint;
};
export const investmentRecordAtom = atom<InvestmentRecord>({
  poolAddress: undefined,
  address: undefined,
  investedAmount: 0n,
});

type PoolInfo = {
  poolAddress: Hex | undefined;
  totalSupply: bigint;
  availableAssets: bigint;
  totalInvested: bigint;
  totalValueOfReceivables: bigint;
  name: string;
  symbol: string;
  decimals: number;
};
export const poolInfoAtom = atom<PoolInfo>({
  poolAddress: undefined,
  totalSupply: 0n,
  availableAssets: 0n,
  totalInvested: 0n,
  totalValueOfReceivables: 0n,
  name: '',
  symbol: '',
  decimals: 6,
});

export const pageSizeAtom = atomWithStorage('art-ps', 6);

export const darkModeAtom = atomWithStorage('art-darkMode', false);
