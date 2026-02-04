import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
// import { User } from './entities';
import { IUser } from './interfaces';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from './schema/schema';
import { tryCatch } from 'src/common/utils';
import { eq } from 'drizzle-orm';

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
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(DATABASE_CONNECTION)
    private readonly repository: NodePgDatabase<typeof schema>,
  ) {}

  async create(createDto: CreateUserDto) {
    const { ...signupInput } = createDto;

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .insert(this.userSchema)
        .values({
          email: signupInput.email.toLowerCase().trim(),
          name: createDto.name.trim(),
          password: this.bcryptPass(signupInput.password),
          role: signupInput.role,
        })
        .returning(),
    );

    if (errResult && !dataResult) {
      this.logger.error(`Create - ${errResult.message}`);
      throw new BadRequestException(
        `Usuario registrado con email ${signupInput.email.toLowerCase().trim()}`,
      );
    }

    return this.checkAuthStatus({ ...dataResult[0] } as IUser);
  }

  async login(loginInput: LoginUserDto) {
    const { email, password } = loginInput;
    const [dataResult, errResult] = await tryCatch(
      this.repository
        .select({ ...this.selectUser })
        .from(this.userSchema)
        .where(eq(this.userSchema.email, email)),
    );

    if (errResult && !dataResult) {
      this.logger.error(`Error Login - ${errResult.message}`);
      throw new BadRequestException(
        `Error en ingreso de informacion, favor revisar los datos.`,
      );
    }

    if (!dataResult || dataResult.length === 0) {
      throw new NotFoundException('Usuario no registrado');
    }

    if (!dataResult) {
      throw new UnauthorizedException(`No autorizado email / password`);
    }

    if (!bcrypt.compareSync(password, dataResult[0].password)) {
      throw new UnauthorizedException(`No autorizado email / password.`);
    }

    return this.checkAuthStatus(dataResult[0] as IUser);
  }

  async update(user: IUser, updateDto: UpdateUserDto) {
    const { ...signupInput } = updateDto;
    const id = user.id;
    const [dataFind, errorFind] = await tryCatch(this.getById(id));

    if (!dataFind && errorFind) {
      throw new NotFoundException(`No se encontro el usuario`);
    }

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .update(this.userSchema)
        .set({
          ...signupInput,
        })
        .where(eq(this.userSchema.id, id))
        .returning(),
    );

    if (!dataResult && errResult) {
      // console.error(errResult.message);
      this.logger.error(errResult.message);
      throw new InternalServerErrorException(`Error update: ${errResult.message}`);
    }

    return this.checkAuthStatus(dataResult[0] as IUser);
  }

  private async getById(id: string): Promise<IUser> {
    const [user, error] = await tryCatch(
      this.repository
        .select(this.selectUser)
        .from(this.userSchema)
        .where(eq(this.userSchema.id, id)),
    );
    if (error) {
      this.logger.error(error.message);
      throw new BadRequestException(`Error buscando ${id}`);
    }
    return user[0] as IUser;
  }

  private async getByEmail(email: string): Promise<IUser> {
    const [user, error] = await tryCatch(
      this.repository
        .select(this.selectUser)
        .from(this.userSchema)
        .where(eq(this.userSchema.email, email)),
    );
    if (error) {
      this.logger.error(error.message);
      throw new BadRequestException(`Error buscando email del usuario ${email}`);
    }
    return user[0] as IUser;
  }

  private checkAuthStatus(user: IUser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restDataUser } = user;
    return { ...restDataUser, token: this.getJwtToken({ id: user.id }) };
  }

  private bcryptPass(password: string): string {
    return bcrypt.hashSync(password.trim(), 10);
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
