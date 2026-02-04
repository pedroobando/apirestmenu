import { IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateMenuCategoryDto {
  @IsString()
  @MinLength(4, { message: 'El nombre lo minimo de caracteres son cuatro (4)' })
  @MaxLength(20, { message: 'El nombre lo maximo permitido de caracteres (20)' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, {
    message: 'La descripcion maximo de numero permitido de caracteres es doce (50)',
  })
  description: string;

  @IsOptional()
  @Min(1, { message: 'Valor minio del orden en el menu es 1' })
  orderInMenu: number;
}
