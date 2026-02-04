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
  // @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'The password must have a Uppercase, lowercase letter and a number',
  // })
  password: string;

  // @IsString()
  // @MinLength(3)
  // @MaxLength(80)
  // fullName: string;

  // @IsArray({})
  @IsIn(['participant', 'organization', 'admin', 'assistant', 'judge'])
  @IsString()
  @MinLength(3)
  role: string;
}
