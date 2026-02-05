import { IsEmail, IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  password: string;

  @IsIn(['participant', 'organization', 'admin', 'assistant', 'judge'])
  @IsString()
  @MinLength(3)
  role: string;
}
