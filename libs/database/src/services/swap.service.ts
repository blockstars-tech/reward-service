import { Injectable } from '@nestjs/common';
import { HtlcStatus } from '@lib/shared/types';
import { SwapEntity } from '../entities/swap.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SwapService {
  constructor(
    @InjectRepository(SwapEntity)
    private readonly swapRepo: Repository<SwapEntity>,
  ) {}

  /**
   * Retrieves swaps that are eligible for claiming rewards based on reward timelock conditions.
   * Finds all swaps that:
   *   - Have been redeemed (status = REDEEMED) - secret is known
   *   - Have a reward timelock that will expire within the next 2 minutes
   *   - Have not been claimed yet
   *
   * @returns {Promise<SwapEntity[]>}
   */
  async findEligibleSwaps(): Promise<SwapEntity[]> {
    const windowEnd = Math.floor(Date.now() / 1000 + 2 * 60); // 2 minutes

    return this.swapRepo
      .createQueryBuilder('s')
      .select(['s.id', 's.dstNetwork', 's.rewardTimelock', 's.secret'])
      .where('s.status = :status', { status: HtlcStatus.REDEEMED })
      .andWhere('s.rewardTimelock <= :windowEnd', { windowEnd })
      .andWhere('s.scheduledAt IS NULL')
      .orderBy('s.rewardTimelock', 'ASC')
      .limit(100)
      .getMany();
  }

  /**
   * Updates multiple swaps by IDs.
   *
   * @param {string[]} ids The IDs of the swaps to update.
   * @param {Partial<SwapEntity>} data Partial swap data to update.
   *
   * @returns {Promise<void>}
   */
  async updateByIds(ids: string[], data: Partial<SwapEntity>): Promise<void> {
    if (!ids.length) return;

    await this.swapRepo
      .createQueryBuilder()
      .update(SwapEntity)
      .set(data)
      .where('id IN (:...ids)', { ids })
      .execute();
  }

  async createOrUpdate(
    data: Partial<SwapEntity>,
    conflictOptions: string[] = ['id'],
  ): Promise<void> {
    await this.swapRepo.upsert(data, conflictOptions);
  }

  async insert(data: Partial<SwapEntity>): Promise<void> {
    await this.swapRepo.insert(data);
  }

  /**
   * Find a swap by ID.
   *
   * @param {string} id The ID of the swap.
   *
   * @returns {Promise<SwapEntity>}
   */
  async findById(id: string): Promise<SwapEntity | null> {
    return this.swapRepo.findOne({ where: { id } });
  }

  /**
   * Updates an existing swap.
   *
   * @param {string} id The ID of the swap.
   * @param {Partial<SwapEntity>} data Partial swap data.
   *
   * @returns {Promise<void>}
   */
  async update(id: string, data: Partial<SwapEntity>): Promise<void> {
    await this.swapRepo.update(id, data);
  }

  /**
   * Delete a swap by ID.
   *
   * @param {string} id The ID of the swap.
   *
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await this.swapRepo.delete(id);
  }

  /**
   * Mark a swap as claimed.
   *
   * @param {string} id The ID of the swap.
   * @param {Date} claimedAt Optional date when the swap was claimed.
   *
   * @returns {Promise<void>}
   */
  // async markAsClaimed(id: string, claimedAt?: Date): Promise<void> {
  //   await this.update(id, {
  //     isClaimed: true,
  //     claimedAt,
  //   });
  // }
}
