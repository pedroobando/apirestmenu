import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { CreateMenuCategoryDto, UpdateMenuCategoryDto } from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { IUser, ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dto';

@Controller('category')
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@GetUser() user: IUser, @Body() createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.menuCategoryService.create(user, createMenuCategoryDto);
  }

  @Get()
  findAll(@Query() paginationPersDto: PaginationDto) {
    return this.menuCategoryService.findAll(paginationPersDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.menuCategoryService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @GetUser() user: IUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto,
  ) {
    return this.menuCategoryService.update(user, id, updateMenuCategoryDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.menuCategoryService.remove(id);
  }
}
