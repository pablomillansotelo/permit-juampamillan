# Plan de Implementación - Puntos Críticos

## 📋 Resumen Ejecutivo

Este documento detalla el plan de implementación para los 3 puntos críticos identificados:
1. Sistema de asignaciones (role-permissions, user-roles)
2. Toast notifications en lugar de alerts
3. Validación de permisos RBAC en frontend

---

## 1. 🎯 Toast Notifications

### Estrategia
**Objetivo:** Reemplazar `alert()` con un sistema de notificaciones toast moderno y no intrusivo.

**Decisión técnica:**
- **Librería:** `sonner` (ligera, accesible, compatible con Radix)
- **Alternativas consideradas:** react-hot-toast (más popular pero más pesada)
- **Razón:** Sonner es más ligera, tiene mejor integración con Tailwind, y es más moderna

### Plan de Implementación

#### Fase 1: Setup
1. Instalar `sonner`
2. Crear componente `Toaster` provider
3. Integrar en layout principal

#### Fase 2: Reemplazo
1. Crear hook `useToast` para facilitar uso
2. Reemplazar todos los `alert()` por `toast.error()`
3. Agregar `toast.success()` en operaciones exitosas

#### Fase 3: Mejoras
1. Agregar toasts informativos para acciones importantes
2. Configurar posición y duración
3. Agregar acciones en toasts (ej: "Deshacer" en delete)

### Archivos a Modificar
- `permit-frontend/package.json` - Agregar dependencia
- `permit-frontend/app/(dashboard)/layout.tsx` - Agregar Toaster
- `permit-frontend/lib/toast.ts` - Hook helper (nuevo)
- Todos los formularios: `*-form.tsx`
- Todas las tablas: `*-table.tsx`

### Criterios de Éxito
- ✅ Cero uso de `alert()`
- ✅ Feedback visual en todas las operaciones
- ✅ Toasts no bloquean la UI
- ✅ Accesibles (keyboard navigation)

---

## 2. 🔗 Sistema de Asignaciones

### Estrategia
**Objetivo:** Crear UI completa para gestionar asignaciones RBAC (role-permissions y user-roles).

**Decisión técnica:**
- **Estructura:** Página `/assignments` con tabs para cada tipo de asignación
- **Componentes:** 
  - Tab 1: Asignar permisos a roles (con selector de rol y checkboxes de permisos)
  - Tab 2: Asignar roles a usuarios (con selector de usuario y checkboxes de roles)
  - Tab 3: Ver permisos de usuario (vista de solo lectura con árbol de permisos)

### Plan de Implementación

#### Fase 1: Estructura Base
1. Crear página `/assignments/page.tsx`
2. Crear componente de tabs
3. Crear estructura de cada tab

#### Fase 2: Tab 1 - Role Permissions
1. Selector de rol (dropdown)
2. Lista de permisos agrupados por recurso
3. Checkboxes para permisos asignados/no asignados
4. Botón "Guardar asignaciones"
5. Visualización de permisos actuales del rol

#### Fase 3: Tab 2 - User Roles
1. Selector de usuario (dropdown con búsqueda)
2. Lista de roles disponibles
3. Checkboxes para roles asignados/no asignados
4. Botón "Guardar asignaciones"
5. Visualización de roles actuales del usuario

#### Fase 4: Tab 3 - User Permissions View
1. Selector de usuario
2. Vista jerárquica de permisos:
   - Por rol → permisos del rol
   - Agrupados por recurso
3. Badges para mostrar origen (qué rol da cada permiso)

#### Fase 5: API Routes
1. Crear rutas API para role-permissions
2. Crear rutas API para user-roles
3. Implementar bulk operations (asignar múltiples a la vez)

### Archivos a Crear
- `permit-frontend/app/(dashboard)/assignments/page.tsx`
- `permit-frontend/app/(dashboard)/assignments/role-permissions-tab.tsx`
- `permit-frontend/app/(dashboard)/assignments/user-roles-tab.tsx`
- `permit-frontend/app/(dashboard)/assignments/user-permissions-tab.tsx`
- `permit-frontend/app/api/permit/role-permissions/route.ts`
- `permit-frontend/app/api/permit/user-roles/route.ts`

### Criterios de Éxito
- ✅ Puedo asignar múltiples permisos a un rol
- ✅ Puedo asignar múltiples roles a un usuario
- ✅ Puedo ver todos los permisos de un usuario
- ✅ Feedback visual de cambios
- ✅ Operaciones bulk eficientes

---

## 3. 🔐 Validación de Permisos RBAC en Frontend

### Estrategia
**Objetivo:** Implementar verificación de permisos en el frontend para ocultar/mostrar acciones según permisos del usuario.

**Decisión técnica:**
- **Enfoque:** Hook `usePermissions` que consulta permisos del usuario actual
- **Cache:** Cachear permisos en session/cookie para evitar requests repetidos
- **Fallback:** Si no hay permisos, mostrar todo (modo desarrollo) o nada (modo producción)

### Plan de Implementación

#### Fase 1: Backend - Endpoint de Permisos
1. Crear endpoint `/user-roles/user/me/permissions` (o usar sesión)
2. Retornar lista de permisos del usuario actual
3. Formato: `{ resource: string, action: string }[]`

#### Fase 2: Frontend - Hook usePermissions
1. Crear hook que obtiene permisos del usuario
2. Cachear en estado/sessionStorage
3. Función helper `hasPermission(resource, action)`
4. Función helper `canAccess(resource, action)`

#### Fase 3: Integración
1. Obtener permisos del usuario al cargar dashboard
2. Pasar permisos como contexto o prop
3. En cada componente, verificar antes de mostrar acciones

#### Fase 4: Componentes Protegidos
1. Botones de crear/editar/eliminar condicionales
2. Ocultar tabs/secciones sin permisos
3. Mensajes informativos si no tiene permisos

### Archivos a Crear/Modificar
- `permit-frontend/lib/permissions.ts` - Hook y helpers
- `permit-frontend/app/(dashboard)/providers.tsx` - Agregar PermissionsProvider
- `permit-frontend/app/api/permit/user/me/permissions/route.ts` - Endpoint
- Todos los componentes de tablas - Agregar verificaciones
- Todos los formularios - Verificar permisos

### Criterios de Éxito
- ✅ Usuario sin permisos no ve acciones
- ✅ Botones deshabilitados con tooltip explicativo
- ✅ Performance: permisos cacheados, no requests repetidos
- ✅ Fallback graceful si falla la obtención de permisos

---

## 📊 Orden de Implementación

1. **Toast Notifications** (1-2 horas)
   - Más rápido de implementar
   - Impacto inmediato en UX
   - No depende de otros sistemas

2. **Sistema de Asignaciones** (3-4 horas)
   - Funcionalidad core faltante
   - Requiere más componentes
   - Depende de API routes

3. **Validación de Permisos RBAC** (2-3 horas)
   - Requiere endpoint en backend
   - Integración en múltiples componentes
   - Puede usar toasts para feedback

---

## 🎯 Métricas de Éxito

### Toast Notifications
- 0 usos de `alert()` en código
- 100% de operaciones con feedback visual
- Tiempo de implementación: < 2 horas

### Sistema de Asignaciones
- 3 tabs funcionales
- Operaciones CRUD completas
- Tiempo de implementación: < 4 horas

### Validación de Permisos
- Hook funcional
- Integrado en al menos 80% de componentes críticos
- Tiempo de implementación: < 3 horas

---

## 🚀 Comenzando Implementación...

