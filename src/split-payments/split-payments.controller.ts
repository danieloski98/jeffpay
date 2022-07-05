import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ITransaction } from 'src/types/Transactions';
import { ComputationService } from './services/computation/computation.service';

@Controller('split-payments')
export class SplitPaymentsController {
  constructor(private computeService: ComputationService) {}

  @Post('compute')
  compute(@Res() res: Response, @Body() body: ITransaction) {
    const result = this.computeService.computePaymnet(body);
    res.status(result.status).send(result);
  }
}
