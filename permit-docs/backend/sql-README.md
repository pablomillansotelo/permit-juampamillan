# Scripts SQL de Referencia

Este directorio contiene scripts SQL de referencia para el sistema RBAC. Aunque el sistema usa migraciones automáticas con Drizzle ORM (ejecutadas desde `src/migrations.ts`), estos scripts pueden ser útiles para:

- Referencia y documentación
- Ejecución manual en bases de datos
- Entender la estructura de las tablas
- Ejemplos de consultas
- Debugging y troubleshooting

**Nota:** Las migraciones automáticas se ejecutan desde `src/migrations.ts` cuando la aplicación inicia. Estos scripts SQL son solo para referencia y no son necesarios para el funcionamiento del sistema.

## Archivos

### `01_create_tables.sql`
Crea todas las tablas necesarias para el sistema RBAC:
- `users`: Usuarios del sistema
- `roles`: Roles disponibles
- `resources`: Recursos sobre los que se pueden tener permisos
- `permissions`: Permisos específicos sobre recursos
- `role_permissions`: Asociación entre roles y permisos
- `user_roles`: Asociación entre usuarios y roles

### `02_create_indexes.sql`
Crea índices para mejorar el rendimiento de las consultas:
- Índices en claves foráneas
- Índices en campos de búsqueda frecuente (email, nombres)

### `03_sample_data.sql`
Inserta datos de ejemplo para probar el sistema:
- 3 usuarios de ejemplo
- 3 recursos (posts, users, settings)
- 3 roles (admin, editor, viewer)
- Permisos para cada recurso
- Asignaciones de permisos a roles
- Asignaciones de roles a usuarios

### `04_queries_examples.sql`
Contiene consultas SQL de ejemplo que muestran cómo:
- Obtener roles de un usuario
- Obtener permisos de un usuario
- Obtener permisos de un rol
- Verificar si un usuario tiene un permiso
- Obtener estadísticas del sistema

## Uso

### Ejecutar scripts manualmente

Si deseas ejecutar estos scripts manualmente en PostgreSQL:

```bash
# Conectar a la base de datos
psql $DATABASE_URL

# Ejecutar un script
\i sql/01_create_tables.sql
\i sql/02_create_indexes.sql
\i sql/03_sample_data.sql
```

O desde la línea de comandos:

```bash
psql $DATABASE_URL -f sql/01_create_tables.sql
psql $DATABASE_URL -f sql/02_create_indexes.sql
psql $DATABASE_URL -f sql/03_sample_data.sql
```

### Nota Importante

**El sistema ejecuta migraciones automáticamente al iniciar** desde `src/migrations.ts`, por lo que normalmente no necesitarás ejecutar estos scripts manualmente. Estos scripts son principalmente para referencia y documentación.

Si ejecutas los scripts manualmente, asegúrate de que la aplicación no esté ejecutando migraciones automáticas al mismo tiempo para evitar conflictos.

## Relación con el Código

Los scripts SQL en este directorio corresponden a las migraciones automáticas definidas en `src/migrations.ts`. Ambos crean la misma estructura de base de datos:

- **Migraciones automáticas** (`src/migrations.ts`): Se ejecutan al iniciar la aplicación
- **Scripts SQL** (`sql/*.sql`): Para referencia y ejecución manual

La estructura de las tablas está definida en los schemas de Drizzle ORM ubicados en `src/**/schema.ts`.

