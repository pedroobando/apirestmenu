import { Test, TestingModule } from '@nestjs/testing';
import { MenuDigitalService } from './menu-digital.service';
import { DATABASE_CONNECTION } from '../database/database-connection';
import {
  mockRepository,
  createDatabaseMock,
  resetMocks,
} from '../test/mocks/database.mock';
import {
  mockMenuDigital,
  mockMenuDigitalList,
  createMenuDigitalDto,
  updateMenuDigitalDto,
} from '../test/fixtures/menu-digital.fixture';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateMenuDigitalDto } from './dto';
import { IUser } from '../auth/interfaces';
import { MenuCategoryService } from '../menu-category/menu-category.service';

describe('MenuDigitalService', () => {
  let service: MenuDigitalService;
  let databaseMock: jest.Mocked<any>;
  let menuCategoryServiceMock: jest.Mocked<MenuCategoryService>;

  const mockUser: IUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test User',
    email: 'test@test.com',
    password: 'hashed',
    role: 'admin',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    resetMocks();
    databaseMock = createDatabaseMock();
    menuCategoryServiceMock = {
      findOne: jest.fn().mockResolvedValue(mockMenuDigital),
    } as unknown as jest.Mocked<MenuCategoryService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuDigitalService,
        {
          provide: DATABASE_CONNECTION,
          useValue: databaseMock,
        },
        {
          provide: MenuCategoryService,
          useValue: menuCategoryServiceMock,
        },
      ],
    }).compile();

    service = module.get<MenuDigitalService>(MenuDigitalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createdProduct = {
        id: mockMenuDigital.id,
        name: createMenuDigitalDto.name,
        description: createMenuDigitalDto.description,
        price: createMenuDigitalDto.price,
        categoryId: createMenuDigitalDto.categoryId,
        badges: createMenuDigitalDto.badges,
        isSuggestion: false,
        isCustomMenu: false,
        isAvailable: true,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.insert.mockReturnValue({
        values: mockRepository.values.mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdProduct]),
        }),
      });

      const result = await service.create(mockUser, createMenuDigitalDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createMenuDigitalDto.name);
    });

    it('should throw BadRequestException on error', async () => {
      mockRepository.insert.mockReturnValue({
        values: mockRepository.values.mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('database error')),
        }),
      });

      await expect(service.create(mockUser, createMenuDigitalDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return empty array when no products', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          offset: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      });

      const result = await service.findAll({ limit: 10, offset: 0 });

      expect(result).toEqual([]);
    });

    it('should return products list', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          offset: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockResolvedValue(mockMenuDigitalList),
            }),
          }),
        }),
      });

      const result = await service.findAll({ limit: 10, offset: 0 });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('findOnePlain', () => {
    it('should return product without sensitive fields', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockMenuDigital]),
          }),
        }),
      });

      const result = await service.findOnePlain(mockMenuDigital.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockMenuDigital.id);
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      const updatedProduct = {
        ...mockMenuDigital,
        name: updateMenuDigitalDto.name,
        price: updateMenuDigitalDto.price,
        updatedAt: new Date(),
      };

      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockMenuDigital]),
          }),
        }),
      });

      mockRepository.update.mockReturnValue({
        set: mockRepository.set.mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedProduct]),
          }),
        }),
      });

      const result = await service.update(
        mockUser,
        mockMenuDigital.id,
        updateMenuDigitalDto,
      );

      expect(result).toBeDefined();
      expect(result.name).toBe(updateMenuDigitalDto.name);
    });

    it('should throw BadRequestException for invalid UUID', async () => {
      await expect(
        service.update(mockUser, 'invalid-uuid', updateMenuDigitalDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(
        service.update(mockUser, mockMenuDigital.id, updateMenuDigitalDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete product successfully', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockMenuDigital]),
          }),
        }),
      });

      mockRepository.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockMenuDigital]),
        }),
      });

      const result = await service.remove(mockMenuDigital.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockMenuDigital.id);
    });

    it('should throw BadRequestException for invalid UUID', async () => {
      await expect(service.remove('invalid-uuid')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.remove(mockMenuDigital.id)).rejects.toThrow(NotFoundException);
    });
  });
});
