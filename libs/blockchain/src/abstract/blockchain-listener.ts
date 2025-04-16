import { Injectable } from '@nestjs/common';
import { NetworkConfig } from '@lib/shared';

@Injectable()
export abstract class BlockchainListener {
  protected readonly network: NetworkConfig;

  constructor(network: NetworkConfig) {
    this.network = network;
  }

  /**
   * Retrieves the network configuration object.
   *
   * @returns {NetworkConfig} Network configuration
   */
  get networkConfig(): NetworkConfig {
    return this.network;
  }

  /**
   * Retrieves the current block number of the chain.
   *
   * @returns {number} Current block number
   */
  abstract getCurrentBlockNumber(): Promise<number>;

  /**
   * Retrieves event logs from the blockchain.
   *
   * @param {number} fromBlock The starting block number
   * @param {number} toBlock The ending block number
   *
   * @returns {Promise<any[]>} Array of events
   */
  abstract getEventLogs(fromBlock: number, toBlock: number): Promise<any[]>;
}
