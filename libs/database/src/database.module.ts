import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfigOptions } from './typeorm.config';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionService } from './services';
import { SwapEntity } from './entities/swap.entity';
import { SwapService } from './services/swap.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfigOptions),
    TypeOrmModule.forFeature([SwapEntity, TransactionEntity]),
  ],
  providers: [SwapService, TransactionService],
  exports: [TypeOrmModule, SwapService, TransactionService],
})
export class DatabaseModule {}
