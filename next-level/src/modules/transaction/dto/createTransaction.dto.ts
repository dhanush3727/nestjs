import { IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount!: number;

  @IsEnum(['income', 'expense'])
  type!: 'income' | 'expense';

  @IsString()
  category!: string;

  @IsString()
  note!: string;
}
