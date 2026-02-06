import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
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

  async create(dto: CreateProductDto, imageUrl?: string): Promise<Product> {
    try {
      const product = this.productsRepository.create({
        ...dto,
        price: dto.price.toString(),
        imageUrl: imageUrl ?? null,
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

  async update(
    id: number,
    dto: UpdateProductDto,
    imageUrl?: string,
  ): Promise<Product> {
    try {
      const product = await this.findOne(id);

      // Delete old image file if a new image is being uploaded
      if (
        imageUrl !== undefined &&
        product.imageUrl &&
        product.imageUrl !== imageUrl
      ) {
        try {
          const urlParts = product.imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          const imagePath = join(
            process.cwd(),
            'uploads',
            'products',
            filename,
          );

          if (existsSync(imagePath)) {
            unlinkSync(imagePath);
            this.logger.log(`Deleted old image file: ${imagePath}`);
          }
        } catch (fileError) {
          this.logger.warn(
            `Failed to delete old image file for product ${id}: ${fileError}`,
          );
        }
      }

      Object.assign(product, {
        ...dto,
        price: dto.price !== undefined ? dto.price.toString() : product.price,
      });
      if (imageUrl !== undefined) {
        product.imageUrl = imageUrl;
      }
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

      // Delete associated image file if it exists
      if (product.imageUrl) {
        try {
          // Extract filename from imageUrl (format: http://localhost:3000/uploads/products/filename.ext)
          const urlParts = product.imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          const imagePath = join(
            process.cwd(),
            'uploads',
            'products',
            filename,
          );

          if (existsSync(imagePath)) {
            unlinkSync(imagePath);
            this.logger.log(`Deleted image file: ${imagePath}`);
          }
        } catch (fileError) {
          // Log error but don't fail the product deletion if image deletion fails
          this.logger.warn(
            `Failed to delete image file for product ${id}: ${fileError}`,
          );
        }
      }

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
