export const svgAbi = [
  {
    type: 'function',
    name: 'generateSVG',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [{ type: 'string' }],
  },
] as const;
