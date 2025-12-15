# Permit Backend - Sistema RBAC

Backend completo para gestión de permisos basado en roles (RBAC), similar a permit.io. Construido con Elysia.js, Drizzle ORM, Neon PostgreSQL y desplegado en Vercel.

## 🚀 Características

- ✅ CRUD completo de usuarios, roles, recursos y permisos
- ✅ Asociación de permisos a roles
- ✅ Asignación de roles a usuarios
- ✅ Consulta de roles y permisos de usuarios
- ✅ Migraciones automáticas de base de datos
- ✅ Documentación Swagger integrada
- ✅ Optimizado para Vercel (una sola función serverless)

## 📁 Estructura del Proyecto

```
api/
  └── index.ts          # Punto de entrada principal (única función serverless)

src/
  ├── db.ts             # Configuración de la base de datos
  ├── migrations.ts     # Sistema de migraciones automáticas
  ├── users/            # Módulo de usuarios
  ├── roles/            # Módulo de roles
  ├── resources/        # Módulo de recursos
  ├── permissions/      # Módulo de permisos
  ├── role-permissions/ # Asociación roles-permisos
  └── user-roles/       # Asociación usuarios-roles

sql/                    # Scripts SQL de referencia
docs/                   # Documentación completa
```

## 🛠️ Tecnologías

- **Elysia.js** - Framework web TypeScript
- **Drizzle ORM** - ORM para TypeScript
- **Neon PostgreSQL** - Base de datos serverless
- **Vercel** - Plataforma de despliegue
- **Bun** - Runtime y gestor de paquetes

## 📦 Instalación

```bash
# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu DATABASE_URL
```

## 🚀 Desarrollo

```bash
# Ejecutar en modo desarrollo
bun run dev

# La API estará disponible en http://localhost:8000
# La documentación Swagger en http://localhost:8000/swagger
```

## 📚 Documentación

- **Guía completa de la API**: Ver [docs/API_RBAC_GUIDE.md](docs/API_RBAC_GUIDE.md)
- **Documentación OpenAPI**: Ver [docs/OPENAPI.md](docs/OPENAPI.md) - Especificación completa OpenAPI 3.0.3
- **Estructura del Proyecto**: Ver [docs/ESTRUCTURA_PROYECTO.md](docs/ESTRUCTURA_PROYECTO.md)
- **Scripts SQL de referencia**: Ver [sql/README.md](sql/README.md)
- **Documentación Swagger**: Disponible en `/swagger` cuando la app está corriendo

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con:

```env
DATABASE_URL=postgresql://user:password@host/database
API_KEY=tu-api-key-secreta-aqui
```

Para Neon, la URL es similar a:
```env
DATABASE_URL=postgresql://user:password@projectname.neon.tech/dbname?sslmode=require
```

**Importante:** La `API_KEY` debe coincidir con `PERMIT_API_KEY` en el frontend. Esta clave se usa para autenticar las requests del frontend al backend.

### Migraciones

El sistema ejecuta migraciones automáticamente al iniciar. Las tablas se crean automáticamente si no existen.

Para ejecutar migraciones manualmente con Drizzle Kit:

```bash
# Generar migraciones
bun drizzle-kit generate

# Ejecutar migraciones
bun drizzle-kit migrate

# Abrir Drizzle Studio
bun drizzle-kit studio
```

## 🌐 Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno `DATABASE_URL`
3. Vercel detectará automáticamente la configuración

**Nota:** El proyecto está optimizado para usar una sola función serverless, cumpliendo con el límite del plan Hobby de Vercel.

## 📖 Endpoints Principales

- `GET /` - Información de la API
- `GET /swagger` - Documentación Swagger
- `GET /users` - Listar usuarios
- `GET /roles` - Listar roles
- `GET /resources` - Listar recursos
- `GET /permissions` - Listar permisos
- `GET /user-roles/user/:userId` - Roles de un usuario
- `GET /user-roles/user/:userId/permissions` - Permisos de un usuario

Ver la [documentación completa](docs/API_RBAC_GUIDE.md) para todos los endpoints.

## 🗄️ Base de Datos

El sistema crea automáticamente las siguientes tablas:

- `users` - Usuarios del sistema
- `roles` - Roles disponibles
- `resources` - Recursos sobre los que se pueden tener permisos
- `permissions` - Permisos específicos sobre recursos
- `role_permissions` - Asociación entre roles y permisos
- `user_roles` - Asociación entre usuarios y roles

Ver [sql/](sql/) para scripts SQL de referencia.

## 📝 Licencia

Este proyecto es privado.
