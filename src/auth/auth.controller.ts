import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RoleProtected } from './decorators';
// import { RawHeaders } from 'src/common/decorators';
// import { IncomingHttpHeaders } from 'http';
import { User } from './entities';
import { ValidRoles } from './interfaces';
import { UserRoleGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  @Patch('change')
  update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(user, updateUserDto);
  }

  // @Get('private')
  // @UseGuards(AuthGuard())
  // privateRoutes(
  //   @GetUser() user: User,
  //   @GetUser('email') userEmail: string,
  //   @RawHeaders() rawHeaders: string[],
  //   // @Headers() headers: IncomingHttpHeaders,
  // ) {
  //   return { ok: true, message: 'Hola Mundo Private', user, userEmail, rawHeaders, headers };
  // }

  @Get('private2')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.participant, ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      message: 'private3',
      ok: true,
      user,
    };
  }
}
