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

import { CreateMenuDigitalDto, UpdateMenuDigitalDto } from './dto';
import { MenuCategoryService } from 'src/menu-category/menu-category.service';

import * as schema from 'src/menu-digital/schema';
import { tryCatch } from 'src/common/utils';
import { IMenuDigital } from './inteface';
import { IUser } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dto';
import { isUUID } from 'class-validator';

@Injectable()
export class MenuDigitalService {
  private readonly logger = new Logger(MenuDigitalService.name);
  private readonly menuSchema = schema.menuDigitals;

  private defaultLimit: number = 20;
  private readonly selectData = {
    id: this.menuSchema.id,
    name: this.menuSchema.name,
    description: this.menuSchema.description,
    price: this.menuSchema.price,
    categoryId: this.menuSchema.categoryId,
    badges: this.menuSchema.badges,
    isSuggestion: this.menuSchema.isSuggestion,
    isCustomMenu: this.menuSchema.isCustomMenu,
    isAvailable: this.menuSchema.isAvailable,
    userId: this.menuSchema.userId,
    createdAt: this.menuSchema.createdAt,
    updatedAt: this.menuSchema.updatedAt,
  };

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly repository: NodePgDatabase<typeof schema>,
    private readonly menuCatService: MenuCategoryService,
  ) {}

  async create(user: IUser, createDto: CreateMenuDigitalDto) {
    const { categoryId, ...menuInput } = createDto;

    await this.menuCatService.findOne(categoryId);

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .insert(this.menuSchema)
        .values({
          ...menuInput,
          categoryId,
          name: menuInput.name.trim(),
          description: menuInput.description ?? '',
          badges: menuInput.badges ?? [],
          isSuggestion: menuInput.isSuggestion ?? false,
          isCustomMenu: menuInput.isCustomMenu ?? false,
          isAvailable: menuInput.isAvailable ?? true,
          userId: user.id,
        })
        .returning(),
    );

    if (errResult && !dataResult) {
      this.logger.error(`Create - ${errResult.message}`);
      throw new BadRequestException(
        `Problemas al crear el producto del menú ${menuInput.name}`,
      );
    }

    return dataResult[0] as IMenuDigital;
  }

  async findAll(paginationDto: PaginationDto): Promise<IMenuDigital[]> {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .select(this.selectData)
        .from(this.menuSchema)
        .offset(offset)
        .limit(limit)
        .orderBy(this.menuSchema.createdAt),
    );
    if (errResult && !dataResult) {
      this.logger.error(errResult.message);
      throw new BadRequestException(`Error buscando productos del menú`);
    }
    if (dataResult.length <= 0) return [] as IMenuDigital[];

    return dataResult as unknown as IMenuDigital[];
  }

  private async findOne(term: string): Promise<IMenuDigital> {
    let dataResult;
    let errResult;

    if (isUUID(term, '4')) {
      // Buscar por UUID
      [dataResult, errResult] = await tryCatch(
        this.repository
          .select(this.selectData)
          .from(this.menuSchema)
          .where(eq(this.menuSchema.id, term))
          .limit(1),
      );
    } else {
      // Buscar por nombre
      [dataResult, errResult] = await tryCatch(
        this.repository
          .select(this.selectData)
          .from(this.menuSchema)
          .where(eq(this.menuSchema.name, term)),
      );
    }

    // Error en la consulta
    if (errResult && !dataResult) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`FindOne - ${errResult.message}`);
      throw new BadRequestException(
        `Error buscando el producto del menú con término: ${term}`,
      );
    }

    // not found
    if (!dataResult || dataResult.length === 0) {
      throw new NotFoundException(
        `El producto del menú con el término ${term.toString()} no fue encontrado`,
      );
    }

    return dataResult[0] as IMenuDigital;
  }

  async findOnePlain(term: string) {
    const { ...restField } = await this.findOne(term);

    return {
      ...restField,
    };
  }

  async update(user: IUser, id: string, updateDto: UpdateMenuDigitalDto) {
    const { categoryId } = updateDto;

    if (!isUUID(id, '4'))
      throw new BadRequestException(
        `El ID ${id} del producto de menú digital no es válido, favor verificar.`,
      );

    if (categoryId) {
      await this.menuCatService.findOne(categoryId);
    }

    const [dataFind, errorFind] = await tryCatch(this.findOne(id));

    if (!dataFind && errorFind) {
      this.logger.warn(errorFind.message);
      throw new NotFoundException(errorFind.message);
    }

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .update(this.menuSchema)
        .set({ ...updateDto, userId: user.id })
        .where(eq(this.menuSchema.id, id))
        .returning(),
    );

    if (!dataResult && errResult) {
      this.logger.error(errResult.message);
      throw new InternalServerErrorException(
        'Problema actualizando el producto del menú, favor verificar.',
      );
    }

    return dataResult[0] as IMenuDigital;
  }

  async remove(id: string): Promise<IMenuDigital> {
    if (!isUUID(id, '4'))
      throw new BadRequestException(
        `El ID ${id} del producto no es válido, favor verificar.`,
      );

    const [dataFind, errorFind] = await tryCatch(this.findOne(id));

    if (!dataFind && errorFind) {
      this.logger.warn(errorFind.message);
      throw new NotFoundException(errorFind.message);
    }

    const [dataResult, errResult] = await tryCatch(
      this.repository
        .delete(this.menuSchema)
        .where(eq(this.menuSchema.id, id))
        .returning(),
    );

    if (!dataResult && errResult) {
      this.logger.error(errResult.message);
      throw new InternalServerErrorException(
        'Problema eliminando el producto del menú, favor verificar.',
      );
    }

    return dataResult[0] as IMenuDigital;
  }
}
