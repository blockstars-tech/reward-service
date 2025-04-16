import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
  ) {}

  /**
   * Creates a new transaction record.
   *
   * @param data - Partial transaction data.
   *
   * @returns {Promise<TransactionEntity>}
   */
  async create(data: Partial<TransactionEntity>): Promise<TransactionEntity> {
    const transaction = this.transactionRepo.create(data);

    return this.transactionRepo.save(transaction);
  }

  /**
   * Updates an existing transaction.
   *
   * @param {string} id - The ID of the transaction.
   * @param {Partial<TransactionEntity>} data - Partial transaction data.
   *
   * @returns {Promise<TransactionEntity>}
   */
  async update(id: string, data: Partial<TransactionEntity>): Promise<void> {
    await this.transactionRepo.update(id, data);
  }

  /**
   * Retrieves transactions by swap ID.
   *
   * @param {string} swapId - The ID of the swap.
   *
   * @returns {Promise<TransactionEntity[]>}
   */
  async findBySwapId(swapId: string): Promise<TransactionEntity[]> {
    return this.transactionRepo.find({ where: { swapId } });
  }
}
