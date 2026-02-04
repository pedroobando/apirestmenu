import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuCategoryDto } from './create-menu-category.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMenuCategoryDto extends PartialType(CreateMenuCategoryDto) {
  @IsOptional()
  @IsBoolean({ message: 'Debe indicar un valor true | false' })
  isActive: boolean;
}
