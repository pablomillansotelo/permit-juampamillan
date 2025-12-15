import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { neon } from '@neondatabase/serverless'
import { runMigrations } from '../src/migrations.js'
import { users } from '../src/users/router.js'
import { roles } from '../src/roles/router.js'
import { resources } from '../src/resources/router.js'
import { permissions } from '../src/permissions/router.js'
import { rolePermissions } from '../src/role-permissions/router.js'
import { userRoles } from '../src/user-roles/router.js'
import { ResourcesService } from '../src/resources/service.js'
import { PermissionsService } from '../src/permissions/service.js'

// Crear cliente con la URL HTTP de Neon
const neonClient = neon(process.env.DATABASE_URL!);

// API Key para autenticación (debe coincidir con PERMIT_API_KEY del frontend)
const API_KEY = process.env.API_KEY || '';

export default new Elysia()
    // Middleware global para validar API Key (excepto en rutas públicas)
    // Este middleware se ejecuta PRIMERO para validar antes de procesar
    .onBeforeHandle(async ({ request, path, set }) => {
        // Rutas públicas que no requieren API key
        const publicPaths = ['/', '/swagger', '/db', '/available'];
        
        if (!publicPaths.includes(path)) {
            const apiKey = request.headers.get('x-api-key');
            
            if (!API_KEY) {
                console.warn('⚠️ API_KEY no configurada. Las requests serán rechazadas.');
            }
            
            if (!apiKey || apiKey !== API_KEY) {
                set.status = 401;
                return {
                    error: 'No autorizado',
                    message: 'API Key inválida o faltante'
                };
            }
        }
        
        // Ejecutar migraciones después de validar API key (solo si pasa la validación)
        try {
            await runMigrations();
        } catch (error) {
            console.error('❌ Error crítico en migraciones:', error);
            throw new Error(`Error al ejecutar migraciones: ${error}`);
        }
    })
    .use(swagger({
        documentation: {
            info: {
                title: 'Permit Backend API',
                description: 'API para gestión de permisos RBAC (Role-Based Access Control)',
                version: '1.0.0'
            },
            tags: [
                { name: 'users', description: 'Operaciones de usuarios' },
                { name: 'roles', description: 'Operaciones de roles' },
                { name: 'resources', description: 'Operaciones de recursos' },
                { name: 'permissions', description: 'Operaciones de permisos' },
                { name: 'role-permissions', description: 'Asociación de permisos a roles' },
                { name: 'user-roles', description: 'Asignación de roles a usuarios' }
            ]
        }
    }))
    .get('/', () => ({
        message: 'Permit Backend API',
        version: '1.0.0',
        endpoints: {
            users: '/users',
            roles: '/roles',
            resources: '/resources',
            permissions: '/permissions',
            rolePermissions: '/role-permissions',
            userRoles: '/user-roles',
            docs: '/swagger'
        }
    }))
    .get('/db', async (ctx) => {
        const result = await neonClient`SELECT NOW()`
        return {
            message: 'Conectado a Neon vía HTTP con Elysia.js 😎',
            fecha: result![0]!.now
        }
    })
    .get('/available', async () => {
        // Endpoint para obtener recursos y acciones disponibles
        // Útil para formularios y autocompletado
        try {
            const allResources = await ResourcesService.getAllResources()
            const allPermissions = await PermissionsService.getAllPermissions()
            
            // Extraer acciones únicas de los permisos existentes
            const uniqueActions = Array.from(
                new Set(allPermissions.map(p => p.action))
            ).sort()
            
            // Acciones comunes predefinidas
            const commonActions = ['read', 'write', 'create', 'update', 'delete', 'manage']
            
            // Combinar acciones únicas con comunes (sin duplicados)
            const allActions = Array.from(
                new Set([...commonActions, ...uniqueActions])
            ).sort()
            
            return {
                resources: allResources.map(r => ({
                    id: r.id,
                    name: r.name,
                    description: r.description
                })),
                actions: allActions
            }
        } catch (error: any) {
            throw new Error(`Error al obtener recursos y acciones: ${error.message}`)
        }
    })
    .use(users)
    .use(roles)
    .use(resources)
    .use(permissions)
    .use(rolePermissions)
    .use(userRoles)
    .compile()
