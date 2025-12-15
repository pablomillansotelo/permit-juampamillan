# Análisis del Frontend - Permit Dashboard

Este documento analiza la estructura y componentes del frontend basado en Next.js 15 con Radix UI.

## 📋 Resumen

El frontend es una plantilla de dashboard administrativo construida con:
- **Next.js 15** (App Router)
- **Radix UI** - Componentes primitivos accesibles
- **Shadcn UI** - Componentes construidos sobre Radix
- **Tailwind CSS** - Estilos utility-first
- **NextAuth.js** - Autenticación
- **TypeScript** - Tipado estático

## 🏗️ Estructura del Proyecto

```
permit-frontend/
├── app/
│   ├── (dashboard)/          # Grupo de rutas del dashboard
│   │   ├── layout.tsx        # Layout principal del dashboard
│   │   ├── page.tsx          # Página principal (Products)
│   │   ├── users/            # Módulo de usuarios
│   │   │   ├── page.tsx      # Lista de usuarios
│   │   │   ├── users-table.tsx
│   │   │   ├── user.tsx
│   │   │   └── search.tsx
│   │   ├── products/         # Módulo de productos (plantilla)
│   │   ├── customers/        # Módulo de clientes (plantilla)
│   │   ├── orders/           # Módulo de órdenes (plantilla)
│   │   ├── analytics/        # Analytics (plantilla)
│   │   ├── nav-item.tsx      # Componente de navegación
│   │   ├── search.tsx        # Componente de búsqueda global
│   │   ├── providers.tsx     # Providers de React (contextos)
│   │   └── actions.ts        # Server actions
│   ├── api/
│   │   ├── auth/            # NextAuth routes
│   │   ├── openapi/         # Endpoint OpenAPI
│   │   └── seed/            # Seed de datos
│   ├── docs/                # Página de documentación
│   ├── login/               # Página de login
│   └── layout.tsx           # Layout raíz
├── components/
│   ├── ui/                  # Componentes Shadcn UI
│   │   ├── button.tsx
│   │   ├── table.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── sheet.tsx
│   │   └── tooltip.tsx
│   └── icons.tsx            # Iconos personalizados
└── lib/
    ├── db.ts                # Configuración de base de datos
    ├── auth.ts              # Configuración de NextAuth
    └── utils.ts             # Utilidades (cn, etc.)
```

## 🎨 Componentes UI Disponibles

### Componentes Base (Shadcn UI)

Todos los componentes están basados en Radix UI y son completamente accesibles:

1. **Button** (`components/ui/button.tsx`)
   - Variantes: default, destructive, outline, secondary, ghost, link
   - Tamaños: default, sm, lg, icon

2. **Table** (`components/ui/table.tsx`)
   - Tablas accesibles con estructura semántica
   - Usado en `users-table.tsx` y `products-table.tsx`

3. **Input** (`components/ui/input.tsx`)
   - Inputs de texto con estilos consistentes

4. **Tabs** (`components/ui/tabs.tsx`)
   - Sistema de pestañas (usado en products page)

5. **Badge** (`components/ui/badge.tsx`)
   - Badges para estados y etiquetas

6. **Breadcrumb** (`components/ui/breadcrumb.tsx`)
   - Navegación breadcrumb

7. **Card** (`components/ui/card.tsx`)
   - Tarjetas contenedoras

8. **Dropdown Menu** (`components/ui/dropdown-menu.tsx`)
   - Menús desplegables

9. **Sheet** (`components/ui/sheet.tsx`)
   - Paneles laterales (usado en navegación móvil)

10. **Tooltip** (`components/ui/tooltip.tsx`)
    - Tooltips informativos

## 📱 Layout del Dashboard

### Layout Principal (`app/(dashboard)/layout.tsx`)

El layout incluye:

1. **Desktop Navigation** (Sidebar izquierdo)
   - Navegación vertical fija
   - Iconos de Lucide React
   - Links a: Dashboard, Orders, Products, Customers, Users, Analytics
   - Botón de Settings en la parte inferior

2. **Mobile Navigation** (Sheet)
   - Menú lateral que se abre desde un botón
   - Navegación completa para móviles

3. **Header**
   - Breadcrumb navigation
   - Search input global
   - Componente User (avatar y menú)

4. **Main Content Area**
   - Área flexible para el contenido de cada página
   - Padding responsive

### Características del Layout

- **Responsive**: Adapta la navegación para móvil/desktop
- **Sticky Header**: El header se mantiene visible al hacer scroll
- **Sidebar Fijo**: En desktop, el sidebar permanece visible
- **Breadcrumbs**: Navegación contextual

## 📄 Páginas Existentes

### 1. Dashboard Principal (`app/(dashboard)/page.tsx`)
- Muestra la tabla de productos
- Tabs para filtrar: All, Active, Draft, Archived
- Botones de Export y Add Product
- Paginación con offset

### 2. Usuarios (`app/(dashboard)/users/page.tsx`)
- Lista de usuarios con tabla
- Búsqueda de usuarios
- Paginación
- Server-side rendering

### 3. Productos (`app/(dashboard)/products/page.tsx`)
- Similar a la página principal
- Sistema de tabs
- Tabla de productos

### 4. Clientes (`app/(dashboard)/customers/page.tsx`)
- Página de plantilla (probablemente vacía)

### 5. Órdenes (`app/(dashboard)/orders/page.tsx`)
- Página de plantilla (probablemente vacía)

### 6. Analytics (`app/(dashboard)/analytics/`)
- Página de plantilla (probablemente vacía)

## 🔧 Configuración Actual

### Base de Datos (`lib/db.ts`)

Actualmente configurado para:
- **Neon PostgreSQL** (serverless)
- **Drizzle ORM**
- Tablas existentes:
  - `products` (con enum de status)
  - `users` (tabla básica)

### Autenticación (`lib/auth.ts`)

- Configurado con NextAuth.js
- Probablemente usando GitHub OAuth (según el README original)

## 🎯 Componentes Personalizados

### UsersTable (`app/(dashboard)/users/users-table.tsx`)
- Tabla de usuarios con paginación
- Acciones: ver, editar, eliminar
- Server actions para eliminar

### ProductsTable (`app/(dashboard)/products-table.tsx`)
- Tabla de productos
- Estados visuales (badges)
- Paginación

### Search (`app/(dashboard)/search.tsx`)
- Input de búsqueda global
- Usa URL search params

### User (`app/(dashboard)/users/user.tsx`)
- Avatar del usuario
- Menú dropdown con opciones

## 🚀 Funcionalidades Implementadas

✅ **Navegación**
- Sidebar responsive
- Breadcrumbs
- Navegación móvil

✅ **Búsqueda**
- Búsqueda global en header
- Búsqueda por página (usuarios)

✅ **Tablas**
- Tablas con paginación
- Acciones por fila
- Estados visuales

✅ **UI Components**
- Sistema completo de componentes Shadcn
- Accesibilidad (Radix UI)
- Estilos consistentes (Tailwind)

## 🔄 Lo que Necesita Adaptarse para Permit Backend

### 1. Conexión a la API Backend

Actualmente el frontend usa Drizzle directamente. Necesita:
- Cliente HTTP para llamar a `permit-backend`
- Reemplazar llamadas a `lib/db.ts` por llamadas a la API
- Manejo de autenticación con tokens

### 2. Nuevas Páginas Necesarias

Basándose en la API del backend, necesitamos crear:

- **Roles** (`/roles`)
  - Lista de roles
  - Crear/editar/eliminar roles
  - Asignar permisos a roles

- **Recursos** (`/resources`)
  - Lista de recursos
  - CRUD de recursos

- **Permisos** (`/permissions`)
  - Lista de permisos
  - CRUD de permisos
  - Filtrar por recurso

- **Asignaciones**
  - Página para gestionar role-permissions
  - Página para gestionar user-roles
  - Vista de permisos de usuario

### 3. Componentes Adicionales Necesarios

- **RoleForm**: Formulario para crear/editar roles
- **ResourceForm**: Formulario para crear/editar recursos
- **PermissionForm**: Formulario para crear/editar permisos
- **RolePermissionsManager**: Gestor de permisos por rol
- **UserRolesManager**: Gestor de roles por usuario
- **PermissionsView**: Vista de permisos de un usuario

### 4. Mejoras en Usuarios

- Integrar con `/users/` del backend
- Agregar formulario de creación/edición
- Mostrar roles del usuario
- Mostrar permisos del usuario

### 5. Navegación Actualizada

Actualizar el sidebar para incluir:
- Roles
- Recursos
- Permisos
- (Mantener Usuarios, Dashboard)

### 6. Autenticación

- Integrar con `/users/sign-in` del backend
- Guardar token JWT
- Enviar token en headers de las requests

## 📦 Dependencias Clave

```json
{
  "next": "15.1.3",
  "react": "19.0.0",
  "@radix-ui/react-*": "varios",
  "next-auth": "5.0.0-beta.25",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.400.0",
  "drizzle-orm": "^0.31.4"
}
```

## 🎨 Estilos

- **Tailwind CSS** con configuración personalizada
- **CSS Variables** para temas (preparado para dark mode)
- **Tailwind Animate** para animaciones
- **Class Variance Authority** para variantes de componentes

## 🔐 Seguridad

- **Server-only** para funciones de base de datos
- **NextAuth** para autenticación
- **Middleware** para protección de rutas (probablemente en `middleware.ts`)

## 📝 Próximos Pasos

1. Crear cliente API para comunicarse con `permit-backend`
2. Implementar autenticación con tokens JWT
3. Crear páginas para Roles, Recursos y Permisos
4. Crear componentes de formularios
5. Implementar gestión de asignaciones
6. Actualizar navegación
7. Agregar manejo de errores y loading states
8. Implementar validación de formularios (Zod)

## 🎯 Conclusión

La plantilla del frontend es sólida y está bien estructurada. Tiene todos los componentes base necesarios para construir un dashboard completo. El siguiente paso es adaptarla para consumir la API del backend y crear las páginas y componentes específicos para el sistema RBAC.

