import { IMenuCategory } from '../../menu-category/inteface';
import { CreateMenuCategoryDto } from '../../menu-category/dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../../menu-category/dto/update-menu-category.dto';

export const mockMenuCategory: IMenuCategory = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Bebidas',
  description: 'Bebidas frías y calientes',
  orderInMenu: 1,
  isActive: true,
  userId: '550e8400-e29b-41d4-a716-446655440000',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockMenuCategoryList: IMenuCategory[] = [
  mockMenuCategory,
  {
    ...mockMenuCategory,
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Comida',
    orderInMenu: 2,
  },
];

export const createMenuCategoryDto: CreateMenuCategoryDto = {
  name: 'Postres',
  description: 'Dulces y pasteles',
  orderInMenu: 3,
};

export const updateMenuCategoryDto = {
  name: 'Postres Actualizados',
  description: 'Nuevos pasteles',
} as UpdateMenuCategoryDto;
