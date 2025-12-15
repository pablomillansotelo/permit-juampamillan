# Permit - Sistema de Gestión RBAC

Sistema completo de gestión de permisos basado en roles (RBAC - Role-Based Access Control), similar a permit.io. Construido con tecnologías modernas y optimizado para despliegue en Vercel.

## 📋 Descripción

Permit es una solución completa para gestionar usuarios, roles, recursos y permisos en aplicaciones modernas. El sistema está dividido en dos partes principales:

- **Backend API** (`permit-backend`): API RESTful construida con Elysia.js que expone todos los endpoints necesarios para gestionar el sistema RBAC.
- **Frontend Dashboard** (`permit-frontend`): Interfaz de administración construida con Next.js 15 y Radix UI para gestionar visualmente el sistema.

## 🏗️ Arquitectura

```
permit-juampamillan/
├── permit-backend/     # API REST con Elysia.js
│   ├── api/           # Punto de entrada (Vercel serverless)
│   ├── src/           # Código fuente organizado por módulos
│   ├── docs/          # Documentación de la API
│   └── sql/           # Scripts SQL de referencia
│
└── permit-frontend/    # Dashboard Next.js + Radix UI
    ├── app/           # Aplicación Next.js (App Router)
    ├── components/    # Componentes UI (Radix + Shadcn)
    └── lib/           # Utilidades y configuración
```

## 🚀 Inicio Rápido

### Backend

```bash
cd permit-backend

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu DATABASE_URL

# Ejecutar en desarrollo
bun run dev

# La API estará en http://localhost:8000
# Documentación Swagger en http://localhost:8000/swagger
```

### Frontend

```bash
cd permit-frontend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Configurar POSTGRES_URL y variables de NextAuth

# Ejecutar en desarrollo
pnpm dev

# La aplicación estará en http://localhost:3000
```

## 🛠️ Stack Tecnológico

### Backend
- **Elysia.js** - Framework web TypeScript ultra-rápido
- **Drizzle ORM** - ORM type-safe para TypeScript
- **Neon PostgreSQL** - Base de datos serverless
- **Bun** - Runtime y gestor de paquetes
- **Vercel** - Plataforma de despliegue

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Radix UI** - Componentes primitivos accesibles
- **Shadcn UI** - Componentes construidos sobre Radix
- **Tailwind CSS** - Framework de estilos utility-first
- **NextAuth.js** - Autenticación
- **Vercel Analytics** - Análisis de uso

## 📚 Documentación

### Backend API

- **[Guía Completa de la API](permit-backend/docs/API_RBAC_GUIDE.md)** - Documentación detallada de todos los endpoints
- **[Documentación OpenAPI](permit-backend/docs/OPENAPI.md)** - Especificación OpenAPI 3.0.3 completa
- **[Estructura del Proyecto](permit-backend/docs/ESTRUCTURA_PROYECTO.md)** - Arquitectura y organización del código
- **Swagger UI** - Disponible en `/swagger` cuando el backend está corriendo

### Frontend

- **[Análisis del Frontend](permit-frontend/FRONTEND_ANALYSIS.md)** - Estructura y componentes de la plantilla
- **[README del Frontend](permit-frontend/README.md)** - Guía de inicio rápido

## 🔑 Características Principales

### Backend
- ✅ CRUD completo de usuarios, roles, recursos y permisos
- ✅ Asociación de permisos a roles
- ✅ Asignación de roles a usuarios
- ✅ Consulta de roles y permisos de usuarios
- ✅ Migraciones automáticas de base de datos
- ✅ Documentación Swagger integrada
- ✅ Optimizado para Vercel (una sola función serverless)
- ✅ Validación de datos con Elysia
- ✅ Type-safe con TypeScript

### Frontend
- ✅ Dashboard administrativo moderno
- ✅ Componentes UI accesibles (Radix UI)
- ✅ Diseño responsive
- ✅ Autenticación con NextAuth
- ✅ Tablas interactivas con paginación
- ✅ Búsqueda y filtrado
- ✅ Tema claro/oscuro (preparado)

## 📖 Endpoints Principales

### Usuarios
- `GET /users/` - Listar todos los usuarios
- `POST /users/` - Crear nuevo usuario
- `GET /users/{id}` - Obtener usuario por ID
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario
- `POST /users/sign-in` - Autenticación

### Roles
- `GET /roles/` - Listar todos los roles
- `POST /roles/` - Crear nuevo rol
- `GET /roles/{id}` - Obtener rol por ID
- `PUT /roles/{id}` - Actualizar rol
- `DELETE /roles/{id}` - Eliminar rol

### Recursos
- `GET /resources/` - Listar todos los recursos
- `POST /resources/` - Crear nuevo recurso
- `GET /resources/{id}` - Obtener recurso por ID
- `PUT /resources/{id}` - Actualizar recurso
- `DELETE /resources/{id}` - Eliminar recurso

### Permisos
- `GET /permissions/` - Listar todos los permisos
- `POST /permissions/` - Crear nuevo permiso
- `GET /permissions/{id}` - Obtener permiso por ID
- `PUT /permissions/{id}` - Actualizar permiso
- `DELETE /permissions/{id}` - Eliminar permiso
- `GET /permissions/resource/{resourceId}` - Permisos de un recurso

### Asociaciones
- `POST /role-permissions/` - Asignar permiso a rol
- `DELETE /role-permissions/{roleId}/{permissionId}` - Remover permiso de rol
- `GET /role-permissions/role/{roleId}` - Permisos de un rol
- `POST /user-roles/` - Asignar rol a usuario
- `DELETE /user-roles/{userId}/{roleId}` - Remover rol de usuario
- `GET /user-roles/user/{userId}` - Roles de un usuario
- `GET /user-roles/user/{userId}/permissions` - Permisos de un usuario

Ver la [documentación completa de la API](permit-backend/docs/API_RBAC_GUIDE.md) para más detalles.

## 🗄️ Base de Datos

El sistema utiliza PostgreSQL (Neon) con las siguientes tablas:

- `users` - Usuarios del sistema
- `roles` - Roles disponibles
- `resources` - Recursos sobre los que se pueden tener permisos
- `permissions` - Permisos específicos sobre recursos
- `role_permissions` - Asociación entre roles y permisos (many-to-many)
- `user_roles` - Asociación entre usuarios y roles (many-to-many)

Las migraciones se ejecutan automáticamente al iniciar la aplicación.

## 🔧 Configuración

### Variables de Entorno - Backend

```env
DATABASE_URL=postgresql://user:password@host/database
```

### Variables de Entorno - Frontend

```env
POSTGRES_URL=postgresql://user:password@host/database
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key
```

## 🌐 Despliegue

### Backend en Vercel

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno `DATABASE_URL`
3. Vercel detectará automáticamente la configuración

### Frontend en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno necesarias
3. Vercel detectará automáticamente Next.js

**Nota:** El backend está optimizado para usar una sola función serverless, cumpliendo con el límite del plan Hobby de Vercel.

## 📝 Licencia

Este proyecto es privado.

## 🤝 Contribución

Este es un proyecto privado. Para sugerencias o mejoras, contacta al equipo de desarrollo.

## 📞 Soporte

Para preguntas o problemas, revisa la documentación en las carpetas `docs/` de cada proyecto o abre un issue en el repositorio.

