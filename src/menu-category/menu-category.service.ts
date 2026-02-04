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

import { CreateMenuCategoryDto, UpdateMenuCategoryDto } from './dto';

import * as schema from 'src/menu-category/schema';
import { tryCatch } from 'src/common/utils';
import { IMenuCategory } from './inteface';
import { IUser } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dto';
import { isUUID } from 'class-validator';

@Injectable()
export class MenuCategoryService {
  private readonly logger = new Logger(MenuCategoryService.name);
  private readonly categorySchema = schema.menuCategories;

  private defaultLimit: number = 20;
  private readonly selectData = {
    id: this.categorySchema.id,
    name: this.categorySchema.name,
    description: this.categorySchema.description,
    isActive: this.categorySchema.isActive,
    ordenInMenu: this.categorySchema.orderInMenu,
    createdAt: this.categorySchema.createdAt,
    updatedAt: this.categorySchema.updatedAt,
  };

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly repository: NodePgDatabase<typeof schema>,
  ) {}

  async create(user: IUser, createDto: CreateMenuCategoryDto) {
    const { ...categoryInput } = createDto;

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .insert(this.categorySchema)
        .values({
          ...categoryInput,
          name: categoryInput.name.trim(),
          description: categoryInput.description ?? '',
          userId: user.id,
        })
        .returning(),
    );

    if (errResult && !dataResult) {
      this.logger.error(`Create - ${errResult.message}`);
      throw new BadRequestException(
        `Problemas al crear la categoria ${categoryInput.name}`,
      );
    }

    return dataResult[0] as IMenuCategory;
  }

  async findAll(paginationDto: PaginationDto): Promise<IMenuCategory[]> {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .select(this.selectData)
        .from(this.categorySchema)
        .offset(offset)
        .limit(limit)
        .orderBy(this.categorySchema.orderInMenu),
      // .where(eq(this.userSchema.id, id)),
    );
    if (errResult && !dataResult) {
      this.logger.error(errResult.message);
      throw new BadRequestException(`Error buscando `);
    }
    if (dataResult.length <= 0) return [] as IMenuCategory[];

    return dataResult as unknown as IMenuCategory[];
  }

  private async findOne(term: string): Promise<IMenuCategory> {
    let dataResult;
    let errResult;

    if (isUUID(term, '4')) {
      // Buscar por UUID
      [dataResult, errResult] = await tryCatch(
        this.repository
          .select(this.selectData)
          .from(this.categorySchema)
          .where(eq(this.categorySchema.id, term))
          .limit(1),
      );
    } else {
      // Buscar por nombre
      [dataResult, errResult] = await tryCatch(
        this.repository
          .select(this.selectData)
          .from(this.categorySchema)
          .where(eq(this.categorySchema.name, term)),
      );
    }

    // Error en la consulta
    if (errResult && !dataResult) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`FindOne - ${errResult.message}`);
      throw new BadRequestException(`Error buscando la categoría con término: ${term}`);
    }

    // not found
    if (!dataResult) {
      throw new NotFoundException(
        `La categoría con el término ${term.toString()} no fue encontrada`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return dataResult[0] as IMenuCategory;
  }

  async findOnePlain(term: string) {
    const { ...restField } = await this.findOne(term);

    return {
      ...restField,
    };
  }

  async update(user: IUser, id: string, updateCatDto: UpdateMenuCategoryDto) {
    if (!isUUID(id, '4'))
      throw new BadRequestException(
        `El ${id}, de la category de menu digital no es valida, favor verificar.`,
      );

    const [dataFind, errorFind] = await tryCatch(this.findOne(id));

    if (!dataFind && errorFind) {
      Logger.warn(errorFind);
      throw new NotFoundException(errorFind.message);
    }

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .update(this.categorySchema)
        .set({ ...updateCatDto, userId: user.id })
        .where(eq(this.categorySchema.id, id))
        .returning(),
    );

    if (!dataResult && errResult) {
      Logger.error(errResult.message);
      throw new InternalServerErrorException(
        'Problema actualizando la categoria del menu, favor verificar.',
      );
    }

    return dataResult[0] as IMenuCategory;
  }

  async remove(id: string): Promise<IMenuCategory> {
    if (!isUUID(id, '4'))
      throw new BadRequestException(
        `El ID ${id} de la categoría no es válido, favor verificar.`,
      );

    const [dataFind, errorFind] = await tryCatch(this.findOne(id));

    if (!dataFind && errorFind) {
      Logger.warn(errorFind);
      throw new NotFoundException(errorFind.message);
    }

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .delete(this.categorySchema)
        .where(eq(this.categorySchema.id, id))
        .returning(),
    );

    if (!dataResult && errResult) {
      Logger.error(errResult.message);
      throw new InternalServerErrorException(
        'Problema eliminando la categoría del menú, favor verificar.',
      );
    }

    return dataResult[0] as IMenuCategory;
  }
}
