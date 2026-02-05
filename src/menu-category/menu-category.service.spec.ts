import { Test, TestingModule } from '@nestjs/testing';
import { MenuCategoryService } from './menu-category.service';
import { DATABASE_CONNECTION } from '../database/database-connection';
import {
  mockRepository,
  createDatabaseMock,
  resetMocks,
} from '../test/mocks/database.mock';
import {
  mockMenuCategory,
  mockMenuCategoryList,
  createMenuCategoryDto,
  updateMenuCategoryDto,
} from '../test/fixtures/menu-category.fixture';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateMenuCategoryDto } from './dto';
import { IUser } from '../auth/interfaces';

describe('MenuCategoryService', () => {
  let service: MenuCategoryService;
  let databaseMock: jest.Mocked<any>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuCategoryService,
        {
          provide: DATABASE_CONNECTION,
          useValue: databaseMock,
        },
      ],
    }).compile();

    service = module.get<MenuCategoryService>(MenuCategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const createdCategory = {
        id: mockMenuCategory.id,
        name: createMenuCategoryDto.name,
        description: createMenuCategoryDto.description,
        orderInMenu: createMenuCategoryDto.orderInMenu,
        isActive: true,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.insert.mockReturnValue({
        values: mockRepository.values.mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdCategory]),
        }),
      });

      const result = await service.create(mockUser, createMenuCategoryDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createMenuCategoryDto.name);
    });

    it('should throw BadRequestException on error', async () => {
      mockRepository.insert.mockReturnValue({
        values: mockRepository.values.mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('database error')),
        }),
      });

      await expect(service.create(mockUser, createMenuCategoryDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return empty array when no categories', async () => {
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

    it('should return categories list', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          offset: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockResolvedValue(mockMenuCategoryList),
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

  describe('findOne', () => {
    it('should find category by UUID', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockMenuCategory]),
          }),
        }),
      });

      const result = await service.findOne(mockMenuCategory.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockMenuCategory.id);
    });

    it('should find category by name', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockMenuCategory]),
        }),
      });

      const result = await service.findOne(mockMenuCategory.name);

      expect(result).toBeDefined();
      expect(result.name).toBe(mockMenuCategory.name);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOnePlain', () => {
    it('should return category without password field', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockMenuCategory]),
          }),
        }),
      });

      const result = await service.findOnePlain(mockMenuCategory.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockMenuCategory.id);
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      const updatedCategory = {
        ...mockMenuCategory,
        name: updateMenuCategoryDto.name,
        updatedAt: new Date(),
      };

      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockMenuCategory]),
          }),
        }),
      });

      mockRepository.update.mockReturnValue({
        set: mockRepository.set.mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedCategory]),
          }),
        }),
      });

      const result = await service.update(
        mockUser,
        mockMenuCategory.id,
        updateMenuCategoryDto,
      );

      expect(result).toBeDefined();
      expect(result.name).toBe(updateMenuCategoryDto.name);
    });

    it('should throw BadRequestException for invalid UUID', async () => {
      await expect(
        service.update(mockUser, 'invalid-uuid', updateMenuCategoryDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(
        service.update(mockUser, mockMenuCategory.id, updateMenuCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete category successfully', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockMenuCategory]),
          }),
        }),
      });

      mockRepository.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockMenuCategory]),
        }),
      });

      const result = await service.remove(mockMenuCategory.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockMenuCategory.id);
    });

    it('should throw BadRequestException for invalid UUID', async () => {
      await expect(service.remove('invalid-uuid')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.remove(mockMenuCategory.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
