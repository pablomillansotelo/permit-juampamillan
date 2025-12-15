# Guía de API - Sistema RBAC (Role-Based Access Control)

Esta API proporciona un sistema completo de gestión de permisos basado en roles (RBAC), similar a permit.io. Permite gestionar usuarios, roles, recursos, permisos y sus relaciones.

## Tabla de Contenidos

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Endpoints de Usuarios](#endpoints-de-usuarios)
3. [Endpoints de Roles](#endpoints-de-roles)
4. [Endpoints de Recursos](#endpoints-de-recursos)
5. [Endpoints de Permisos](#endpoints-de-permisos)
6. [Endpoints de Asociación Roles-Permisos](#endpoints-de-asociación-roles-permisos)
7. [Endpoints de Asignación Usuarios-Roles](#endpoints-de-asignación-usuarios-roles)
8. [Migraciones Automáticas](#migraciones-automáticas)
9. [Ejemplos de Uso](#ejemplos-de-uso)

## Arquitectura del Sistema

El sistema RBAC está compuesto por las siguientes entidades:

- **Usuarios**: Representan a los usuarios del sistema
- **Roles**: Representan roles que pueden tener los usuarios (ej: admin, editor, viewer)
- **Recursos**: Representan recursos del sistema sobre los que se pueden tener permisos (ej: posts, users, settings)
- **Permisos**: Representan acciones específicas sobre recursos (ej: read, write, delete)
- **Role-Permissions**: Tabla de asociación entre roles y permisos
- **User-Roles**: Tabla de asociación entre usuarios y roles

### Relaciones

```
Usuario ──(N:M)──> Roles ──(N:M)──> Permisos ──(N:1)──> Recursos
```

Un usuario puede tener múltiples roles, un rol puede tener múltiples permisos, y un permiso pertenece a un recurso específico.

## Endpoints de Usuarios

### GET `/users`
Obtiene todos los usuarios del sistema.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/users/:id`
Obtiene un usuario específico por su ID.

**Respuesta:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### POST `/users`
Crea un nuevo usuario.

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT `/users/:id`
Actualiza un usuario existente.

**Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```

### DELETE `/users/:id`
Elimina un usuario.

**Respuesta:**
```json
{
  "message": "Usuario eliminado exitosamente",
  "user": { ... }
}
```

## Endpoints de Roles

### GET `/roles`
Obtiene todos los roles del sistema.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "admin",
    "description": "Administrador del sistema",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/roles/:id`
Obtiene un rol específico por su ID.

### POST `/roles`
Crea un nuevo rol.

**Body:**
```json
{
  "name": "editor",
  "description": "Editor de contenido"
}
```

### PUT `/roles/:id`
Actualiza un rol existente.

**Body:**
```json
{
  "name": "senior-editor",
  "description": "Editor senior de contenido"
}
```

### DELETE `/roles/:id`
Elimina un rol.

## Endpoints de Recursos

### GET `/resources`
Obtiene todos los recursos del sistema.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "posts",
    "description": "Artículos del blog",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/resources/:id`
Obtiene un recurso específico por su ID.

### POST `/resources`
Crea un nuevo recurso.

**Body:**
```json
{
  "name": "users",
  "description": "Usuarios del sistema"
}
```

### PUT `/resources/:id`
Actualiza un recurso existente.

### DELETE `/resources/:id`
Elimina un recurso.

## Endpoints de Permisos

### GET `/permissions`
Obtiene todos los permisos del sistema con información del recurso asociado.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "read-posts",
    "action": "read",
    "resourceId": 1,
    "resourceName": "posts",
    "description": "Permite leer posts",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/permissions/:id`
Obtiene un permiso específico por su ID.

### GET `/permissions/resource/:resourceId`
Obtiene todos los permisos asociados a un recurso específico.

### POST `/permissions`
Crea un nuevo permiso para un recurso.

**Body:**
```json
{
  "name": "write-posts",
  "action": "write",
  "resourceId": 1,
  "description": "Permite crear y editar posts"
}
```

**Nota:** El `action` puede ser: `read`, `write`, `update`, `delete`, o cualquier acción personalizada.

### PUT `/permissions/:id`
Actualiza un permiso existente.

### DELETE `/permissions/:id`
Elimina un permiso.

## Endpoints de Asociación Roles-Permisos

### POST `/role-permissions`
Asigna un permiso a un rol.

**Body:**
```json
{
  "roleId": 1,
  "permissionId": 1
}
```

**Respuesta:**
```json
{
  "message": "Permiso asignado al rol exitosamente",
  "assignment": {
    "id": 1,
    "roleId": 1,
    "permissionId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE `/role-permissions/:roleId/:permissionId`
Remueve un permiso de un rol.

### GET `/role-permissions/role/:roleId`
Obtiene todos los permisos asignados a un rol específico.

**Respuesta:**
```json
[
  {
    "id": 1,
    "roleId": 1,
    "permissionId": 1,
    "permissionName": "read-posts",
    "permissionAction": "read",
    "resourceId": 1,
    "resourceName": "posts",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/role-permissions/permission/:permissionId`
Obtiene todos los roles que tienen un permiso específico.

## Endpoints de Asignación Usuarios-Roles

### POST `/user-roles`
Asigna un rol a un usuario.

**Body:**
```json
{
  "userId": 1,
  "roleId": 1
}
```

**Respuesta:**
```json
{
  "message": "Rol asignado al usuario exitosamente",
  "assignment": {
    "id": 1,
    "userId": 1,
    "roleId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE `/user-roles/:userId/:roleId`
Remueve un rol de un usuario.

### GET `/user-roles/user/:userId`
Obtiene todos los roles asignados a un usuario específico.

**Respuesta:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "roleId": 1,
    "roleName": "admin",
    "roleDescription": "Administrador del sistema",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/user-roles/user/:userId/permissions`
Obtiene todos los permisos de un usuario (a través de sus roles).

**Respuesta:**
```json
[
  {
    "permissionId": 1,
    "permissionName": "read-posts",
    "permissionAction": "read",
    "resourceId": 1,
    "resourceName": "posts",
    "roleId": 1,
    "roleName": "admin"
  }
]
```

**Nota:** Este endpoint consolida todos los permisos de todos los roles del usuario, eliminando duplicados.

### GET `/user-roles/role/:roleId`
Obtiene todos los usuarios que tienen un rol específico.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
api/
  └── index.ts          # Punto de entrada principal (única función serverless en Vercel)

src/
  ├── db.ts             # Configuración de la base de datos con Drizzle
  ├── migrations.ts     # Sistema de migraciones automáticas
  ├── users/            # Módulo de usuarios (schema, service, router, model)
  ├── roles/             # Módulo de roles (schema, service, router, model)
  ├── resources/         # Módulo de recursos (schema, service, router, model)
  ├── permissions/       # Módulo de permisos (schema, service, router, model)
  ├── role-permissions/  # Asociación roles-permisos (schema, service, router)
  └── user-roles/       # Asociación usuarios-roles (schema, service, router)

sql/                    # Scripts SQL de referencia
docs/                   # Documentación del proyecto
```

**Nota:** La estructura está optimizada para Vercel, donde solo `api/index.ts` se convierte en una función serverless, evitando el límite de funciones del plan Hobby.

## Migraciones Automáticas

El sistema ejecuta migraciones automáticamente al iniciar la aplicación. Si las tablas no existen en la base de datos, se crean automáticamente basándose en los schemas definidos con Drizzle ORM.

Las migraciones se ejecutan en el archivo `src/migrations.ts` y crean las siguientes tablas:

- `users`
- `roles`
- `resources`
- `permissions`
- `role_permissions`
- `user_roles`

También se crean índices para mejorar el rendimiento de las consultas.

Las migraciones se ejecutan automáticamente cuando la aplicación inicia, por lo que no necesitas ejecutar scripts SQL manualmente a menos que quieras hacerlo por referencia.

## Ejemplos de Uso

### Flujo Completo: Configurar Permisos para un Usuario

1. **Crear un recurso:**
```bash
POST /resources
{
  "name": "posts",
  "description": "Artículos del blog"
}
```

2. **Crear permisos para el recurso:**
```bash
POST /permissions
{
  "name": "read-posts",
  "action": "read",
  "resourceId": 1,
  "description": "Leer posts"
}

POST /permissions
{
  "name": "write-posts",
  "action": "write",
  "resourceId": 1,
  "description": "Crear y editar posts"
}
```

3. **Crear un rol:**
```bash
POST /roles
{
  "name": "editor",
  "description": "Editor de contenido"
}
```

4. **Asignar permisos al rol:**
```bash
POST /role-permissions
{
  "roleId": 1,
  "permissionId": 1
}

POST /role-permissions
{
  "roleId": 1,
  "permissionId": 2
}
```

5. **Asignar el rol a un usuario:**
```bash
POST /user-roles
{
  "userId": 1,
  "roleId": 1
}
```

6. **Consultar permisos del usuario:**
```bash
GET /user-roles/user/1/permissions
```

### Consultar Todos los Roles de un Usuario

```bash
GET /user-roles/user/1
```

### Consultar Todos los Permisos de un Rol

```bash
GET /role-permissions/role/1
```

## Variables de Entorno

Asegúrate de configurar la siguiente variable en tu archivo `.env.local`:

```
DATABASE_URL=postgresql://user:password@host/database
```

Para Neon, la URL es similar a:
```
DATABASE_URL=postgresql://user:password@projectname.neon.tech/dbname?sslmode=require
```

## Manejo de Errores

Todos los endpoints manejan errores y retornan mensajes descriptivos:

- **400**: Error de validación o conflicto de datos
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

**Ejemplo de error:**
```json
{
  "error": "El rol admin ya existe"
}
```

## Características

✅ CRUD completo de usuarios, roles, recursos y permisos
✅ Asociación de permisos a roles
✅ Asignación de roles a usuarios
✅ Consulta de roles y permisos de usuarios
✅ Validación de datos con Elysia
✅ Manejo de errores consistente
✅ Conexión a Neon PostgreSQL vía HTTP
✅ Migraciones automáticas con Drizzle ORM
✅ Documentación Swagger integrada en `/swagger`

## Notas

- Los nombres de roles y recursos deben ser únicos
- Los permisos se crean para recursos específicos
- Un usuario puede tener múltiples roles
- Un rol puede tener múltiples permisos
- Los permisos se heredan a través de los roles asignados al usuario
- Las eliminaciones en cascada están configuradas para mantener la integridad referencial

