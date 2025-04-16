import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { TransactionStatus } from '../../../shared/src';

@Index(['swapId', 'hash', 'status'])
@Entity('transactions')
export class TransactionEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  swapId: string;

  @Column({ type: 'text' })
  network: string;

  @Column({ type: 'text' })
  address: string;

  // raw fee in native currency
  @Column({ type: 'bigint', nullable: true })
  fee?: string;

  @Column({ type: 'text', nullable: true })
  hash?: string;

  @Column({
    type: 'smallint',
    default: TransactionStatus.PENDING,
    comment: '0: PENDING, 1: SUCCESS, 2: FAILED, 3: REPLACED',
  })
  status: TransactionStatus;

  @Column({ type: 'text', nullable: true })
  error?: string;
}
// 1743769873707;
