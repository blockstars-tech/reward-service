import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EvmTransactionHandler } from '@lib/blockchain';

@Injectable()
export class NonceManager {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  /**
   * Gets the next available nonce for a wallet on a specific network.
   *
   * @param {string} walletAddress The address of the wallet.
   * @param {string} network The network name.
   * @param {EvmTransactionHandler} evmTxHandler The EVM transaction handler.
   *
   * @returns {Promise<number>} The next nonce for the wallet.
   */
  async getNextNonce(
    walletAddress: string,
    network: string,
    evmTxHandler: EvmTransactionHandler,
  ): Promise<number> {
    const key = `nonce:${network}:${walletAddress.toLowerCase()}`;
    const lockKey = `${key}:lock`;

    // Ensure only one process can update the nonce at a time
    const lock = await this.acquireLock(lockKey);
    try {
      const currentNonceStr = await this.redis.get(key);
      let nextNonce: number;

      if (currentNonceStr === null) {
        nextNonce = await evmTxHandler.getNextNonce();
      } else {
        nextNonce = parseInt(currentNonceStr, 10) + 1;
      }

      await this.redis.set(key, nextNonce.toString());
      return nextNonce;
    } finally {
      await this.releaseLock(lockKey, lock);
    }
  }

  /**
   * Resets the nonce for a wallet on a specific network.
   *
   * @param {string} walletAddress The address of the wallet.
   * @param {string} network The network name.
   *
   * @returns {Promise<void>}
   */
  async resetNonce(walletAddress: string, network: string): Promise<void> {
    const key = `nonce:${network}:${walletAddress.toLowerCase()}`;

    await this.redis.del(key);
  }

  /**
   * Acquires a lock for a given key
   *
   * @param {string} lockKey The key to acquire the lock for
   * @param {number} timeout The timeout for the lock in milliseconds
   *
   * @throws {Error} If the lock cannot be acquired
   *
   * @returns {Promise<string>} The value of the lock
   */
  private async acquireLock(lockKey: string, timeout = 2000): Promise<string> {
    const lockValue = Date.now().toString();
    const result = await this.redis.set(
      lockKey,
      lockValue,
      'PX',
      timeout,
      'NX',
    );

    if (result === 'OK') return lockValue;

    throw new Error('Failed to acquire nonce lock');
  }

  /**
   * Releases the lock for a given key
   *
   * @param {string} lockKey The key to release the lock for
   * @param {string} lockValue The value of the lock to be released
   *
   * @returns {Promise<void>}
   */
  private async releaseLock(lockKey: string, lockValue: string): Promise<void> {
    // checks if the current value stored at lockKey matches the provided lockValue
    // if they match, deletes the key returns the result of the delete operation
    // otherwise, it returns 0
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.redis.eval(script, 1, lockKey, lockValue);
  }
}
