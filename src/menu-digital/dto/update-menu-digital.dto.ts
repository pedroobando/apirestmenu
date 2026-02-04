import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDigitalDto } from './create-menu-digital.dto';

export class UpdateMenuDigitalDto extends PartialType(CreateMenuDigitalDto) {}
