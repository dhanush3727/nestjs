import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { TransactionQueryDto } from './dto/TransactionQueryDto.dto';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';

type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
};

@Controller({
  path: 'transactions',
  version: '1',
})
export class TransactionController {
  private transactions: Transaction[] = [];

  // Create a new transaction
  @Post()
  create(@Body() dto: CreateTransactionDto) {
    const newTx = { id: Date.now().toString(), ...dto };
    this.transactions.push(newTx);

    return {
      success: true,
      data: newTx,
      message: 'Transaction created',
    };
  }

  // Get all transactions
  @Get()
  findAll(@Query() query: TransactionQueryDto) {
    let data = [...this.transactions];

    // Filtering
    if (query.type) {
      data = data.filter((tx) => tx.type === query.type);
    }

    if (query.category) {
      data = data.filter((tx) => tx.category === query.category);
    }

    // Sorting
    if (query.sort) {
      const [field, order] = query.sort.split(':');
      data.sort((a, b) => {
        if (a[field] < b[field]) return order === 'desc' ? 1 : -1;
        if (a[field] > b[field]) return order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Pagination
    const page = query.page ? parseInt(query.page.toString(), 10) : 1;
    const limit = query.limit ? parseInt(query.limit.toString(), 10) : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginated = data.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginated,
      meta: {
        total: data.length,
        page,
        limit,
      },
    };
  }

  // Get a transaction by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    const tx = this.transactions.find((t) => t.id === id);

    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }

    return {
      success: true,
      data: tx,
    };
  }

  // Update transaction
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    const index = this.transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException('Transaction not found');
    }

    this.transactions[index] = { ...this.transactions[index], ...dto };

    return {
      success: true,
      data: this.transactions[index],
      message: 'Transaction updated',
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const index = this.transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException('Transaction not found');
    }

    const deleted = this.transactions.splice(index, 1);

    return {
      success: true,
      data: deleted[0],
      message: 'Transaction deleted',
    };
  }
}
