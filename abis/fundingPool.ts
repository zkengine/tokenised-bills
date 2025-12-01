export const fundingPoolAbi = [
  {
    type: 'function',
    name: 'assetMetadata',
    inputs: [],
    outputs: [
      { name: '', type: 'string', internalType: 'string' },
      { name: '', type: 'string', internalType: 'string' },
      { name: '', type: 'uint8', internalType: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'asset',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract ERC20' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'suppliedAssets',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalAssetsSupplied',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const;
