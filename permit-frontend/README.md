# Permit Frontend - Dashboard RBAC

Dashboard administrativo para el sistema de gestión de permisos basado en roles (RBAC).

## 🚀 Características

- ✅ Dashboard con estadísticas
- ✅ CRUD completo de Usuarios, Roles, Recursos y Permisos
- ✅ Autenticación con NextAuth
- ✅ API Key protegida server-side
- ✅ Componentes UI con Radix + Shadcn
- ✅ Diseño responsive

## 🛠️ Stack Tecnológico

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Radix UI** - Componentes primitivos accesibles
- **Shadcn UI** - Componentes construidos sobre Radix
- **Tailwind CSS** - Framework de estilos
- **NextAuth.js** - Autenticación
- **Lucide React** - Iconos

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# URL del backend Permit (server-side)
PERMIT_API_URL=http://localhost:8000

# API Key para autenticar con el backend (server-side, nunca se expone al cliente)
PERMIT_API_KEY=tu-api-key-secreta

# NextAuth
AUTH_GITHUB_ID=tu-github-client-id
AUTH_GITHUB_SECRET=tu-github-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-aleatoria

# Database (si aún se usa directamente)
POSTGRES_URL=postgresql://user:password@host/database
```

### Seguridad

- **PERMIT_API_KEY**: Esta clave vive solo en el servidor y nunca se expone al cliente
- Las llamadas al backend se hacen a través de rutas API de Next.js (`/api/permit/*`)
- NextAuth verifica que el usuario esté autenticado antes de permitir llamadas
- El cliente frontend solo llama a las rutas API de Next.js, nunca directamente al backend

## 🚀 Desarrollo

```bash
# Ejecutar en modo desarrollo
pnpm dev

# La aplicación estará en http://localhost:3000
```

## 📁 Estructura del Proyecto

```
app/
├── (dashboard)/          # Rutas del dashboard (requieren autenticación)
│   ├── page.tsx         # Dashboard principal
│   ├── users/           # Módulo de usuarios
│   ├── roles/           # Módulo de roles
│   ├── resources/       # Módulo de recursos
│   └── permissions/     # Módulo de permisos
├── api/
│   ├── auth/            # NextAuth routes
│   └── permit/          # Proxy API routes (server-side)
│       ├── users/
│       ├── roles/
│       ├── resources/
│       └── permissions/
└── login/               # Página de login

lib/
├── api.ts               # Cliente API (llama a /api/permit/*)
├── api-server.ts        # Cliente server-side (usa API key)
└── auth.ts              # Configuración NextAuth
```

## 🔐 Arquitectura de Seguridad

```
Cliente (Browser)
    ↓
Next.js API Routes (/api/permit/*)
    ↓ (verifica NextAuth)
    ↓ (agrega API key server-side)
Backend Permit (permit-backend)
```

1. El cliente llama a `/api/permit/users` (por ejemplo)
2. La ruta API verifica que el usuario esté autenticado con NextAuth
3. La ruta API agrega la API key al header `X-API-Key`
4. La ruta API hace la llamada al backend real
5. El backend valida la API key y responde
6. La respuesta se devuelve al cliente

## 📖 Páginas Disponibles

- `/` - Dashboard principal con estadísticas
- `/users` - Gestión de usuarios
- `/roles` - Gestión de roles
- `/resources` - Gestión de recursos
- `/permissions` - Gestión de permisos
- `/login` - Página de login

## 🎨 Componentes

Todos los componentes siguen el estilo de Shadcn UI basado en Radix:

- **Tablas**: Con acciones de crear, editar, eliminar
- **Formularios**: Con validación y manejo de errores
- **Dialogs**: Para modales de formularios
- **Cards**: Para mostrar información

## 📝 Licencia

Este proyecto es privado.
