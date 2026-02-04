import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration, JoiValidationSchema } from './config';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['.env.prod'], //Tambien se puede especificar el nombre del archivo
      // isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    CommonModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    MenuCategoryModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
