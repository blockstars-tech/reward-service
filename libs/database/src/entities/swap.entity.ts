import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { HtlcStatus } from '../../../shared/src';

@Index(['rewardTimelock', 'status', 'scheduledAt'])
@Entity('swaps')
export class SwapEntity extends AbstractEntity {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text', nullable: true })
  dstNetwork?: string;

  @Column({ type: 'text', nullable: true })
  dstAsset?: string;

  @Column({ type: 'text', nullable: true })
  srcNetwork?: string;

  @Column({ type: 'text', nullable: true })
  srcAsset?: string;

  @Column({ type: 'text', nullable: true })
  hashlock?: string;

  @Column({ type: 'text', nullable: true })
  secret?: string;

  @Column({ type: 'bigint', nullable: true })
  timelock?: string;

  @Column({ type: 'numeric', nullable: true })
  reward?: string;

  @Column({ type: 'bigint', nullable: true })
  rewardTimelock?: string;

  @Column({
    type: 'smallint',
    default: HtlcStatus.IN_PROGRESS,
    comment: '0: IN_PROGRESS, 2: REFUNDED, 3: REDEEMED',
  })
  status: HtlcStatus;

  @Column({ type: 'timestamp without time zone', nullable: true })
  scheduledAt?: Date;
}
