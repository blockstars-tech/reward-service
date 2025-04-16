import { Injectable } from '@nestjs/common';
import { NetworkConfig } from '@lib/shared/config';

@Injectable()
export abstract class TransactionHandler {
  protected readonly network: NetworkConfig;

  constructor(network: NetworkConfig) {
    this.network = network;
  }

  /**
   * Get the address of the configured wallet.
   *
   * @returns {string} The address of the wallet
   */
  abstract getWalletAddress(): string;

  /**
   * Get the balance of the configured wallet.
   *
   * @returns {Promise<bigint>} The balance of the wallet
   */
  abstract getWalletBalance(): Promise<bigint>;

  /**
   * Indicates on-chain whether a reward is claimable.
   *
   * @param {string} id The identifier of the htlc swap
   *
   * @returns {Promise<boolean>} Whether the htlc swap is claimable
   */
  abstract isRewardClaimable(id: string): Promise<boolean>;

  /**
   * Estimates the redeem transaction fee.
   *
   * @param {any} args The arguments for the redeem transaction
   *
   * @returns {Promise<any>} The estimated transaction fee data
   */
  abstract estimateRedeemTxFee(...args: any): Promise<any>;
}
