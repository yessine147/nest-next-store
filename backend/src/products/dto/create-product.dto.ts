import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Laptop',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-performance laptop with 16GB RAM',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product price (must be >= 0)',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;
}
