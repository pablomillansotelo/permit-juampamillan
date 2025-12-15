# Estructura del Proyecto

Este documento describe la estructura del proyecto Permit Backend y cómo está organizado.

## 📂 Estructura de Directorios

```
permit-backend/
├── api/                    # Punto de entrada para Vercel
│   └── index.ts           # Única función serverless (exporta Elysia app)
│
├── src/                    # Código fuente del proyecto
│   ├── db.ts              # Configuración de Drizzle ORM
│   ├── migrations.ts      # Sistema de migraciones automáticas
│   │
│   ├── users/             # Módulo de usuarios
│   │   ├── schema.ts      # Schema de Drizzle (tabla users)
│   │   ├── service.ts     # Lógica de negocio
│   │   ├── router.ts      # Rutas de Elysia
│   │   └── model.ts       # Modelos de validación Elysia
│   │
│   ├── roles/             # Módulo de roles
│   │   ├── schema.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── model.ts
│   │
│   ├── resources/         # Módulo de recursos
│   │   ├── schema.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── model.ts
│   │
│   ├── permissions/       # Módulo de permisos
│   │   ├── schema.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── model.ts
│   │
│   ├── role-permissions/  # Asociación roles-permisos
│   │   ├── schema.ts
│   │   ├── service.ts
│   │   └── router.ts
│   │
│   └── user-roles/        # Asociación usuarios-roles
│       ├── schema.ts
│       ├── service.ts
│       └── router.ts
│
├── sql/                   # Scripts SQL de referencia
│   ├── 01_create_tables.sql
│   ├── 02_create_indexes.sql
│   ├── 03_sample_data.sql
│   ├── 04_queries_examples.sql
│   └── README.md
│
├── docs/                  # Documentación
│   ├── API_RBAC_GUIDE.md
│   └── ESTRUCTURA_PROYECTO.md
│
├── drizzle/               # Migraciones generadas por Drizzle Kit
├── vercel.json            # Configuración de Vercel
├── drizzle.config.ts      # Configuración de Drizzle Kit
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Organización por Capas

### 1. **Schemas** (`schema.ts`)
Definen la estructura de las tablas de base de datos usando Drizzle ORM.

```typescript
// Ejemplo: src/users/schema.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 2. **Services** (`service.ts`)
Contienen la lógica de negocio y las operaciones de base de datos.

```typescript
// Ejemplo: src/users/service.ts
export class UsersService {
  static async getAllUsers() { ... }
  static async getUserById(id: number) { ... }
  static async createUser(data: CreateUserInput) { ... }
}
```

### 3. **Routers** (`router.ts`)
Definen las rutas HTTP y conectan los endpoints con los servicios.

```typescript
// Ejemplo: src/users/router.ts
export const users = new Elysia({ prefix: '/users' })
  .get('/', async () => {
    return await UsersService.getAllUsers()
  })
  .compile()
```

### 4. **Models** (`model.ts`)
Definen los esquemas de validación para Elysia (body, response, etc.).

```typescript
// Ejemplo: src/users/model.ts
export const UsersModel = {
  createBody: t.Object({
    name: t.String(),
    email: t.String({ format: 'email' })
  }),
  userResponse: t.Object({ ... })
}
```

## 🔄 Flujo de Datos

```
Cliente HTTP
    ↓
api/index.ts (Elysia App)
    ↓
Router (src/*/router.ts)
    ↓
Service (src/*/service.ts)
    ↓
Drizzle ORM (src/db.ts)
    ↓
Base de Datos PostgreSQL (Neon)
```

## 🚀 Optimización para Vercel

El proyecto está estructurado para optimizar el despliegue en Vercel:

1. **Solo `api/index.ts` es una función serverless**
   - Todos los módulos están en `src/` y se importan como dependencias
   - Esto evita el límite de 12 funciones del plan Hobby

2. **Migraciones automáticas**
   - Se ejecutan al iniciar la aplicación
   - No requieren configuración adicional en Vercel

3. **Configuración mínima**
   - `vercel.json` solo necesita el rewrite rule
   - No se requieren build commands adicionales

## 📦 Módulos del Sistema

### Módulos Principales (CRUD)

1. **Users** (`src/users/`)
   - Gestión de usuarios del sistema
   - Endpoints: `/users`

2. **Roles** (`src/roles/`)
   - Gestión de roles
   - Endpoints: `/roles`

3. **Resources** (`src/resources/`)
   - Gestión de recursos
   - Endpoints: `/resources`

4. **Permissions** (`src/permissions/`)
   - Gestión de permisos
   - Endpoints: `/permissions`

### Módulos de Relación

5. **Role-Permissions** (`src/role-permissions/`)
   - Asociar permisos a roles
   - Endpoints: `/role-permissions`

6. **User-Roles** (`src/user-roles/`)
   - Asignar roles a usuarios
   - Consultar roles y permisos de usuarios
   - Endpoints: `/user-roles`

## 🔧 Archivos de Configuración

### `vercel.json`
Configuración de Vercel para routing:
- Rewrite todas las rutas a `/api`
- Solo `api/index.ts` se convierte en función serverless

### `drizzle.config.ts`
Configuración de Drizzle Kit:
- Busca schemas en `src/**/schema.ts`
- Genera migraciones en `drizzle/`

### `package.json`
- `module: "api/index.ts"` - Punto de entrada
- Scripts para desarrollo y migraciones

## 📝 Convenciones

1. **Nombres de archivos**: kebab-case (ej: `user-roles`)
2. **Nombres de clases**: PascalCase (ej: `UsersService`)
3. **Nombres de variables**: camelCase (ej: `userRoles`)
4. **Nombres de tablas**: snake_case (ej: `user_roles`)
5. **Imports**: Rutas relativas desde `src/`

## 🚀 Agregar un Nuevo Módulo

Para agregar un nuevo módulo al sistema:

1. Crear directorio en `src/nuevo-modulo/`
2. Crear `schema.ts` con la tabla
3. Crear `service.ts` con la lógica
4. Crear `router.ts` con las rutas
5. Crear `model.ts` con validaciones (opcional)
6. Importar y usar el router en `api/index.ts`

Ejemplo:
```typescript
// api/index.ts
import { nuevoModulo } from '../src/nuevo-modulo/router.js'

export default new Elysia()
  .use(nuevoModulo)
  .compile()
```

## 🔍 Búsqueda de Archivos

- **Schemas**: `src/**/schema.ts`
- **Services**: `src/**/service.ts`
- **Routers**: `src/**/router.ts`
- **Models**: `src/**/model.ts`

