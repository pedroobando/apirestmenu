import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class PaginationMenuDigitalDto extends PartialType(PaginationDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  isSuggestion?: boolean;

  @IsOptional()
  @IsBoolean()
  isCustomMenu?: boolean;
}
