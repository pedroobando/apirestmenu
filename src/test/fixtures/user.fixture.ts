import { IUser } from '../../auth/interfaces';
import { UpdateUserDto } from '../../auth/dto/update-user.dto';

export const mockUser: IUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Test User',
  email: 'test@test.com',
  password: '$2a$10$X7jXQwMRgCZzJJKfXKk.OeZ.JkZ1',
  role: 'admin',
  active: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockUserWithoutPassword = {
  id: mockUser.id,
  name: mockUser.name,
  email: mockUser.email,
  role: mockUser.role,
  active: mockUser.active,
  createdAt: mockUser.createdAt,
  updatedAt: mockUser.updatedAt,
};

export const createUserDto = {
  name: 'New User',
  email: 'new@test.com',
  password: 'password123',
  role: 'admin',
};

export const loginUserDto = {
  email: 'test@test.com',
  password: 'password123',
};

export const updateUserDto = {
  name: 'Updated User',
  email: 'updated@test.com',
} as UpdateUserDto;
