import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Product } from './product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: jest.Mocked<ProductsService>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: '99.99',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    imageUrl: null,
  };

  beforeEach(async () => {
    const mockProductsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const query: PaginationQueryDto = { page: 1, limit: 10 };
      const mockResponse = {
        data: [mockProduct],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      productsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(query);

      expect(productsService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockResponse);
    });

    it('should use default pagination values', async () => {
      const query: PaginationQueryDto = {};
      const mockResponse = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      productsService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll(query);

      expect(productsService.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      productsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(productsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      productsService.findOne.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
      };

      productsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createDto);

      expect(productsService.create).toHaveBeenCalledWith(createDto, undefined);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
      };
      const updatedProduct = { ...mockProduct, name: 'Updated Product' };

      productsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(1, updateDto);

      expect(productsService.update).toHaveBeenCalledWith(
        1,
        updateDto,
        undefined,
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      productsService.update.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await expect(controller.update(999, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      productsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(productsService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if product not found', async () => {
      productsService.remove.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
