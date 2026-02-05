import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsOptional()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsIn(['participant', 'organization', 'admin', 'assistant', 'judge'])
  @IsString()
  @MinLength(3)
  @IsOptional()
  role: string;
}
