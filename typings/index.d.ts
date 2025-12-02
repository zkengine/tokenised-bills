import { Hash, Hex } from 'viem';

export interface Payable {
  id?: string;
  sellerName: string;
  sellerAbn: string;
  sellerAddr?: string;
  buyerName: string;
  buyerAbn: string;
  buyerAddr: string;
  items: Item[];
  invoiceLink: string;
  subtotal?: string;
  totalGst?: string;
  totalValue?: string;
  invoiceDate: string;
  dueDate: string;
  confirmDate?: string;
  isValid?: boolean;
  state?: string;
  itemsDesc?: string;
  txHash?: string;
  paidAt?: string;
  receivables?: Receivable[];
}

export interface Item {
  id?: string;
  description: string;
  quantity: string;
  unitPrice: string;
  gst: string;
  totalPrice: string;
}

export interface Receivable {
  id?: string;
  owner: string;
  amount: string;
  invoiceNumber: string;
  sellerName: string;
  sellerAbn: string;
  buyerName: string;
  buyerAbn: string;
  invoice: Payable;
  invoiceDueDate: string;
  state?: string;
  itemsDesc?: string;
  txHash?: string;
  status?: number;
  createdAt?: string;
  claimedAt?: string;
}

export interface IMenuItem {
  value: string;
  label: string;
}

export interface NetworkConfig {
  blockExplorer: {
    tx: string;
    address: string;
    block: string;
    token: string;
    nft: string;
  };
  contracts: {
    multicall3?: Hex;
    invoiceAddress: Hex;
    invoiceSvgAddress: Hex;
    receivableAddress: Hex;
    receivableSvgAddress: Hex;
    uaContract: {
      // underlying asset contract
      address: Hex;
    };
    diamondAddress: Hex | undefined;
    /** Funding pool contract address */
    fpAddresses: Hex[] | undefined;
  };
  graphUrl: string;
}

export type MutationForm = {
  recipient: string;
  amount: string;
};

export type MediaQuery = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;

export interface Transaction {
  txHash: Hash | undefined;
  isError: boolean;
  isSuccess: boolean;
  failureReason: string | undefined;
  successText?: string;
  defaultText?: string;
}

export type WriteParams = {
  abi: Abi;
  address: Hex;
  functionName: string;
  args: ContractFunctionArgs;
};

export interface Pooling {
  operator: Hex;
  bundledAsset: Hex;
  packageTokenId: bigint;
  packageName: string;
  sbaOfPackage: Hex;
  slot: bigint;
  soldAmount: bigint;
  blockTimestamp: bigint;
  receivables: PackagedReceivable[];
}
interface PackagedReceivable {
  tokenId: bigint;
  amount: bigint;
  dueDate: bigint;
}

interface Params {
  invoiceAddress: Hex;
  tokenId: bigint;
  valueDecimals: number;
  slotInfo: {
    seller: {
      name: string;
      abn: string;
      addr: Hex;
    };
    buyer: {
      name: string;
      abn: string;
      addr: Hex;
    };
    items: Item[];
    invoiceLink: string;
    subtotal: string;
    totalGst: string;
    totalValue: bigint;
    invoiceDate: bigint;
    confirmDate: bigint;
    dueDate: bigint;
    state: number;
    isValid: boolean;
  };
}
