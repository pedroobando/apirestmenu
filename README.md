<div align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
  <h1>API Restaurante</h1>
  <p>API RESTful para gestión de restaurante con autenticación JWT y control de roles</p>
</div>

---

## Características Principales

- Autenticación y autorización con JWT
- Control de roles (admin, participant)
- Gestión de usuarios
- Base de datos PostgreSQL con Drizzle ORM
- Almacenamiento de archivos con MinIO (S3)
- Validación de datos con class-validator
- Configuración centralizada con variables de entorno

---

## Stack Tecnológico

| Tecnología                | Descripción                             |
| ------------------------- | --------------------------------------- |
| **NestJS v11**            | Framework Node.js progresivo            |
| **PostgreSQL**            | Base de datos relacional                |
| **Drizzle ORM**           | ORM para TypeScript                     |
| **Passport.js + JWT**     | Autenticación y autorización            |
| **bcrypt**                | Hash de contraseñas                     |
| **MinIO**                 | Almacenamiento de objetos compatible S3 |
| **Joi + class-validator** | Validación de esquemas y DTOs           |
| **pnpm**                  | Gestor de paquetes                      |

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) 14+ (o Docker)
- [MinIO](https://min.io/) (opcional, para almacenamiento de archivos)
- [pnpm](https://pnpm.io/) (recomendado)
- [Docker](https://www.docker.com/) y Docker Compose (opcional, para infraestructura)

---

## Despliegue con Docker

El proyecto incluye un archivo `docker-compose.yaml` que configura toda la infraestructura necesaria:

### Servicios incluidos

| Servicio       | Imagen             | Puerto Externo               | Descripción                  |
| -------------- | ------------------ | ---------------------------- | ---------------------------- |
| **PostgreSQL** | postgres:17-alpine | `5444` → 5432                | Base de datos principal      |
| **MinIO**      | minio/minio        | `9200` → 9000, `9201` → 9001 | Almacenamiento de objetos S3 |
| **pgAdmin**    | elestio/pgadmin    | `8091` → 80                  | Interfaz web para PostgreSQL |

### Pasos para iniciar con Docker

**1. Renombrar el archivo de configuración**

```bash
mv example.env .env
```

**2. Configurar las variables en `.env`**

Edita el archivo `.env` con los valores para Docker:

```env
# Database (para conexión interna Docker)
DATABASE_URL=postgresql://restadmin:123456789@localhost:5444/restaurant

# MinIO
MINIO_ROOT_USER=admin@gmail.com
MINIO_ROOT_PASSWORD=123456789
MINIO_CONTAINER=rest-minio
MINIO_ACCESS_KEY=tu-access-key
MINIO_SECRET_KEY=tu-secret-key
MINIO_ENDPOINT=localhost
MINIO_PORT=9200
MINIO_USE_SSL=false
```

**3. Iniciar los servicios**

```bash
docker-compose up -d
```

**4. Verificar que los servicios estén corriendo**

- PostgreSQL: `docker logs rest-pg`
- MinIO: Accede a http://localhost:9201 (consola web)
- pgAdmin: Accede a http://localhost:8091 (email: admin@gmail.com, pass: 1234)

**5. Detener los servicios**

```bash
docker-compose down
```

Para detener y eliminar volúmenes (⚠️ borra datos):

```bash
docker-compose down -v
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd apirestmenu
```

### 2. Configurar variables de entorno

**IMPORTANTE:** El proyecto incluye un archivo `example.env` con todas las variables necesarias. Debes renombrarlo a `.env`:

```bash
# Renombrar el archivo de ejemplo
mv example.env .env
```

Luego edita el archivo `.env` y configura los valores según tu entorno:

```env
# Token de administrador
ADMIN_API_TOKEN=tu-token-seguro

# Configuración JWT (generar con: openssl rand -base64 32)
JWT_SECRET=tu-secreto-jwt
JWT_EXPIRESIN=3h

# Base de datos PostgreSQL
DB_USER=restadmin
DB_PASSWORD=123456789
DB_NAME=restaurant
CONTAINER_NAMEDB=rest-pg
DATABASE_URL=postgresql://restadmin:123456789@localhost:5444/restaurant

# MinIO Root Credentials (para administración)
MINIO_ROOT_USER=admin@gmail.com
MINIO_ROOT_PASSWORD=123456789
MINIO_CONTAINER=rest-minio

# MinIO Application Credentials (para la app)
MINIO_ACCESS_KEY=tu-access-key
MINIO_SECRET_KEY=tu-secret-key
MINIO_ENDPOINT=bucket
MINIO_PORT=9000
MINIO_USE_SSL=false
```

### 3. Instalar dependencias

```bash
pnpm install
```

### 4. Ejecutar migraciones de base de datos

```bash
# Generar migraciones
pnpm db:generate

# Ejecutar migraciones
pnpm db:migrate
```

---

## Scripts Disponibles

```bash
# Desarrollo
pnpm start:dev          # Iniciar en modo watch
pnpm start:debug        # Iniciar con debugger

# Producción
pnpm build              # Compilar proyecto
pnpm start:prod         # Iniciar en producción

# Base de datos
pnpm db:generate        # Generar migraciones Drizzle
pnpm db:migrate         # Ejecutar migraciones

# Calidad de código
pnpm lint               # Ejecutar ESLint
pnpm format             # Formatear con Prettier

# Testing
pnpm test               # Ejecutar tests
pnpm test:watch         # Tests en modo watch
pnpm test:cov           # Tests con cobertura
pnpm test:e2e           # Tests end-to-end
```

---

## Endpoints de la API

### Base URL

```
http://localhost:3000/api
```

### Autenticación

| Método | Endpoint         | Descripción                        | Auth |
| ------ | ---------------- | ---------------------------------- | ---- |
| POST   | `/auth/login`    | Iniciar sesión                     | ❌   |
| POST   | `/auth/register` | Registrar nuevo usuario            | ❌   |
| PATCH  | `/auth/change`   | Actualizar datos del usuario       | ✅   |
| GET    | `/auth/private2` | Ruta protegida (solo admin)        | ✅👤 |
| GET    | `/auth/private3` | Ruta protegida (admin/participant) | ✅👤 |

### Usuarios

| Método | Endpoint | Descripción               | Auth |
| ------ | -------- | ------------------------- | ---- |
| GET    | `/users` | Listar todos los usuarios | ✅   |

> **Leyenda:** ✅ Requiere autenticación | 👤 Requiere rol específico

---

## Estructura del Proyecto

```
apirestmenu/
├── src/
│   ├── auth/              # Módulo de autenticación
│   │   ├── decorators/    # Decoradores personalizados
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── entities/      # Entidades de usuario
│   │   ├── guards/        # Guards de autorización
│   │   ├── interfaces/    # Interfaces TypeScript
│   │   └── strategies/    # Estrategias Passport
│   ├── users/             # Módulo de usuarios
│   ├── database/          # Configuración de base de datos
│   ├── common/            # Utilidades y helpers compartidos
│   │   ├── adapter/       # Adaptadores (bcrypt, etc.)
│   │   ├── decorators/    # Decoradores comunes
│   │   ├── dto/           # DTOs compartidos
│   │   ├── interfaces/    # Interfaces comunes
│   │   ├── types/         # Tipos TypeScript
│   │   └── utils/         # Funciones utilitarias
│   ├── config/            # Configuración de la aplicación
│   ├── app.module.ts      # Módulo raíz
│   └── main.ts            # Punto de entrada
├── drizzle/               # Migraciones de base de datos
├── public/                # Archivos estáticos
├── .env                   # Variables de entorno
├── drizzle.config.ts      # Configuración Drizzle
└── package.json
```

---

## Roles y Permisos

La API implementa un sistema de control de acceso basado en roles (RBAC):

- **admin**: Acceso total a todas las rutas
- **participant**: Acceso limitado a rutas específicas
- **user**: Rol por defecto, acceso básico

### Uso de decoradores de autorización

```typescript
// Ruta protegida para cualquier usuario autenticado
@UseGuards(AuthGuard())
@Get('profile')
getProfile(@GetUser() user: User) {
  return user;
}

// Ruta protegida para rol específico
@RoleProtected(ValidRoles.admin)
@UseGuards(AuthGuard(), UserRoleGuard)
@Get('admin-only')
adminOnly() {
  return { message: 'Solo administradores' };
}

// Decorador compuesto (más limpio)
@Auth(ValidRoles.admin, ValidRoles.participant)
@Get('multi-role')
multiRole() {
  return { message: 'Admin o participant' };
}
```

---

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Licencia

Este proyecto está licenciado bajo la licencia [MIT](LICENSE).

---

<div align="center">
  <p>Desarrollado con ❤️ usando <a href="http://nestjs.com">NestJS</a></p>
</div>
