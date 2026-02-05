import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMenuDigitalDto {
  @IsString()
  @MinLength(4, { message: 'El nombre lo minimo de caracteres son cuatro (4)' })
  @MaxLength(30, { message: 'El nombre lo maximo permitido de caracteres (20)' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, {
    message: 'La descripcion maximo de numero permitido de caracteres es doce (50)',
  })
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Valor minio del precio es cero (0)' })
  @Type(() => Number)
  price: number;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @IsOptional()
  badges: string[];

  @IsOptional()
  isSuggestion: boolean;

  @IsOptional()
  isCustomMenu: boolean;

  @IsOptional()
  isAvailable: boolean;
}
