export const ReceivableAbi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'fromTokenId_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value_',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'uint256',
        name: 'newTokenId',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId_',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
