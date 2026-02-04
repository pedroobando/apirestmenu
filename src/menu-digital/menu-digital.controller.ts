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
import { MenuDigitalService } from './menu-digital.service';
import { CreateMenuDigitalDto, UpdateMenuDigitalDto } from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { IUser, ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dto';

@Controller('menudigital')
export class MenuDigitalController {
  constructor(private readonly menuDigitalService: MenuDigitalService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@GetUser() user: IUser, @Body() createMenuDigitalDto: CreateMenuDigitalDto) {
    return this.menuDigitalService.create(user, createMenuDigitalDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.menuDigitalService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.menuDigitalService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @GetUser() user: IUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateMenuDigitalDto: UpdateMenuDigitalDto,
  ) {
    return this.menuDigitalService.update(user, id, updateMenuDigitalDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.menuDigitalService.remove(id);
  }
}
