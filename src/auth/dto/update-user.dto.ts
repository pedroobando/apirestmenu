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

export class UpdateUserDto {
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

  // @IsString()
  // @MinLength(3)
  // @MaxLength(80)
  // fullName: string;

  // @IsArray({})
  @IsIn(['participant', 'organization', 'admin', 'assistant', 'judge'])
  @IsString()
  @MinLength(3)
  @IsOptional()
  role: string;
}
