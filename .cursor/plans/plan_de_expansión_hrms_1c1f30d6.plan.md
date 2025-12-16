---
name: Plan de Expansión HRMS
overview: Plan completo para transformar el sistema RBAC actual en una plataforma integral de gestión de recursos humanos (HRMS) con organigrama, ausentismos, gestión de performance y API pública, manteniendo la arquitectura modular y escalable.
todos: []
---

# Plan de Expansión: De RBAC a HRMS Integral

## Visión General

Transformar el sistema actual de gestión de permisos (RBAC) en una plataforma completa de gestión de recursos humanos (HRMS) que incluya organigrama jerárquico, gestión de ausentismos, evaluación de performance y API pública para integración con otros sistemas.

## Arquitectura Propuesta

### Estructura Modular del Backend

```
permit-backend/src/
├── rbac/              # Módulo actual (mantener)
│   ├── users/         # Extender con campos HR
│   ├── roles/
│   ├── resources/
│   └── permissions/
├── hr/                # Nuevo módulo HR
│   ├── employees/     # Extensión de users con datos HR
│   ├── departments/   # Departamentos/áreas
│   ├── positions/     # Puestos de trabajo
│   └── org-chart/     # Lógica de organigrama
├── absences/          # Módulo de ausentismos
│   ├── leave-types/   # Tipos de ausencia (vacaciones, enfermedad, etc.)
│   ├── leave-requests/ # Solicitudes de ausencia
│   └── approvals/     # Sistema de aprobaciones
├── performance/        # Módulo de gestión de resultados
│   ├── indicators/    # Indicadores/KPIs
│   ├── evaluations/   # Evaluaciones mensuales/anuales
│   └── goals/         # Objetivos individuales
├── notifications/     # Sistema de notificaciones
│   ├── channels/       # Email, in-app, etc.
│   └── templates/     # Plantillas de notificaciones
└── audit/             # Sistema de auditoría
    └── logs/          # Historial de cambios
```

### Estructura del Frontend

```
permit-frontend/app/(dashboard)/
├── permissions/        # Módulo actual (mantener)
├── users/             # Extender con vista HR
├── org-chart/         # Visualización de organigrama
├── absences/          # Gestión de ausentismos
│   ├── requests/      # Solicitudes
│   ├── calendar/       # Calendario de ausencias
│   └── approvals/      # Panel de aprobaciones
├── performance/       # Gestión de resultados
│   ├── indicators/     # Configuración de indicadores
│   ├── evaluations/    # Evaluaciones
│   └── reports/        # Reportes y analytics
└── settings/          # Configuración extendida
```

## Fase 1: Extensión del Modelo de Usuarios (Base para Todo)

### Objetivo

Ampliar el modelo de usuarios con campos HR necesarios para todas las funcionalidades futuras.

### Cambios en Base de Datos

**Archivo:** `permit-backend/src/users/schema.ts`

Agregar campos al schema de usuarios:

- `employee_id` (TEXT, UNIQUE) - ID de empleado
- `hire_date` (DATE) - Fecha de ingreso
- `position_id` (INTEGER, FK) - Referencia a puesto
- `department_id` (INTEGER, FK) - Referencia a departamento
- `manager_id` (INTEGER, FK self-reference) - Jefe directo
- `employment_type` (TEXT) - Tipo de contrato (full-time, part-time, contractor)
- `status` (TEXT) - Estado (active, inactive, on-leave, terminated)
- `phone` (TEXT) - Teléfono
- `address` (TEXT) - Dirección
- `birth_date` (DATE) - Fecha de nacimiento
- `emergency_contact` (JSONB) - Contacto de emergencia
- `salary` (DECIMAL) - Salario (opcional, con permisos)
- `updated_at` (TIMESTAMP) - Fecha de actualización

### Nuevas Tablas

**1. Departments (Departamentos)**

- `id`, `name`, `description`, `parent_id` (self-reference para jerarquía), `manager_id` (FK users), `created_at`, `updated_at`

**2. Positions (Puestos)**

- `id`, `title`, `description`, `department_id` (FK), `level` (nivel jerárquico), `created_at`, `updated_at`

**3. Employment Types (Tipos de Contrato)**

- `id`, `name`, `description` (full-time, part-time, contractor, intern)

### Migración

Crear migración que:

1. Agrega nuevas columnas a `users` (con valores por defecto para datos existentes)
2. Crea tablas `departments`, `positions`, `employment_types`
3. Crea índices para performance (manager_id, department_id, position_id)
4. Agrega constraints y foreign keys

### Cambios en Backend

**Archivos a modificar:**

- `permit-backend/src/users/schema.ts` - Extender schema
- `permit-backend/src/users/model.ts` - Actualizar validaciones
- `permit-backend/src/users/service.ts` - Agregar lógica de negocio
- `permit-backend/src/users/router.ts` - Agregar endpoints para búsqueda avanzada

**Nuevos módulos:**

- `permit-backend/src/hr/departments/` - CRUD de departamentos
- `permit-backend/src/hr/positions/` - CRUD de puestos
- `permit-backend/src/hr/org-chart/` - Endpoints para árbol organizacional

### Cambios en Frontend

**Archivos a modificar:**

- `permit-frontend/app/(dashboard)/users/page.tsx` - Agregar campos HR
- `permit-frontend/lib/schemas/user.ts` - Extender schema de validación
- Crear componentes para selección de departamento, puesto, manager

### Endpoints Nuevos

- `GET /users?department_id=X&position_id=Y&status=active` - Filtros avanzados
- `GET /users/:id/hierarchy` - Obtener jerarquía (subordinados, manager)
- `GET /departments` - CRUD de departamentos
- `GET /positions` - CRUD de puestos
- `GET /org-chart` - Obtener estructura completa del organigrama

## Fase 2: API Pública y Versionado

### Objetivo

Exponer la API de forma segura para consumo por otros proyectos de la organización.

### Versionado de API

**Estructura:**

- `/api/v1/` - Versión actual (RBAC + HR básico)
- `/api/v2/` - Futuras versiones

**Archivo:** `permit-backend/api/index.ts`

Modificar para soportar versionado:

```typescript
.use(swagger({ path: '/swagger' }))
.use(v1Routes) // /api/v1/*
.use(v2Routes) // /api/v2/* (futuro)
```

### Autenticación para API Pública

**Opciones:**

1. **API Keys mejoradas** - Sistema de API keys con scopes y límites
2. **OAuth2** - Para integraciones más complejas
3. **JWT Tokens** - Para autenticación de usuarios externos

**Implementación inicial:** Sistema de API Keys con:

- Tabla `api_keys`: `id`, `key_hash`, `name`, `scopes` (JSONB), `rate_limit`, `expires_at`, `created_by`, `created_at`
- Middleware de validación mejorado
- Rate limiting por API key

### Documentación

**Mejorar:**

- OpenAPI/Swagger completo con ejemplos
- Documentación de autenticación
- Guías de integración
- SDKs (opcional): TypeScript, Python

### Rate Limiting Avanzado

**Archivo:** `permit-backend/src/middleware/rate-limit.ts` (nuevo)

Implementar:

- Rate limiting por API key
- Diferentes límites por endpoint
- Headers de rate limit en respuestas
- Integración con Redis (opcional, para producción distribuida)

### CORS y Seguridad

- Configurar CORS para dominios permitidos
- Validación de origen
- Headers de seguridad (CSP, etc.)

## Fase 3: Organigrama Jerárquico

### Objetivo

Visualizar y gestionar la estructura jerárquica de la organización.

### Modelo de Datos

Utilizar self-referencing en `users.manager_id` para crear la jerarquía.

**Query optimizada para árbol:**

```sql
WITH RECURSIVE org_tree AS (
  SELECT id, name, manager_id, 0 as level
  FROM users WHERE manager_id IS NULL
  UNION ALL
  SELECT u.id, u.name, u.manager_id, ot.level + 1
  FROM users u
  INNER JOIN org_tree ot ON u.manager_id = ot.id
)
SELECT * FROM org_tree;
```

### Backend

**Archivo:** `permit-backend/src/hr/org-chart/router.ts` (nuevo)

Endpoints:

- `GET /org-chart` - Árbol completo
- `GET /org-chart/:userId` - Subárbol desde un usuario
- `GET /org-chart/flat` - Lista plana con niveles
- `GET /users/:id/subordinates` - Subordinados directos e indirectos
- `GET /users/:id/ancestors` - Manager y superiores

### Frontend

**Archivo:** `permit-frontend/app/(dashboard)/org-chart/page.tsx` (nuevo)

Componentes:

- `OrgChartTree` - Visualización de árbol (usar librería como `react-organizational-chart` o `d3-hierarchy`)
- `OrgChartCard` - Tarjeta de empleado con info básica
- `OrgChartFilters` - Filtros por departamento, nivel, etc.

**Visualización:**

- Vista de árbol interactiva
- Vista de lista con niveles
- Búsqueda de empleados
- Navegación por clics

### Validaciones

- Prevenir ciclos en la jerarquía (A -> B -> A)
- Validar que manager existe
- Validar que manager no es el mismo usuario

## Fase 4: Gestión de Ausentismos

### Objetivo

Sistema completo de solicitud y aprobación de ausencias.

### Modelo de Datos

**1. Leave Types (Tipos de Ausencia)**

- `id`, `name`, `code`, `max_days_per_year`, `carry_over_allowed`, `requires_approval`, `color` (para calendario)

**2. Leave Requests (Solicitudes)**

- `id`, `user_id`, `leave_type_id`, `start_date`, `end_date`, `days_count`, `reason`, `status` (pending, approved, rejected, cancelled), `approved_by`, `approved_at`, `rejection_reason`, `created_at`, `updated_at`

**3. Leave Balances (Saldos)**

- `id`, `user_id`, `leave_type_id`, `year`, `total_days`, `used_days`, `remaining_days`, `carried_over_days`

**4. Approval Workflows (Flujos de Aprobación)**

- `id`, `leave_type_id`, `approver_role_id` (opcional), `approver_user_id` (opcional), `order` (para múltiples aprobadores), `required`

### Backend

**Módulo:** `permit-backend/src/absences/`

Endpoints:

- `GET /leave-types` - CRUD de tipos
- `GET /leave-requests` - Listar solicitudes (con filtros)
- `POST /leave-requests` - Crear solicitud
- `GET /leave-requests/:id` - Detalle
- `PUT /leave-requests/:id/approve` - Aprobar
- `PUT /leave-requests/:id/reject` - Rechazar
- `GET /leave-requests/pending` - Solicitudes pendientes del usuario actual
- `GET /leave-balances/:userId` - Saldos de un usuario
- `GET /leave-calendar` - Calendario de ausencias (por rango de fechas)

**Lógica de negocio:**

- Validar solapamiento de fechas
- Calcular días hábiles (excluir fines de semana, feriados)
- Validar saldo disponible
- Aplicar reglas de aprobación (manager directo, HR, etc.)
- Actualizar saldos automáticamente

### Frontend

**Módulo:** `permit-frontend/app/(dashboard)/absences/`

Páginas:

- `requests/page.tsx` - Lista de solicitudes del usuario
- `requests/new/page.tsx` - Crear nueva solicitud
- `approvals/page.tsx` - Panel de aprobaciones (para managers)
- `calendar/page.tsx` - Calendario visual de ausencias
- `balances/page.tsx` - Ver saldos disponibles

Componentes:

- `LeaveRequestForm` - Formulario de solicitud
- `LeaveRequestCard` - Tarjeta de solicitud
- `ApprovalPanel` - Panel para aprobar/rechazar
- `LeaveCalendar` - Calendario (usar `react-big-calendar` o similar)
- `LeaveBalanceCard` - Tarjeta de saldo

### Notificaciones

Integrar con sistema de notificaciones:

- Email al crear solicitud (para manager)
- Email al aprobar/rechazar (para empleado)
- Notificación in-app

### Integración con Calendario

- Exportar a Google Calendar, Outlook
- Sincronización bidireccional (opcional)

## Fase 5: Gestión de Resultados y Performance

### Objetivo

Sistema de evaluación de performance con indicadores y métricas.

### Modelo de Datos

**1. Performance Indicators (Indicadores)**

- `id`, `name`, `description`, `type` (numeric, percentage, boolean, text), `unit` (opcional), `target_value`, `weight` (para promedios ponderados), `category`, `is_active`

**2. Employee Indicators (Asignación a Empleados)**

- `id`, `user_id`, `indicator_id`, `assigned_at`, `assigned_by`, `is_active`

**3. Evaluations (Evaluaciones)**

- `id`, `user_id`, `evaluator_id`, `period_type` (monthly, quarterly, annual), `period_start`, `period_end`, `status` (draft, submitted, reviewed, finalized), `overall_score`, `comments`, `created_at`, `updated_at`

**4. Evaluation Scores (Puntuaciones)**

- `id`, `evaluation_id`, `indicator_id`, `value`, `target_value`, `achievement_percentage`, `notes`

**5. Evaluation Templates (Plantillas)**

- `id`, `name`, `description`, `indicator_ids` (JSONB), `is_default`

### Backend

**Módulo:** `permit-backend/src/performance/`

Endpoints:

- `GET /indicators` - CRUD de indicadores
- `POST /indicators/assign` - Asignar indicador a usuario
- `GET /evaluations` - Listar evaluaciones
- `POST /evaluations` - Crear evaluación
- `PUT /evaluations/:id` - Actualizar evaluación
- `POST /evaluations/:id/submit` - Enviar para revisión
- `POST /evaluations/:id/finalize` - Finalizar evaluación
- `GET /evaluations/user/:userId` - Evaluaciones de un usuario
- `GET /evaluations/summary/:userId` - Resumen de performance
- `GET /evaluations/reports` - Reportes agregados

**Lógica de negocio:**

- Calcular scores automáticamente
- Validar que evaluador tiene permisos
- Generar reportes mensuales/anuales
- Comparar performance entre períodos

### Frontend

**Módulo:** `permit-frontend/app/(dashboard)/performance/`

Páginas:

- `indicators/page.tsx` - Gestión de indicadores
- `evaluations/page.tsx` - Lista de evaluaciones
- `evaluations/new/page.tsx` - Crear evaluación
- `evaluations/:id/page.tsx` - Detalle de evaluación
- `reports/page.tsx` - Reportes y analytics

Componentes:

- `IndicatorForm` - Formulario de indicador
- `EvaluationForm` - Formulario de evaluación
- `ScoreInput` - Input para puntuación
- `PerformanceChart` - Gráficos de performance (usar `recharts`)
- `PerformanceSummary` - Resumen de performance
- `ComparisonChart` - Comparación entre períodos

### Reportes y Analytics

- Dashboard de performance general
- Comparación entre empleados (con permisos)
- Tendencias temporales
- Exportación a PDF/Excel

## Fase 6: Sistema de Notificaciones

### Objetivo

Sistema centralizado de notificaciones para todas las funcionalidades.

### Modelo de Datos

**1. Notifications (Notificaciones)**

- `id`, `user_id`, `type`, `title`, `message`, `data` (JSONB), `read_at`, `created_at`, `action_url` (opcional)

**2. Notification Preferences (Preferencias)**

- `id`, `user_id`, `channel` (email, in-app, push), `notification_type`, `enabled`

**3. Notification Templates (Plantillas)**

- `id`, `type`, `subject`, `body`, `variables` (JSONB)

### Backend

**Módulo:** `permit-backend/src/notifications/`

Endpoints:

- `GET /notifications` - Notificaciones del usuario
- `PUT /notifications/:id/read` - Marcar como leída
- `PUT /notifications/read-all` - Marcar todas como leídas
- `GET /notifications/unread-count` - Contador de no leídas
- `GET /notification-preferences` - Preferencias del usuario
- `PUT /notification-preferences` - Actualizar preferencias

**Servicio de envío:**

- Email (usar servicio como SendGrid, Resend, o SMTP)
- Notificaciones in-app (WebSocket o Server-Sent Events)
- Push notifications (opcional, para mobile)

### Frontend

**Componentes:**

- `NotificationBell` - Icono con contador
- `NotificationDropdown` - Lista de notificaciones
- `NotificationItem` - Item individual
- `NotificationSettings` - Configuración de preferencias

**Integración:**

- Badge en navbar
- Toast notifications para acciones importantes
- Página de notificaciones completa

## Fase 7: Sistema de Auditoría

### Objetivo

Registrar todos los cambios importantes para trazabilidad y compliance.

### Modelo de Datos

**1. Audit Logs (Logs de Auditoría)**

- `id`, `user_id`, `action`, `entity_type`, `entity_id`, `changes` (JSONB - antes/después), `ip_address`, `user_agent`, `created_at`

### Backend

**Módulo:** `permit-backend/src/audit/`

Middleware que registra:

- Creaciones, actualizaciones, eliminaciones
- Aprobaciones/rechazos
- Cambios de permisos
- Accesos sensibles

Endpoints:

- `GET /audit-logs` - Listar logs (con filtros y paginación)
- `GET /audit-logs/entity/:type/:id` - Logs de una entidad específica
- `GET /audit-logs/user/:userId` - Logs de un usuario

### Frontend

**Página:** `permit-frontend/app/(dashboard)/audit/page.tsx`

- Tabla de logs con filtros
- Vista de detalles de cambios
- Exportación de logs

## Funcionalidades Adicionales Recomendadas

### 1. Dashboard Analytics

- Métricas generales de la organización
- Gráficos de ausentismos
- Performance promedio
- Tendencias temporales

### 2. Reportes Avanzados

- Reportes personalizables
- Exportación a PDF/Excel/CSV
- Programación de reportes (email automático)

### 3. Búsqueda Global

- Búsqueda unificada de usuarios, departamentos, solicitudes, etc.
- Filtros avanzados
- Guardar búsquedas favoritas

### 4. Integraciones

- Calendario (Google, Outlook)
- Slack/Teams para notificaciones
- Sistemas de nómina (exportación de datos)
- Sistemas de tiempo y asistencia

### 5. Multi-idioma (i18n)

- Soporte para múltiples idiomas
- Traducción de interfaz
- Localización de fechas/números

### 6. Documentos y Archivos

- Adjuntar documentos a usuarios
- Gestión de contratos
- Documentos de evaluación
- Almacenamiento en S3/Cloud Storage

### 7. Workflows Personalizables

- Configurar flujos de aprobación
- Reglas de negocio configurables
- Automatizaciones

### 8. Mobile App (Futuro)

- App nativa o PWA
- Notificaciones push
- Solicitud de ausencias desde móvil

## Consideraciones de Escalabilidad

### Base de Datos

- Índices en campos de búsqueda frecuente
- Particionamiento de tablas grandes (audit_logs, notifications)
- Archiving de datos antiguos
- Connection pooling

### Caché

- Redis para sesiones y caché
- Caché de queries frecuentes (organigrama, saldos)
- Invalidación inteligente de caché

### Performance

- Paginación en todas las listas
- Lazy loading en frontend
- Optimización de queries (N+1 problem)
- CDN para assets estáticos

### Seguridad

- Encriptación de datos sensibles (salarios)
- Rate limiting robusto
- Validación de inputs
- SQL injection prevention (ya cubierto por Drizzle)
- XSS prevention
- CSRF protection

### Monitoreo

- Logging estructurado
- Error tracking (Sentry)
- Performance monitoring
- Alertas automáticas

## Orden de Implementación Recomendado

1. **Fase 1** - Extensión de usuarios (base crítica)
2. **Fase 2** - API pública (permite integraciones tempranas)
3. **Fase 3** - Organigrama (visual, alto valor)
4. **Fase 4** - Ausentismos (funcionalidad completa)
5. **Fase 5** - Performance (complejidad media-alta)
6. **Fase 6** - Notificaciones (mejora UX)
7. **Fase 7** - Auditoría (compliance)

## Archivos Clave a Modificar/Crear

### Backend

- `permit-backend/src/users/schema.ts` - Extender
- `permit-backend/src/migrations.ts` - Agregar migraciones
- `permit-backend/api/index.ts` - Versionado y nuevos módulos
- Nuevos módulos en `permit-backend/src/hr/`, `absences/`, `performance/`, `notifications/`, `audit/`

### Frontend

- `permit-frontend/lib/schemas/user.ts` - Extender
- `permit-frontend/app/(dashboard)/users/` - Mejorar UI
- Nuevas páginas para cada módulo
- Componentes compartidos mejorados

### Documentación

- Actualizar `permit-docs/` con nuevas funcionalidades
- Guías de API actualizadas
- Documentación de integración