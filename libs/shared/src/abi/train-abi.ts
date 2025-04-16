export const TrainAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AlreadyClaimed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ECDSAInvalidSignature',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'ECDSAInvalidSignatureLength',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'ECDSAInvalidSignatureS',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FundsNotSent',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HTLCAlreadyExists',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HTLCNotExists',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HashlockAlreadySet',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HashlockNotMatch',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvaliRewardTimelock',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidShortString',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSignature',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTimelock',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoAllowance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotPassedTimelock',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'str',
        type: 'string',
      },
    ],
    name: 'StringTooLong',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'EIP712DomainChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'hopChains',
        type: 'string[]',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'hopAssets',
        type: 'string[]',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'hopAddresses',
        type: 'string[]',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'dstChain',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'dstAddress',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'dstAsset',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'srcReceiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'srcAsset',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'timelock',
        type: 'uint48',
      },
    ],
    name: 'TokenCommitted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'hashlock',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'timelock',
        type: 'uint48',
      },
    ],
    name: 'TokenLockAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'hashlock',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'dstChain',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'dstAddress',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'dstAsset',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'srcReceiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'srcAsset',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'rewardTimelock',
        type: 'uint48',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'timelock',
        type: 'uint48',
      },
    ],
    name: 'TokenLocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'redeemAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'secret',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'hashlock',
        type: 'bytes32',
      },
    ],
    name: 'TokenRedeemed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
    ],
    name: 'TokenRefunded',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'hashlock',
        type: 'bytes32',
      },
      {
        internalType: 'uint48',
        name: 'timelock',
        type: 'uint48',
      },
    ],
    name: 'addLock',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'Id',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'hashlock',
            type: 'bytes32',
          },
          {
            internalType: 'uint48',
            name: 'timelock',
            type: 'uint48',
          },
        ],
        internalType: 'struct Train.addLockMsg',
        name: 'message',
        type: 'tuple',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
    ],
    name: 'addLockSig',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'hopChains',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'hopAssets',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'hopAddresses',
        type: 'string[]',
      },
      {
        internalType: 'string',
        name: 'dstChain',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'dstAsset',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'dstAddress',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'srcAsset',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'srcReceiver',
        type: 'address',
      },
      {
        internalType: 'uint48',
        name: 'timelock',
        type: 'uint48',
      },
    ],
    name: 'commit',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      {
        internalType: 'bytes1',
        name: 'fields',
        type: 'bytes1',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'version',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'verifyingContract',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'salt',
        type: 'bytes32',
      },
      {
        internalType: 'uint256[]',
        name: 'extensions',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
    ],
    name: 'getHTLCDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'hashlock',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'secret',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'srcReceiver',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'timelock',
            type: 'uint48',
          },
          {
            internalType: 'uint8',
            name: 'claimed',
            type: 'uint8',
          },
        ],
        internalType: 'struct Train.HTLC',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
    ],
    name: 'getRewardDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint48',
            name: 'timelock',
            type: 'uint48',
          },
        ],
        internalType: 'struct Train.Reward',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'hashlock',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        internalType: 'uint48',
        name: 'rewardTimelock',
        type: 'uint48',
      },
      {
        internalType: 'uint48',
        name: 'timelock',
        type: 'uint48',
      },
      {
        internalType: 'address payable',
        name: 'srcReceiver',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'srcAsset',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'dstChain',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'dstAddress',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'dstAsset',
        type: 'string',
      },
    ],
    name: 'lock',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'secret',
        type: 'uint256',
      },
    ],
    name: 'redeem',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'Id',
        type: 'bytes32',
      },
    ],
    name: 'refund',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
