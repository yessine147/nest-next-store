import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productsRepository.create({
        ...dto,
        price: dto.price.toString(),
      });
      return await this.productsRepository.save(product);
    } catch (error) {
      this.logger.error(
        `Failed to create product: ${error.message}`,
        error.stack,
      );
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          'Failed to create product. Please check your input.',
        );
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Product[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      // Validate pagination parameters
      if (page < 1) {
        throw new BadRequestException('Page must be greater than 0');
      }
      if (limit < 1 || limit > 100) {
        throw new BadRequestException('Limit must be between 1 and 100');
      }

      const skip = (page - 1) * limit;
      const [data, total] = await this.productsRepository.findAndCount({
        skip,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });

      const totalPages = Math.ceil(total / limit) || 1;

      // If page exceeds total pages, return empty result with correct meta
      if (page > totalPages && total > 0) {
        return {
          data: [],
          meta: {
            total,
            page,
            limit,
            totalPages,
          },
        };
      }

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch products: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.findOne(id);
      Object.assign(product, {
        ...dto,
        price: dto.price !== undefined ? dto.price.toString() : product.price,
      });
      return await this.productsRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update product ${id}: ${error.message}`,
        error.stack,
      );
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          'Failed to update product. Please check your input.',
        );
      }
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const product = await this.findOne(id);
      await this.productsRepository.remove(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete product ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
