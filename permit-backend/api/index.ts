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

// Crear cliente con la URL HTTP de Neon
const neonClient = neon(process.env.DATABASE_URL!);

export default new Elysia()
    // Middleware global para ejecutar migraciones antes de cualquier request
    .onBeforeHandle(async () => {
        // Ejecutar migraciones de forma lazy (solo si no se han ejecutado)
        // Esperar a que terminen antes de procesar el request
        try {
            await runMigrations();
        } catch (error) {
            console.error('❌ Error crítico en migraciones:', error);
            // Lanzar el error para que el usuario sepa que algo falló
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
    .use(users)
    .use(roles)
    .use(resources)
    .use(permissions)
    .use(rolePermissions)
    .use(userRoles)
    .compile()
