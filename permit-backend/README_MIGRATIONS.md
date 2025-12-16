# Sistema de Migraciones y Seed

Este proyecto usa **Drizzle ORM** como única fuente de verdad para la estructura de la base de datos. Los schemas definidos en `src/**/schema.ts` son la autoridad única.

## Arquitectura

```
src/**/schema.ts (Schemas) 
    ↓
src/schema.ts (Exporta todos los schemas)
    ↓
drizzle.config.ts (Configuración de Drizzle Kit)
    ↓
drizzle/ (Migraciones generadas)
    ↓
Base de Datos PostgreSQL
```

## Comandos Disponibles

### Generar Migraciones

Genera archivos de migración SQL basados en los cambios en los schemas:

```bash
bun run db:generate
```

Esto crea archivos SQL en `./drizzle/` que representan los cambios necesarios.

### Ejecutar Migraciones

Ejecuta las migraciones generadas en la base de datos:

```bash
bun run db:migrate
```

### Push Directo (Desarrollo)

Sincroniza directamente la base de datos con los schemas sin generar archivos de migración:

```bash
bun run db:push
```

**⚠️ Usar solo en desarrollo.** En producción, siempre usar migraciones versionadas.

### Seed de Datos

Carga datos iniciales de ejemplo en la base de datos:

```bash
bun run db:seed
```

Este script crea:
- 4 departamentos (Tecnología, RH, Ventas, Finanzas)
- 6 puestos (CEO, CTO, Gerente RH, Desarrollador Senior, Desarrollador, Especialista RH)
- 7 usuarios con estructura jerárquica
- 3 roles (admin, manager, employee)
- Permisos y asignaciones
- Tipos de ausencia (Vacaciones, Enfermedad, Asuntos Personales)
- Saldos de ausencia para el año actual

### Reset Completo

Sincroniza la BD y carga datos de ejemplo:

```bash
bun run db:reset
```

### Drizzle Studio

Abre una interfaz visual para explorar y editar la base de datos:

```bash
bun run db:studio
```

## Flujo de Trabajo Recomendado

### Desarrollo

1. **Modificar schemas** en `src/**/schema.ts`
2. **Sincronizar BD**: `bun run db:push`
3. **Cargar datos de prueba** (opcional): `bun run db:seed`

### Producción

1. **Modificar schemas** en `src/**/schema.ts`
2. **Generar migraciones**: `bun run db:generate`
3. **Revisar migraciones** generadas en `./drizzle/`
4. **Ejecutar migraciones**: `bun run db:migrate`

## Estructura de Schemas

Todos los schemas están organizados por módulo:

```
src/
├── schema.ts                    # Exporta todos los schemas
├── users/schema.ts              # Schema de usuarios (extendido con HR)
├── roles/schema.ts              # Schema de roles
├── resources/schema.ts          # Schema de recursos
├── permissions/schema.ts        # Schema de permisos
├── role-permissions/schema.ts   # Relación roles-permisos
├── user-roles/schema.ts         # Relación usuarios-roles
├── hr/
│   ├── departments/schema.ts    # Departamentos
│   ├── positions/schema.ts      # Puestos
│   └── employment-types/schema.ts # Tipos de contrato
└── absences/
    ├── leave-types/schema.ts    # Tipos de ausencia
    ├── leave-requests/schema.ts # Solicitudes
    └── leave-balances/schema.ts  # Saldos
```

## Migraciones Automáticas

El sistema intenta ejecutar migraciones automáticamente al iniciar la aplicación. Si no encuentra migraciones generadas, muestra un mensaje indicando que se deben generar.

**En producción**, siempre genera y ejecuta migraciones explícitamente antes del despliegue.

## Seed de Datos

El script de seed (`src/seed.ts`) crea una estructura organizacional completa:

### Jerarquía de Usuarios

```
CEO (María González)
├── CTO (Carlos Rodríguez)
│   └── Senior Dev (Luis Fernández)
│       ├── Dev (Sofía López)
│       └── Dev (Pedro Sánchez)
└── HR Manager (Ana Martínez)
    └── HR Specialist (Laura García)
```

### Roles y Permisos

- **admin**: Acceso completo (solo CEO)
- **manager**: Gestión de equipo y ausentismos (CTO, HR Manager, Senior Dev)
- **employee**: Permisos básicos (Devs, HR Specialist)

### Datos de Ejemplo

- Departamentos con estructura jerárquica
- Puestos con niveles organizacionales
- Usuarios con datos HR completos
- Tipos de ausencia configurados
- Saldos de ausencia para el año actual

## Variables de Entorno

Asegúrate de tener configurado:

```env
DATABASE_URL=postgresql://user:password@host/database
```

## Notas Importantes

1. **Nunca edites SQL directamente** - Siempre modifica los schemas
2. **Revisa las migraciones generadas** antes de ejecutarlas en producción
3. **El seed es idempotente** - Puedes ejecutarlo múltiples veces (pero creará duplicados)
4. **En producción**, usa migraciones versionadas, no `db:push`

