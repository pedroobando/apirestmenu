import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth';
import { MenuDigitalController } from './menu-digital.controller';
import { MenuDigitalService } from './menu-digital.service';
import { MenuCategoryModule } from 'src/menu-category/menu-category.module';

@Module({
  imports: [DatabaseModule, ConfigModule, AuthModule, MenuCategoryModule],
  controllers: [MenuDigitalController],
  providers: [MenuDigitalService],
})
export class MenuDigitalModule {}
