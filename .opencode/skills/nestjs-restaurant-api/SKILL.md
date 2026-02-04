---
name: nestjs-restaurant-api
description: Skill para trabajar con el proyecto API Restaurante - NestJS con PostgreSQL, Drizzle ORM, JWT Auth, MinIO, Menu Digital y Categorías
license: UNLICENSED
compatibility: opencode
metadata:
  framework: nestjs
  orm: drizzle
  database: postgresql
  storage: minio
  features:
    - authentication
    - menu-management
    - category-management
  author: Pedro Obando
---

## Comandos del Proyecto

### Desarrollo

- `pnpm start:dev` - Iniciar servidor en modo watch
- `pnpm start:debug` - Iniciar con debugger
- `pnpm build` - Compilar proyecto
- `pnpm start:prod` - Iniciar en producción

### Calidad de Código (IMPORTANTE)

**SIEMPRE ejecutar después de hacer cambios:**

- `pnpm lint` - Ejecutar ESLint y corregir errores
- `pnpm format` - Formatear código con Prettier

### Base de Datos

- `pnpm db:generate` - Generar migraciones con Drizzle Kit
- `pnpm db:migrate` - Ejecutar migraciones en la base de datos

### Testing

- `pnpm test` - Ejecutar tests unitarios
- `pnpm test:watch` - Tests en modo watch
- `pnpm test:cov` - Tests con cobertura
- `pnpm test:e2e` - Tests end-to-end

### Docker (Infraestructura)

- `docker-compose up -d` - Iniciar PostgreSQL + MinIO + pgAdmin
- `docker-compose down` - Detener servicios
- `docker-compose down -v` - Detener y eliminar volúmenes (⚠️ borra datos)

## Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── decorators/          # @Auth(), @GetUser(), @RoleProtected()
│   ├── dto/                 # CreateUserDto, LoginUserDto, UpdateUserDto
│   ├── entities/            # Entidad User
│   ├── guards/              # UserRoleGuard
│   ├── interfaces/          # ValidRoles, JwtPayload, IUser
│   └── strategies/          # JWT Strategy
├── users/                   # Módulo de usuarios
├── menu-digital/            # Módulo de menú digital
│   ├── dto/                 # CreateMenuDigitalDto, UpdateMenuDigitalDto
│   ├── schema/              # Esquema Drizzle de menús
│   ├── inteface/            # Interfaces de menú
│   └── menu-digital.service.ts
├── menu-category/           # Módulo de categorías de menú
│   ├── dto/                 # CreateMenuCategoryDto, UpdateMenuCategoryDto
│   ├── schema/              # Esquema Drizzle de categorías
│   ├── inteface/            # Interfaces de categoría
│   └── menu-category.service.ts
├── database/                # Configuración de base de datos
├── common/                  # Utilidades compartidas
│   ├── adapter/             # BcryptAdapter
│   ├── decorators/          # Decoradores comunes
│   ├── dto/                 # PaginationDto
│   ├── interfaces/          # Interfaces comunes
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Funciones utilitarias
└── config/                  # Configuración de la aplicación
    ├── env.config.ts
    └── joi.validation.ts
```

## Endpoints Principales

### Autenticación

- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `PATCH /auth/change` - Actualizar usuario (requiere auth)

### Menú Digital (`/menudigital`)

- `POST /menudigital` - Crear menú (solo admin)
- `GET /menudigital` - Listar menús (paginado, público)
- `GET /menudigital/:term` - Buscar menú por término
- `PATCH /menudigital/:id` - Actualizar menú (solo admin)
- `DELETE /menudigital/:id` - Eliminar menú (solo admin)

### Categorías (`/category`)

- `POST /category` - Crear categoría (solo admin)
- `GET /category` - Listar categorías (paginado, público)
- `GET /category/:term` - Buscar categoría por término
- `PATCH /category/:id` - Actualizar categoría (solo admin)
- `DELETE /category/:id` - Eliminar categoría (solo admin)

## Configuración de Entorno

**IMPORTANTE:** Antes de iniciar, renombrar `example.env` a `.env`:

```bash
mv example.env .env
```

Variables críticas:

- `DATABASE_URL` - Conexión PostgreSQL (puerto 5444 para Docker)
- `JWT_SECRET` - Secreto para JWT (generar con `openssl rand -base64 32`)
- `JWT_EXPIRESIN` - Tiempo de expiración del token (ej: 3h)
- `MINIO_*` - Credenciales y configuración de MinIO

## Patrones de Código

### 1. Crear un nuevo módulo

```typescript
// src/{module}/{module}.module.ts
@Module({
  imports: [],
  controllers: [{Module}Controller],
  providers: [{Module}Service],
})
export class {Module}Module {}
```

### 2. Crear DTOs con validación

```typescript
// src/{module}/dto/create-{module}.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class Create{Module}Dto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(ValidRoles)
  role?: ValidRoles;
}
```

### 3. Proteger rutas con autenticación

```typescript
// Para cualquier usuario autenticado
@UseGuards(AuthGuard())
@Get('profile')
getProfile(@GetUser() user: User) {
  return user;
}

// Para rol específico (método antiguo)
@RoleProtected(ValidRoles.admin)
@UseGuards(AuthGuard(), UserRoleGuard)
@Get('admin-only')
adminOnly() {
  return { message: 'Solo administradores' };
}

// Para múltiples roles (recomendado)
@Auth(ValidRoles.admin, ValidRoles.participant)
@Get('multi-role')
multiRole() {
  return { message: 'Admin o participant' };
}
```

### 4. Usar el adaptador bcrypt

```typescript
// src/common/adapter/bcrypt.adapter.ts
import { BcryptAdapter } from '../common/adapter';

// Hash de contraseña
const hashedPassword = await BcryptAdapter.hash(password);

// Comparar contraseña
const isValid = await BcryptAdapter.compare(password, hashedPassword);
```

### 5. Usar paginación

```typescript
// src/common/dto/pagination.dto.ts
import { PaginationDto } from '../common/dto';

@Get()
findAll(@Query() paginationDto: PaginationDto) {
  return this.service.findAll(paginationDto);
}
```

### 6. Crear un módulo completo CRUD (ej: Menu Digital)

Patrón estándar para módulos CRUD:

```typescript
// src/menu-digital/menu-digital.controller.ts
@Controller('menudigital')
export class MenuDigitalController {
  constructor(private readonly menuDigitalService: MenuDigitalService) {}

  @Post()
  @Auth(ValidRoles.admin) // Solo admin puede crear
  create(@GetUser() user: IUser, @Body() createDto: CreateMenuDigitalDto) {
    return this.menuDigitalService.create(user, createDto);
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
    @Body() updateDto: UpdateMenuDigitalDto,
  ) {
    return this.menuDigitalService.update(user, id, updateDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.menuDigitalService.remove(id);
  }
}
```

## Reglas Importantes

1. **SIEMPRE ejecutar `pnpm lint` después de hacer cambios** antes de finalizar
2. **Usar DTOs** para validar entrada de datos con `class-validator`
3. **Proteger rutas sensibles** con `@Auth()` o `@UseGuards(AuthGuard())`
4. **Usar decoradores personalizados** para obtener usuario actual: `@GetUser()`
5. **Seguir estructura de carpetas**: Cada módulo debe tener su propia carpeta con controllers, services, dto, entities, etc.
6. **Variables de entorno**: Nunca hardcodear secrets, usar siempre `process.env`
7. **Docker**: Usar puerto 5444 para PostgreSQL, 9200/9201 para MinIO
8. **Migraciones**: Generar migraciones después de cambios en schema de Drizzle
9. **Módulos CRUD**: Seguir el patrón de `menu-digital` o `menu-category` para nuevos módulos
10. **Validación de UUID**: Usar `ParseUUIDPipe` para parámetros de tipo UUID
11. **Endpoints públicos vs privados**: Los GET de listado pueden ser públicos, POST/PATCH/DELETE requieren admin

## Servicios Docker

| Servicio      | Puerto | Descripción                  |
| ------------- | ------ | ---------------------------- |
| PostgreSQL    | 5444   | Base de datos principal      |
| MinIO API     | 9200   | API de almacenamiento S3     |
| MinIO Console | 9201   | Interfaz web de MinIO        |
| pgAdmin       | 8091   | Interfaz web para PostgreSQL |

## Stack Tecnológico

- **Framework:** NestJS v11
- **ORM:** Drizzle ORM
- **Base de Datos:** PostgreSQL 17
- **Autenticación:** Passport.js + JWT + bcrypt
- **Almacenamiento:** MinIO (S3 compatible)
- **Validación:** class-validator + Joi
- **Testing:** Jest
- **Linting:** ESLint + Prettier
- **Gestor de Paquetes:** pnpm
