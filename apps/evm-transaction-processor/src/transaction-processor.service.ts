import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TransactionRequest } from 'ethers';
import { TransactionEntity, TransactionService } from '@lib/database';
import { EvmTransactionHandler } from '@lib/blockchain';
import { SwapDto, networks, QueueNames, walletPrivateKey } from '@lib/shared';
import {
  AlreadyClaimedException,
  InsufficientBalanceException,
} from '@lib/shared/exceptions';
import { NonceManager } from './nonce-manager';

@Processor(QueueNames.ELIGIBLE_REWARDS, { concurrency: 5 })
export class EvmTransactionService extends WorkerHost {
  private readonly logger = new Logger(EvmTransactionService.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly nonceManager: NonceManager,
  ) {
    super();
  }

  async process(job: Job<SwapDto, any, any>): Promise<any> {
    this.logger.debug(
      `Processing job: ${job.id} on queue: ${job.queueName}, job name: ${job.name}`,
    );
    const { id, secret, network } = job.data;
    let txRecord: TransactionEntity | undefined;
    let walletAddress: string = '';

    try {
      const evmTxHandler = new EvmTransactionHandler(
        networks[network],
        walletPrivateKey,
      );
      walletAddress = evmTxHandler.getWalletAddress();

      if (!(await evmTxHandler.isRewardClaimable(id))) {
        throw new AlreadyClaimedException(
          `Swap ${id} is already redeemed or refunded on network ${network}.`,
        );
      }

      // Estimate gas limit
      const gasLimit = await evmTxHandler.estimateRedeemGas({ id, secret });

      // Get fee data with estimated fee
      const feeData = await evmTxHandler.estimateRedeemTxFee(gasLimit);

      // Check if the wallet has enough balance to cover the estimated fee
      const walletBalance = await evmTxHandler.getWalletBalance();

      if (walletBalance < feeData.estimatedFee) {
        throw new InsufficientBalanceException(
          `Not enough balance to cover the estimated fee: ${feeData.estimatedFee.toString()} wei` +
            ` for wallet ${walletAddress} on network ${network}`,
        );
      }

      // Prepare transaction options
      const nonce = await this.nonceManager.getNextNonce(
        walletAddress,
        network,
        evmTxHandler,
      );
      const transactionOptions: TransactionRequest = {
        nonce,
        gasLimit,
        ...(feeData.isLegacy
          ? { gasPrice: feeData.gasPrice }
          : {
              maxFeePerGas: feeData.maxFeePerGas,
              maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
            }),
      };

      this.logger.debug(
        transactionOptions,
        `Transaction options for swap:${id}`,
      );

      // Create pending transaction record
      txRecord = await this.transactionService.create({
        swapId: id,
        network: networks[network].name,
        address: walletAddress.toLowerCase(),
        fee: feeData.estimatedFee.toString(),
      });

      // Send redeem transaction
      const txResponse = await evmTxHandler.sendRedeemTransaction(
        {
          id,
          secret,
        },
        transactionOptions,
      );

      this.logger.debug(
        `Transaction sent for swap ${id}: hash: ${txResponse.hash}`,
      );

      // Update transaction record with hash
      await this.transactionService.update(txRecord.id, {
        hash: txResponse.hash,
      });

      // Wait for transaction to be mined (default confirmations = 1)
      const txReceipt = await txResponse.wait();
      this.logger.log(
        `Transaction mined for swap ${id}: hash: ${txResponse.hash}, status: ${txReceipt?.status}`,
      );

      // Calculate actual fee
      const actualFee = txReceipt
        ? txReceipt?.gasUsed * txReceipt?.gasPrice
        : feeData.estimatedFee;

      await this.transactionService.update(txRecord.id, {
        hash: txResponse.hash,
        status: txReceipt?.status ?? 0,
        fee: actualFee.toString(),
      });

      return true;
    } catch (error) {
      this.logger.error(
        error,
        `Attempt ${job.attemptsMade} failed for ${job.id}`,
      );

      if (txRecord) {
        // Update transaction record with error details
        await this.transactionService.update(txRecord.id, {
          error:
            error instanceof Error
              ? error.message
              : `unknown error: ${String(error)}`,
        });
      }

      // Release the job if the swap is already refunded or redeemed
      if (error instanceof AlreadyClaimedException) {
        await job.remove();

        return false;
      }

      if (error instanceof InsufficientBalanceException) {
        // Move the job to delayed state for 2 minute
        // This will allow the job to be retried later if the balance tops up
        // Will be removed if swap is redeemed by others
        await job.moveToDelayed(Date.now() + 60 * 2 * 1000);

        return false;
      }

      if (
        error instanceof Error &&
        (error.message.includes('nonce too low') ||
          error.message.includes('nonce too high'))
      ) {
        this.logger.warn(
          `Nonce issue detected for swap ${id}. Resetting nonce for wallet.`,
        );
        await this.nonceManager.resetNonce(walletAddress, network);
      }

      throw error;
    }
  }
}
