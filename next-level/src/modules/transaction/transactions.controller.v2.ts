import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'transactions',
  version: '2',
})
export class TransactionsControllerV2 {
  @Get()
  getTransactions() {
    return {
      success: true,
      data: [
        {
          id: '1',
          totalAmount: 500,
          currency: 'INR',
        },
      ],
    };
  }
}
