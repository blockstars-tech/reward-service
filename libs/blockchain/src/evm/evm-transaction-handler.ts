import {
  AddressLike,
  Contract,
  ContractTransactionResponse,
  JsonRpcProvider,
  TransactionRequest,
  Wallet,
} from 'ethers';
import { HexString } from 'ethers/lib.commonjs/utils/data';
import { Injectable, Logger } from '@nestjs/common';
import { NetworkConfig } from '@lib/shared/config';
import { HtlcStatus, HtlcDetails } from '@lib/shared/types';
import { TransactionHandler } from '../abstract/transaction-handler';
import { RedeemTransactionParams, FeeData } from './types';
import { DefaultRedeemGas, MinPriorityFee } from './const';

@Injectable()
export class EvmTransactionHandler extends TransactionHandler {
  private readonly logger = new Logger(EvmTransactionHandler.name);
  private readonly provider: JsonRpcProvider;
  private readonly contract: Contract;
  private readonly signer: Wallet;

  constructor(network: NetworkConfig, privateKey: string) {
    super(network);

    this.provider = new JsonRpcProvider(network.rpcUrl);
    this.signer = new Wallet(privateKey, this.provider);
    this.contract = new Contract(
      network.contracts.native.address,
      network.contracts.native.abi,
      this.signer,
    );
  }

  /**
   * Get the wallet address
   *
   * @returns {string} The wallet address
   */
  getWalletAddress(): string {
    return this.signer.address;
  }

  /**
   * Get the wallet balance.
   *
   * @returns {Promise<bigint>} The wallet balance
   */
  async getWalletBalance(): Promise<bigint> {
    return this.provider.getBalance(this.signer.address);
  }

  /**
   * Get the current nonce for the wallet address - block tag 'pending'.
   *
   * @param {AddressLike} address The wallet address
   *
   * @returns {Promise<number>} The current nonce
   */
  async getNextNonce(address?: AddressLike): Promise<number> {
    return this.provider.getTransactionCount(
      address ?? this.signer.address,
      'pending',
    );
  }

  /**
   * Checks if a swap is claimable on chain
   *
   * @param {HexString} id The htlc swap ID
   *
   * @returns {Promise<boolean>} True if the htlc swap is claimable, false otherwise
   */
  async isRewardClaimable(id: HexString): Promise<boolean> {
    const { claimed } = await this.getHtlcDetails(id);

    return claimed != HtlcStatus.REFUNDED && claimed != HtlcStatus.REDEEMED;
  }

  /**
   * Retrieves the details of an HTLC swap
   *
   * @param {HexString} id The htlc swap ID
   *
   * @returns {Promise<HtlcDetails>} The htlc swap details
   */
  async getHtlcDetails(id: HexString): Promise<HtlcDetails> {
    return this.contract.getHTLCDetails(id) as Promise<HtlcDetails>;
  }

  /**
   * Estimates the gas limit for the redeem transaction
   *
   * @param {RedeemTransactionParams} params The parameters for the redeem transaction
   *
   * @returns {Promise<bigint>} The estimated gas limit
   */
  async estimateRedeemGas({
    id,
    secret,
  }: RedeemTransactionParams): Promise<bigint> {
    try {
      return await this.contract.redeem.estimateGas(id, secret);
    } catch (error) {
      this.logger.error(error, 'Error estimating gas for redeem');

      // fallback to default gas limit
      return DefaultRedeemGas;
    }
  }

  /**
   * Get fee data and estimate the transaction fee
   *
   * @param {bigint} gasLimit The gas limit for the transaction
   *
   * @returns {Promise<FeeData>} The fee data
   */
  async estimateRedeemTxFee(gasLimit: bigint): Promise<FeeData> {
    const feeData = await this.provider.getFeeData();
    const isLegacy = !feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas;

    if (isLegacy) {
      // 20% buffer for gas price
      const gasPrice = feeData.gasPrice ? (feeData.gasPrice * 120n) / 100n : 0n;
      const estimatedFee = gasLimit * gasPrice;

      return {
        estimatedFee,
        gasPrice,
        isLegacy,
      };
    }

    let maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    // use fetched priority fee if available and higher than min priority fee (2 gwei)
    // otherwise use min priority fee
    maxPriorityFeePerGas =
      feeData.maxPriorityFeePerGas > MinPriorityFee
        ? maxPriorityFeePerGas
        : MinPriorityFee;

    const baseFeePerGas = await this.getCurrentBaseFee();
    const maxFeePerGas = baseFeePerGas * 2n + maxPriorityFeePerGas;
    const estimatedFee = gasLimit * maxFeePerGas;

    return { estimatedFee, isLegacy, maxFeePerGas, maxPriorityFeePerGas };
  }

  /**
   * Sends the redeem transaction
   *
   * @param {RedeemTransactionParams} params The parameters for the redeem transaction
   * @param {TransactionRequest} transactionOptions The transaction options
   *
   * @returns {Promise<ContractTransactionResponse>} The transaction response
   */
  async sendRedeemTransaction(
    params: RedeemTransactionParams,
    transactionOptions?: TransactionRequest,
  ): Promise<ContractTransactionResponse> {
    const { id, secret } = params;

    return this.contract.redeem(
      id,
      secret,
      transactionOptions,
    ) as Promise<ContractTransactionResponse>;
  }

  /**
   * Fetches the current base fee from the latest block.
   *
   * @returns The base fee per gas
   */
  private async getCurrentBaseFee(): Promise<bigint> {
    const latestBlock = await this.provider.getBlock('latest');

    return latestBlock?.baseFeePerGas ?? 0n;
  }
}
