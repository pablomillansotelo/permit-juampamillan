# Documentación OpenAPI - Permit Backend API

Esta es la especificación completa de la API en formato OpenAPI 3.0.3. Puedes usar esta documentación para generar clientes, probar endpoints o integrar con herramientas de documentación.

## Información General

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Permit Backend API",
    "description": "API para gestión de permisos RBAC (Role-Based Access Control)",
    "version": "1.0.0"
  }
}
```

## Tags

La API está organizada en los siguientes grupos:

- **users** - Operaciones de usuarios
- **roles** - Operaciones de roles
- **resources** - Operaciones de recursos
- **permissions** - Operaciones de permisos
- **role-permissions** - Asociación de permisos a roles
- **user-roles** - Asignación de roles a usuarios

## Endpoints

### Endpoints Generales

#### `GET /`
Información básica de la API.

**Respuesta:**
```json
{
  "message": "Permit Backend API",
  "version": "1.0.0",
  "endpoints": {
    "users": "/users",
    "roles": "/roles",
    "resources": "/resources",
    "permissions": "/permissions",
    "rolePermissions": "/role-permissions",
    "userRoles": "/user-roles",
    "docs": "/swagger"
  }
}
```

#### `GET /db`
Verifica la conexión a la base de datos.

**Respuesta:**
```json
{
  "message": "Conectado a Neon vía HTTP con Elysia.js 😎",
  "fecha": "2024-01-01T00:00:00.000Z"
}
```

---

## Usuarios

### `GET /users/`
Obtiene todos los usuarios del sistema.

**Tags:** `users`

**Respuesta 200:**
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

**Esquema de Respuesta:**
- `id` (number, required): ID del usuario
- `name` (string, required): Nombre del usuario
- `email` (string, required): Correo electrónico del usuario
- `createdAt` (string|Date, required): Fecha de creación

---

### `POST /users/`
Crea un nuevo usuario.

**Tags:** `users`

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Validaciones:**
- `name` (string, required): Nombre del usuario (minLength: 1, maxLength: 255)
- `email` (string, required): Correo electrónico válido (format: email)

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `GET /users/{id}`
Obtiene un usuario por su ID.

**Tags:** `users`

**Parámetros:**
- `id` (path, string, required): ID del usuario

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `PUT /users/{id}`
Actualiza un usuario existente.

**Tags:** `users`

**Parámetros:**
- `id` (path, string, required): ID del usuario

**Request Body:**
```json
{
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com"
}
```

**Validaciones:**
- `name` (string, optional): Nombre del usuario (minLength: 1, maxLength: 255)
- `email` (string, optional): Correo electrónico válido (format: email)

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `DELETE /users/{id}`
Elimina un usuario.

**Tags:** `users`

**Parámetros:**
- `id` (path, string, required): ID del usuario

**Respuesta 200:**
```json
{
  "message": "Usuario eliminado correctamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### `POST /users/sign-in`
Autentica un usuario.

**Tags:** `users`

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**
- `email` (string, required): Correo electrónico válido (format: email)
- `password` (string, required): Contraseña del usuario

**Respuesta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

## Roles

### `GET /roles/`
Obtiene todos los roles del sistema.

**Tags:** `roles`

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "name": "Administrador",
    "description": "Rol con todos los permisos",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Esquema de Respuesta:**
- `id` (number, required): ID del rol
- `name` (string, required): Nombre del rol
- `description` (string|null, required): Descripción del rol
- `createdAt` (string|Date, required): Fecha de creación
- `updatedAt` (string|Date, required): Fecha de actualización

---

### `POST /roles/`
Crea un nuevo rol.

**Tags:** `roles`

**Request Body:**
```json
{
  "name": "Editor",
  "description": "Puede editar contenido"
}
```

**Validaciones:**
- `name` (string, required): Nombre del rol (minLength: 1, maxLength: 255)
- `description` (string, optional): Descripción del rol (maxLength: 500)

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "Editor",
  "description": "Puede editar contenido",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `GET /roles/{id}`
Obtiene un rol por su ID.

**Tags:** `roles`

**Parámetros:**
- `id` (path, string, required): ID del rol

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "Editor",
  "description": "Puede editar contenido",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `PUT /roles/{id}`
Actualiza un rol existente.

**Tags:** `roles`

**Parámetros:**
- `id` (path, string, required): ID del rol

**Request Body:**
```json
{
  "name": "Editor Actualizado",
  "description": "Nueva descripción"
}
```

**Validaciones:**
- `name` (string, optional): Nombre del rol (minLength: 1, maxLength: 255)
- `description` (string, optional): Descripción del rol (maxLength: 500)

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "Editor Actualizado",
  "description": "Nueva descripción",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `DELETE /roles/{id}`
Elimina un rol.

**Tags:** `roles`

**Parámetros:**
- `id` (path, string, required): ID del rol

**Respuesta 200:**
```json
{
  "message": "Rol eliminado correctamente",
  "role": {
    "id": 1,
    "name": "Editor",
    "description": "Puede editar contenido",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Recursos

### `GET /resources/`
Obtiene todos los recursos del sistema.

**Tags:** `resources`

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "name": "posts",
    "description": "Recurso de publicaciones",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Esquema de Respuesta:**
- `id` (number, required): ID del recurso
- `name` (string, required): Nombre del recurso
- `description` (string|null, required): Descripción del recurso
- `createdAt` (string|Date, required): Fecha de creación
- `updatedAt` (string|Date, required): Fecha de actualización

---

### `POST /resources/`
Crea un nuevo recurso.

**Tags:** `resources`

**Request Body:**
```json
{
  "name": "users",
  "description": "Recurso de usuarios"
}
```

**Validaciones:**
- `name` (string, required): Nombre del recurso (minLength: 1, maxLength: 255)
- `description` (string, optional): Descripción del recurso (maxLength: 500)

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "users",
  "description": "Recurso de usuarios",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `GET /resources/{id}`
Obtiene un recurso por su ID.

**Tags:** `resources`

**Parámetros:**
- `id` (path, string, required): ID del recurso

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "users",
  "description": "Recurso de usuarios",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `PUT /resources/{id}`
Actualiza un recurso existente.

**Tags:** `resources`

**Parámetros:**
- `id` (path, string, required): ID del recurso

**Request Body:**
```json
{
  "name": "users_updated",
  "description": "Descripción actualizada"
}
```

**Validaciones:**
- `name` (string, optional): Nombre del recurso (minLength: 1, maxLength: 255)
- `description` (string, optional): Descripción del recurso (maxLength: 500)

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "users_updated",
  "description": "Descripción actualizada",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `DELETE /resources/{id}`
Elimina un recurso.

**Tags:** `resources`

**Parámetros:**
- `id` (path, string, required): ID del recurso

**Respuesta 200:**
```json
{
  "message": "Recurso eliminado correctamente",
  "resource": {
    "id": 1,
    "name": "users",
    "description": "Recurso de usuarios",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Permisos

### `GET /permissions/`
Obtiene todos los permisos del sistema.

**Tags:** `permissions`

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "name": "read_posts",
    "action": "read",
    "resourceId": 1,
    "resourceName": "posts",
    "description": "Permiso para leer publicaciones",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Esquema de Respuesta:**
- `id` (number, required): ID del permiso
- `name` (string, required): Nombre del permiso
- `action` (string, required): Acción del permiso (read, write, delete, etc.)
- `resourceId` (number, required): ID del recurso
- `resourceName` (string|null, required): Nombre del recurso
- `description` (string|null, required): Descripción del permiso
- `createdAt` (string|Date, required): Fecha de creación
- `updatedAt` (string|Date, required): Fecha de actualización

---

### `POST /permissions/`
Crea un nuevo permiso.

**Tags:** `permissions`

**Request Body:**
```json
{
  "name": "write_posts",
  "action": "write",
  "resourceId": 1,
  "description": "Permiso para escribir publicaciones"
}
```

**Validaciones:**
- `name` (string, required): Nombre del permiso (minLength: 1, maxLength: 255)
- `action` (string, required): Acción del permiso (minLength: 1, maxLength: 50)
- `resourceId` (number, required): ID del recurso al que pertenece el permiso
- `description` (string, optional): Descripción del permiso (maxLength: 500)

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "write_posts",
  "action": "write",
  "resourceId": 1,
  "resourceName": "posts",
  "description": "Permiso para escribir publicaciones",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `GET /permissions/{id}`
Obtiene un permiso por su ID.

**Tags:** `permissions`

**Parámetros:**
- `id` (path, string, required): ID del permiso

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "write_posts",
  "action": "write",
  "resourceId": 1,
  "resourceName": "posts",
  "description": "Permiso para escribir publicaciones",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `PUT /permissions/{id}`
Actualiza un permiso existente.

**Tags:** `permissions`

**Parámetros:**
- `id` (path, string, required): ID del permiso

**Request Body:**
```json
{
  "name": "write_posts_updated",
  "action": "write",
  "resourceId": 1,
  "description": "Descripción actualizada"
}
```

**Validaciones:**
- `name` (string, optional): Nombre del permiso (minLength: 1, maxLength: 255)
- `action` (string, optional): Acción del permiso (minLength: 1, maxLength: 50)
- `resourceId` (number, optional): ID del recurso
- `description` (string, optional): Descripción del permiso (maxLength: 500)

**Respuesta 200:**
```json
{
  "id": 1,
  "name": "write_posts_updated",
  "action": "write",
  "resourceId": 1,
  "resourceName": "posts",
  "description": "Descripción actualizada",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `DELETE /permissions/{id}`
Elimina un permiso.

**Tags:** `permissions`

**Parámetros:**
- `id` (path, string, required): ID del permiso

**Respuesta 200:**
```json
{
  "message": "Permiso eliminado correctamente",
  "permission": {
    "id": 1,
    "name": "write_posts",
    "action": "write",
    "resourceId": 1,
    "resourceName": "posts",
    "description": "Permiso para escribir publicaciones",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### `GET /permissions/resource/{resourceId}`
Obtiene todos los permisos de un recurso específico.

**Tags:** `permissions`

**Parámetros:**
- `resourceId` (path, string, required): ID del recurso

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "name": "read_posts",
    "action": "read",
    "resourceId": 1,
    "resourceName": "posts",
    "description": "Permiso para leer publicaciones",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Asociación Roles-Permisos

### `POST /role-permissions/`
Asigna un permiso a un rol.

**Tags:** `role-permissions`

**Request Body:**
```json
{
  "roleId": 1,
  "permissionId": 1
}
```

**Validaciones:**
- `roleId` (number, required): ID del rol
- `permissionId` (number, required): ID del permiso

**Respuesta 200:**
```json
{
  "message": "Permiso asignado al rol correctamente",
  "assignment": {
    "id": 1,
    "roleId": 1,
    "permissionId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### `DELETE /role-permissions/{roleId}/{permissionId}`
Remueve un permiso de un rol.

**Tags:** `role-permissions`

**Parámetros:**
- `roleId` (path, string, required): ID del rol
- `permissionId` (path, string, required): ID del permiso

**Respuesta 200:**
```json
{
  "message": "Permiso removido del rol correctamente",
  "assignment": {
    "id": 1,
    "roleId": 1,
    "permissionId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### `GET /role-permissions/role/{roleId}`
Obtiene todos los permisos asignados a un rol.

**Tags:** `role-permissions`

**Parámetros:**
- `roleId` (path, string, required): ID del rol

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "roleId": 1,
    "permissionId": 1,
    "permissionName": "read_posts",
    "permissionAction": "read",
    "resourceId": 1,
    "resourceName": "posts",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /role-permissions/permission/{permissionId}`
Obtiene todos los roles que tienen un permiso específico.

**Tags:** `role-permissions`

**Parámetros:**
- `permissionId` (path, string, required): ID del permiso

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "roleId": 1,
    "roleName": "Administrador",
    "permissionId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Asignación Usuarios-Roles

### `POST /user-roles/`
Asigna un rol a un usuario.

**Tags:** `user-roles`

**Request Body:**
```json
{
  "userId": 1,
  "roleId": 1
}
```

**Validaciones:**
- `userId` (number, required): ID del usuario
- `roleId` (number, required): ID del rol

**Respuesta 200:**
```json
{
  "message": "Rol asignado al usuario correctamente",
  "assignment": {
    "id": 1,
    "userId": 1,
    "roleId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### `DELETE /user-roles/{userId}/{roleId}`
Remueve un rol de un usuario.

**Tags:** `user-roles`

**Parámetros:**
- `userId` (path, string, required): ID del usuario
- `roleId` (path, string, required): ID del rol

**Respuesta 200:**
```json
{
  "message": "Rol removido del usuario correctamente",
  "assignment": {
    "id": 1,
    "userId": 1,
    "roleId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### `GET /user-roles/user/{userId}`
Obtiene todos los roles asignados a un usuario.

**Tags:** `user-roles`

**Parámetros:**
- `userId` (path, string, required): ID del usuario

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "roleId": 1,
    "roleName": "Administrador",
    "roleDescription": "Rol con todos los permisos",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /user-roles/user/{userId}/permissions`
Obtiene todos los permisos de un usuario (a través de sus roles).

**Tags:** `user-roles`

**Parámetros:**
- `userId` (path, string, required): ID del usuario

**Respuesta 200:**
```json
[
  {
    "permissionId": 1,
    "permissionName": "read_posts",
    "permissionAction": "read",
    "resourceId": 1,
    "resourceName": "posts",
    "roleId": 1,
    "roleName": "Administrador"
  }
]
```

---

### `GET /user-roles/role/{roleId}`
Obtiene todos los usuarios que tienen un rol específico.

**Tags:** `user-roles`

**Parámetros:**
- `roleId` (path, string, required): ID del rol

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "userName": "Juan Pérez",
    "userEmail": "juan@example.com",
    "roleId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Códigos de Estado HTTP

- `200 OK` - La solicitud fue exitosa
- `400 Bad Request` - Error en la validación de datos
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Formato de Fechas

Las fechas se devuelven en formato ISO 8601:
```
2024-01-01T00:00:00.000Z
```

## Notas Importantes

1. **Validación**: Todos los endpoints validan los datos de entrada según las reglas especificadas.
2. **Relaciones**: Al eliminar una entidad, se deben manejar las relaciones (cascadas o restricciones).
3. **Autenticación**: El endpoint `/users/sign-in` devuelve un token JWT que debería usarse en headers de autenticación (aunque actualmente no está implementado en todos los endpoints).
4. **Paginación**: Los endpoints de listado actualmente no implementan paginación, pero están preparados para ello.

## Ejemplo de Uso Completo

```bash
# 1. Crear un recurso
POST /resources/
{
  "name": "posts",
  "description": "Publicaciones del blog"
}

# 2. Crear un permiso para ese recurso
POST /permissions/
{
  "name": "read_posts",
  "action": "read",
  "resourceId": 1
}

# 3. Crear un rol
POST /roles/
{
  "name": "Editor",
  "description": "Puede editar contenido"
}

# 4. Asignar el permiso al rol
POST /role-permissions/
{
  "roleId": 1,
  "permissionId": 1
}

# 5. Crear un usuario
POST /users/
{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}

# 6. Asignar el rol al usuario
POST /user-roles/
{
  "userId": 1,
  "roleId": 1
}

# 7. Verificar permisos del usuario
GET /user-roles/user/1/permissions
```

## Acceso a la Documentación Interactiva

Cuando el backend está corriendo, puedes acceder a la documentación Swagger interactiva en:

```
http://localhost:8000/swagger
```

Esto te permitirá probar todos los endpoints directamente desde el navegador.

