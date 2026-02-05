import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema/schema';
import { tryCatch } from 'src/common/utils';
import { IUser } from './interfaces';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
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
  ) {}

  async findById(id: string): Promise<IUser> {
    const [user, error] = await tryCatch(
      this.repository
        .select(this.selectUser)
        .from(this.userSchema)
        .where(eq(this.userSchema.id, id)),
    );

    if (error) {
      this.logger.error(`findById - ${error.message}`);
      throw new BadRequestException(`Error buscando usuario ${id}`);
    }

    if (!user || user.length === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user[0] as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const [user, error] = await tryCatch(
      this.repository
        .select(this.selectUser)
        .from(this.userSchema)
        .where(eq(this.userSchema.email, email)),
    );

    if (error) {
      this.logger.error(`findByEmail - ${error.message}`);
      throw new BadRequestException(`Error buscando email ${email}`);
    }

    return (user[0] as IUser) || null;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<IUser> {
    const [dataFind, errorFind] = await tryCatch(this.findById(id));

    if (errorFind) {
      this.logger.warn(errorFind);
      throw new NotFoundException(errorFind.message);
    }

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .update(this.userSchema)
        .set({
          ...updateDto,
        })
        .where(eq(this.userSchema.id, id))
        .returning(),
    );

    if (!dataResult && errResult) {
      this.logger.error(errResult.message);
      throw new InternalServerErrorException(
        `Error actualizando usuario: ${errResult.message}`,
      );
    }

    return dataResult[0] as IUser;
  }

  async remove(id: string): Promise<IUser> {
    const [dataFind, errorFind] = await tryCatch(this.findById(id));

    if (errorFind) {
      this.logger.warn(errorFind);
      throw new NotFoundException(errorFind.message);
    }

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .delete(this.userSchema)
        .where(eq(this.userSchema.id, id))
        .returning(),
    );

    if (!dataResult && errResult) {
      this.logger.error(errResult.message);
      throw new InternalServerErrorException(
        `Error eliminando usuario: ${errResult.message}`,
      );
    }

    return dataResult[0] as IUser;
  }
}
