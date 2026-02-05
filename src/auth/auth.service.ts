import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from './interfaces';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema/schema';
import { tryCatch } from 'src/common/utils';
import { eq } from 'drizzle-orm';
import { UserService } from './user.service';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly userSchema = schema.users;

  private readonly selectUser = {
    id: this.userSchema.id,
    name: this.userSchema.name,
    email: this.userSchema.email,
    password: this.userSchema.password,
    role: this.userSchema.role,
    active: this.userSchema.active,
    createdAt: this.userSchema.createdAt,
    updatedAt: this.userSchema.updatedAt,
  };

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly repository: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async create(createDto: CreateUserDto): Promise<AuthResponseDto> {
    const { email, password, name, role } = createDto;

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .insert(this.userSchema)
        .values({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          password: await this.hashPassword(password),
          role: role,
        })
        .returning(),
    );

    if (errResult && !dataResult) {
      this.logger.error(`Create - ${errResult.message}`);
      throw new BadRequestException(
        `Error al crear usuario con email ${email.toLowerCase().trim()}`,
      );
    }

    return this.generateAuthResponse(dataResult[0] as IUser);
  }

  async login(loginDto: LoginUserDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .select({ ...this.selectUser })
        .from(this.userSchema)
        .where(eq(this.userSchema.email, email)),
    );

    if (errResult && !dataResult) {
      this.logger.error(`Login - ${errResult.message}`);
      throw new BadRequestException(`Error en autenticación`);
    }

    if (!dataResult || dataResult.length === 0) {
      throw new UnauthorizedException('Usuario no registrado');
    }

    const user = dataResult[0] as IUser;

    const isValidPassword = await this.comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateAuthResponse(user);
  }

  async validateUser(payload: JwtPayload): Promise<IUser | null> {
    return this.userService.findById(payload.id);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password.trim(), 10);
  }

  private async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  private generateAuthResponse(user: IUser): AuthResponseDto {
    const { password: _, ...userWithoutPassword } = user;
    const token = this.getJwtToken({ id: user.id });
    return { ...userWithoutPassword, token } as AuthResponseDto;
  }

  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
