import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Laptop',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-performance laptop with 16GB RAM',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price (must be >= 0)',
    example: 999.99,
    minimum: 0,
  })
  price?: number;
}
