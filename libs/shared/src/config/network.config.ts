import { InterfaceAbi } from 'ethers';
import { TrainAbi } from '../abi/train-abi';

/**
 * Enum representing supported blockchain networks
 */
export enum NetworkName {
  ETHEREUM = 'ETHEREUM',
  OPTIMISM = 'OPTIMISM',

  ETHEREUM_SEPIOLA = 'ETHEREUM_SEPIOLA',
  OPTIMISM_SEPOLIA = 'OPTIMISM_SEPOLIA',
  ARBITRUM_SEPOLIA = 'ARBITRUM_SEPOLIA',
}

/**
 * Interface for individual contract configuration
 */
export interface ContractConfig {
  address: string;
  abi: InterfaceAbi;
}

/**
 * Interface for blockchain network configuration
 */
export interface NetworkConfig {
  name: NetworkName;
  type: string;
  chainId: number;
  rpcUrl: string;
  contracts: {
    native: ContractConfig;
  };
  pollingIntervalMin: number;
  blockRange: number;
  testnet: boolean;
  claimBufferInSec?: number;
}

/**
 * Configuration object for all supported networks
 */
export const networks: Record<NetworkName, NetworkConfig> = {
  [NetworkName.ETHEREUM]: {
    name: NetworkName.ETHEREUM,
    type: 'evm',
    chainId: 1,
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    contracts: {
      native: {
        address: '0xDfa528f4228e2790d0CBbc0e060A54F384297470',
        abi: TrainAbi,
      },
    },
    pollingIntervalMin: 2,
    blockRange: 100,
    testnet: false,
  },
  [NetworkName.OPTIMISM]: {
    name: NetworkName.OPTIMISM,
    type: 'evm',
    chainId: 10,
    rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    contracts: {
      native: {
        address: '0x4c4958871eec620be6d26c30af6ccef5e6440480',
        abi: TrainAbi,
      },
    },
    pollingIntervalMin: 2,
    blockRange: 100,
    testnet: false,
    claimBufferInSec: 7,
  },
  [NetworkName.ETHEREUM_SEPIOLA]: {
    name: NetworkName.ETHEREUM_SEPIOLA,
    type: 'evm',
    chainId: 11155111,
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    contracts: {
      native: {
        address: '0xdfa528f4228e2790d0cbbc0e060a54f384297470',
        abi: TrainAbi,
      },
    },
    pollingIntervalMin: 2,
    blockRange: 100,
    testnet: true,
  },
  [NetworkName.OPTIMISM_SEPOLIA]: {
    name: NetworkName.OPTIMISM_SEPOLIA,
    type: 'evm',
    chainId: 11155420,
    rpcUrl: `https://opt-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    contracts: {
      native: {
        address: '0x4c4958871eec620be6d26c30af6ccef5e6440480',
        abi: TrainAbi,
      },
    },
    pollingIntervalMin: 2,
    blockRange: 300,
    testnet: true,
  },
  [NetworkName.ARBITRUM_SEPOLIA]: {
    name: NetworkName.ARBITRUM_SEPOLIA,
    type: 'evm',
    chainId: 421614,
    rpcUrl: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    contracts: {
      native: {
        address: '0x323C05bc83C549e2E3DEbA1BB6800a63e7220f24',
        abi: TrainAbi,
      },
    },
    pollingIntervalMin: 2,
    blockRange: 300,
    testnet: true,
  },
};

export const walletPrivateKey = process.env.WALLET_PRIVATE_KEY || '';
