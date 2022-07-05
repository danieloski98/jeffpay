import { Module } from '@nestjs/common';
import { SplitPaymentsController } from './split-payments.controller';
import { ComputationService } from './services/computation/computation.service';

@Module({
  controllers: [SplitPaymentsController],
  providers: [ComputationService]
})
export class SplitPaymentsModule {}
