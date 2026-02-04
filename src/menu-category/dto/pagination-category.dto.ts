// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto';
// import { CreatePostDto } from './create-post.dto';

export class PaginationCategoryDto extends PartialType(PaginationDto) {
  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
