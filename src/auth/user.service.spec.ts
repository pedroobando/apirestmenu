import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DATABASE_CONNECTION } from '../database/database-connection';
import {
  mockRepository,
  createDatabaseMock,
  resetMocks,
} from '../test/mocks/database.mock';
import { mockUser, updateUserDto } from '../test/fixtures/user.fixture';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto';

describe('UserService', () => {
  let service: UserService;
  let databaseMock: jest.Mocked<any>;

  beforeEach(async () => {
    resetMocks();
    databaseMock = createDatabaseMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DATABASE_CONNECTION,
          useValue: databaseMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      const result = await service.findById(mockUser.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockUser.id);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on database error', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockRejectedValue(new Error('database error')),
        }),
      });

      await expect(service.findById(mockUser.id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      const result = await service.findByEmail(mockUser.email);

      expect(result).toBeDefined();
      expect(result?.email).toBe(mockUser.email);
    });

    it('should return null when user not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.findByEmail('nonexistent@test.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updatedUser = {
        ...mockUser,
        name: updateUserDto.name,
        updatedAt: new Date(),
      };

      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      mockRepository.update.mockReturnValue({
        set: mockRepository.set.mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedUser]),
          }),
        }),
      });

      const result = await service.update(mockUser.id, updateUserDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateUserDto.name);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.update('invalid-id', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      mockRepository.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      const result = await service.remove(mockUser.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockUser.id);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
