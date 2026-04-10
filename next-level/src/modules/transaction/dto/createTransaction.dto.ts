import { IsNumber, Min, IsString, IsEnum } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsEnum(['income', 'expense'])
  type!: 'income' | 'expense';

  @IsString()
  category!: string;

  @IsString()
  note!: string;
}
