import { Injectable, Logger } from '@nestjs/common';
import { ITransaction } from 'src/types/Transactions';

@Injectable()
export class ComputationService {
  private logger = new Logger('COMPUTATION-SERVICE');
  private AMOUNT = 0;
  computePaymnet(transaction: ITransaction) {
    if (transaction.SplitInfo.length < 1) {
      return {
        message: 'Splitinfo cannot be empty',
        status: 400,
      };
    }

    if (transaction.SplitInfo.length > 20) {
      return {
        message: 'Splitinfo cannot have more than 20 entries',
        status: 400,
      };
    }

    this.setAmount(transaction.Amount);
    // get all flat transaction types
    const FLAT_CALCULATIONS = [];
    transaction.SplitInfo.filter((item) => item.SplitType === 'FLAT').map(
      (trans) => {
        this.AMOUNT -= trans.SplitValue;
        FLAT_CALCULATIONS.push({
          SplitEntityId: trans.SplitEntityId,
          Amount: trans.SplitValue,
        });
      },
    );

    const PERCENTAGE_CALCULATIONS = [];
    transaction.SplitInfo.filter((item) => item.SplitType === 'PERCENTAGE').map(
      (trans) => {
        const percentage = (trans.SplitValue * this.AMOUNT) / 100;
        this.AMOUNT -= percentage;
        PERCENTAGE_CALCULATIONS.push({
          SplitEntityId: trans.SplitEntityId,
          Amount: percentage,
        });
      },
    );

    let TOTAL_RATIO = 0;
    const RATIO_TRANSACTION = transaction.SplitInfo.filter(
      (item) => item.SplitType === 'RATIO',
    ).map((ratio) => {
      TOTAL_RATIO = TOTAL_RATIO + ratio.SplitValue;
      return ratio;
    });

    // ration calculation
    const RATIOS: number[] = [];

    // getting ratios
    const RT: Array<{ SplitEntityId: string; Amount: number }> = [];
    for (const r of RATIO_TRANSACTION) {
      const ratio = (r.SplitValue / TOTAL_RATIO) * this.AMOUNT;
      RT.push({
        SplitEntityId: r.SplitEntityId,
        Amount: ratio,
      });
      RATIOS.push(ratio);
    }

    // calculate amount based on the ratios
    for (const c of RT) {
      const amount = this.AMOUNT - c.Amount;
      this.setAmount(amount);
    }

    this.logger.verbose(RATIOS);

    return {
      ID: transaction.ID,
      Amount: this.AMOUNT,
      SplitBreakdown: [...FLAT_CALCULATIONS, ...PERCENTAGE_CALCULATIONS, ...RT],
      status: 200,
    };
  }

  setAmount(amount: number): void {
    this.AMOUNT = amount;
  }
}
