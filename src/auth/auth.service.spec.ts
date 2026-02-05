import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DATABASE_CONNECTION } from '../database/database-connection';
import {
  mockRepository,
  createDatabaseMock,
  resetMocks,
} from '../test/mocks/database.mock';
import { createJwtServiceMock, mockJwtService } from '../test/mocks/jwt.service.mock';
import { mockUser, createUserDto, loginUserDto } from '../test/fixtures/user.fixture';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as schema from './schema/schema';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;
  let databaseMock: jest.Mocked<any>;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(async () => {
    resetMocks();
    databaseMock = createDatabaseMock();
    jwtServiceMock = createJwtServiceMock();
    userServiceMock = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DATABASE_CONNECTION,
          useValue: databaseMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createdUser = {
        ...mockUser,
        email: createUserDto.email.toLowerCase(),
        name: createUserDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.insert.mockReturnValue({
        values: mockRepository.values.mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdUser]),
        }),
      });

      mockJwtService.sign.mockReturnValue('new-jwt-token');

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.token).toBe('new-jwt-token');
      expect(result.email).toBe(createUserDto.email.toLowerCase());
    });

    it('should throw BadRequestException on duplicate email', async () => {
      mockRepository.insert.mockReturnValue({
        values: mockRepository.values.mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('duplicate key')),
        }),
      });

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return token on valid credentials', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('login-jwt-token');

      const result = await service.login(loginUserDto);

      expect(result).toBeDefined();
      expect(result.token).toBe('login-jwt-token');
      expect(result.email).toBe(mockUser.email);

      compareSpy.mockRestore();
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);

      compareSpy.mockRestore();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockRepository.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user by id', async () => {
      userServiceMock.findById.mockResolvedValue(mockUser);

      const result = await service.validateUser({ id: mockUser.id });

      expect(result).toEqual(mockUser);
      expect(userServiceMock.findById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw when user not found', async () => {
      userServiceMock.findById.mockRejectedValue(
        new Error('Usuario con ID invalid-id no encontrado'),
      );

      await expect(service.validateUser({ id: 'invalid-id' })).rejects.toThrow();
    });
  });

  describe('hashPassword', () => {
    it('should hash password', async () => {
      const result = await service['hashPassword']('testPassword');

      expect(result).toBeDefined();
      expect(result).not.toBe('testPassword');
      expect(result.startsWith('$2b$10$')).toBe(true);
    });
  });

  describe('comparePassword', () => {
    it('should return true for valid password', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service['comparePassword']('plain', 'hashed');

      expect(result).toBe(true);

      compareSpy.mockRestore();
    });

    it('should return false for invalid password', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service['comparePassword']('plain', 'hashed');

      expect(result).toBe(false);

      compareSpy.mockRestore();
    });
  });
});
