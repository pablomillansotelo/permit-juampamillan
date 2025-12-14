# API Users - Guía de Uso

Este es el módulo de gestión de usuarios para el backend de Permit usando Elysia, Bun y Drizzle ORM conectado a Neon PostgreSQL.

## Estructura del Proyecto

```
api/users/
├── index.ts      # Router con endpoints CRUD
├── service.ts    # Lógica de negocio
├── model.ts      # Esquemas de validación (Elysia)
└── schema.ts     # Esquema de BD (Drizzle ORM)
```

## Endpoints Disponibles

### 1. GET `/users` - Obtener todos los usuarios
Retorna una lista de todos los usuarios registrados.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

### 2. GET `/users/:id` - Obtener usuario por ID
Retorna un usuario específico.

**Respuesta:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### 3. POST `/users` - Crear nuevo usuario
Crea un nuevo usuario en la base de datos.

**Body:**
```json
{
  "name": "Carlos García",
  "email": "carlos@example.com"
}
```

**Respuesta:**
```json
{
  "id": 2,
  "name": "Carlos García",
  "email": "carlos@example.com",
  "createdAt": "2025-01-15T11:00:00Z"
}
```

### 4. PUT `/users/:id` - Actualizar usuario
Actualiza los datos de un usuario existente.

**Body (campos opcionales):**
```json
{
  "name": "Carlos García Actualizado",
  "email": "carlos.nuevo@example.com"
}
```

**Respuesta:**
```json
{
  "id": 2,
  "name": "Carlos García Actualizado",
  "email": "carlos.nuevo@example.com",
  "createdAt": "2025-01-15T11:00:00Z"
}
```

### 5. DELETE `/users/:id` - Eliminar usuario
Elimina un usuario de la base de datos.

**Respuesta:**
```json
{
  "message": "Usuario eliminado exitosamente",
  "user": {
    "id": 2,
    "name": "Carlos García Actualizado",
    "email": "carlos.nuevo@example.com",
    "createdAt": "2025-01-15T11:00:00Z"
  }
}
```

### 6. POST `/users/sign-in` - Autenticación
Realiza el sign-in de un usuario (placeholder para autenticación completa).

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "token": "MTo3MzcyODI4NDM0NjAxODk=",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

## Migraciones

### Generar migraciones
Para generar migraciones basadas en los cambios en el schema:

```bash
bun drizzle-kit generate:pg
```

### Ejecutar migraciones
Para ejecutar las migraciones pendientes:

```bash
bun drizzle-kit migrate:pg
```

### Abrir Drizzle Studio
Para visualizar y administrar la base de datos:

```bash
bun drizzle-kit studio
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
  "error": "El email juan@example.com ya está registrado"
}
```

## Características

✅ CRUD completo de usuarios
✅ Validación de datos con Elysia
✅ Manejo de errores consistente
✅ Conexión a Neon PostgreSQL vía HTTP
✅ Migraciones con Drizzle ORM
✅ Documentación Swagger integrada

## Notas

- El sistema valida automáticamente que los emails sean únicos
- Las fechas se almacenan en UTC
- Los campos `name` y `email` son requeridos al crear usuarios
- Las actualizaciones requieren al menos un campo para cambiar
