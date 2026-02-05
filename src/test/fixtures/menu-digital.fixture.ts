import { IMenuDigital } from '../../menu-digital/inteface';
import { CreateMenuDigitalDto } from '../../menu-digital/dto/create-menu-digital.dto';
import { UpdateMenuDigitalDto } from '../../menu-digital/dto/update-menu-digital.dto';

export const mockMenuDigital: IMenuDigital = {
  id: '550e8400-e29b-41d4-a716-446655440003',
  name: 'Café Americano',
  description: 'Café negro americano',
  price: 3.5,
  categoryId: '550e8400-e29b-41d4-a716-446655440001',
  badges: ['popular'],
  isSuggestion: false,
  isCustomMenu: false,
  isAvailable: true,
  userId: '550e8400-e29b-41d4-a716-446655440000',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockMenuDigitalList: IMenuDigital[] = [
  mockMenuDigital,
  {
    ...mockMenuDigital,
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Latte',
    price: 4.5,
  },
];

export const createMenuDigitalDto: CreateMenuDigitalDto = {
  name: 'Mocha',
  description: 'Café con chocolate',
  price: 5.0,
  categoryId: '550e8400-e29b-41d4-a716-446655440001',
  badges: ['nuevo'],
  isSuggestion: false,
  isCustomMenu: false,
  isAvailable: true,
};

export const updateMenuDigitalDto = {
  name: 'Mocha Actualizado',
  price: 5.5,
} as UpdateMenuDigitalDto;
