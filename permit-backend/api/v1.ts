import { Elysia, t } from 'elysia'
import { users } from '../src/users/router.js'
import { roles } from '../src/roles/router.js'
import { resources } from '../src/resources/router.js'
import { permissions } from '../src/permissions/router.js'
import { rolePermissions } from '../src/role-permissions/router.js'
import { userRoles } from '../src/user-roles/router.js'
// Módulos HR
import { departments } from '../src/hr/departments/router.js'
import { positionsRouter } from '../src/hr/positions/router.js'
import { orgChart } from '../src/hr/org-chart/router.js'
// Módulos de Ausentismos
import { leaveTypes } from '../src/absences/leave-types/router.js'
import { leaveRequests } from '../src/absences/leave-requests/router.js'
// API Keys
import { apiKeys } from '../src/api-keys/router.js'
// Performance
import { performance } from '../src/performance/router.js'
// Notifications
import { notifications } from '../src/notifications/router.js'
// Audit
import { audit } from '../src/audit/router.js'
// Services
import { ResourcesService } from '../src/resources/service.js'
import { PermissionsService } from '../src/permissions/service.js'

/**
 * API v1 - Versión actual con RBAC + HR básico
 */
export const v1Routes = new Elysia({ prefix: '/v1' })
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
    }, {
        detail: {
            tags: ['resources'],
            summary: 'Obtener recursos y acciones disponibles',
        },
    })
    .use(users)
    .use(roles)
    .use(resources)
    .use(permissions)
    .use(rolePermissions)
    .use(userRoles)
    .use(departments)
    .use(positionsRouter)
    .use(orgChart)
    .use(leaveTypes)
    .use(leaveRequests)
    .use(apiKeys)
    .use(performance)
    .use(notifications)
    .use(audit)

