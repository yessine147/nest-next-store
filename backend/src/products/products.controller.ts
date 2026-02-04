import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    schema: {
      example: [
        {
          id: 1,
          name: 'Laptop',
          description: 'High-performance laptop',
          price: '999.99',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    schema: {
      example: {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop',
        price: '999.99',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product (requires authentication)' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    schema: {
      example: {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop',
        price: '999.99',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiBody({ type: CreateProductDto })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a product (requires authentication)' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    schema: {
      example: {
        id: 1,
        name: 'Updated Laptop',
        description: 'Updated description',
        price: '1099.99',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiBody({ type: UpdateProductDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a product (requires authentication)' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
    return { success: true };
  }
}
