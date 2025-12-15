import { db } from '../db.js'
import { permissions } from './schema.js'
import { resources } from '../resources/schema.js'
import { eq, and } from 'drizzle-orm'

export interface CreatePermissionInput {
	name: string
	action: string // e.g., "read", "write", "delete", "update"
	resourceId: number
	description?: string
}

export interface UpdatePermissionInput {
	name?: string
	action?: string
	resourceId?: number
	description?: string
}

/**
 * Servicio de permisos con operaciones CRUD
 */
export class PermissionsService {
	/**
	 * Obtener todos los permisos
	 */
	static async getAllPermissions() {
		try {
			const allPermissions = await db
				.select({
					id: permissions.id,
					name: permissions.name,
					action: permissions.action,
					resourceId: permissions.resourceId,
					resourceName: resources.name,
					description: permissions.description,
					createdAt: permissions.createdAt,
					updatedAt: permissions.updatedAt,
				})
				.from(permissions)
				.leftJoin(resources, eq(permissions.resourceId, resources.id))
			
			return allPermissions
		} catch (error) {
			throw new Error(`Error al obtener permisos: ${error}`)
		}
	}

	/**
	 * Obtener un permiso por ID
	 */
	static async getPermissionById(id: number) {
		try {
			const permission = await db
				.select({
					id: permissions.id,
					name: permissions.name,
					action: permissions.action,
					resourceId: permissions.resourceId,
					resourceName: resources.name,
					description: permissions.description,
					createdAt: permissions.createdAt,
					updatedAt: permissions.updatedAt,
				})
				.from(permissions)
				.leftJoin(resources, eq(permissions.resourceId, resources.id))
				.where(eq(permissions.id, id))
			
			if (permission.length === 0) {
				throw new Error(`Permiso con ID ${id} no encontrado`)
			}
			
			return permission[0]!
		} catch (error) {
			throw new Error(`Error al obtener permiso: ${error}`)
		}
	}

	/**
	 * Obtener permisos por recurso
	 */
	static async getPermissionsByResource(resourceId: number) {
		try {
			const resourcePermissions = await db
				.select({
					id: permissions.id,
					name: permissions.name,
					action: permissions.action,
					resourceId: permissions.resourceId,
					resourceName: resources.name,
					description: permissions.description,
					createdAt: permissions.createdAt,
					updatedAt: permissions.updatedAt,
				})
				.from(permissions)
				.leftJoin(resources, eq(permissions.resourceId, resources.id))
				.where(eq(permissions.resourceId, resourceId))
			
			return resourcePermissions
		} catch (error) {
			throw new Error(`Error al obtener permisos del recurso: ${error}`)
		}
	}

	/**
	 * Crear un nuevo permiso para un recurso
	 */
	static async createPermission(data: CreatePermissionInput) {
		try {
			// Verificar que el recurso existe
			const resource = await db
				.select()
				.from(resources)
				.where(eq(resources.id, data.resourceId))
			
			if (resource.length === 0) {
				throw new Error(`Recurso con ID ${data.resourceId} no encontrado`)
			}

			// Verificar que no exista un permiso con el mismo nombre y acción para el mismo recurso
			const existingPermission = await db
				.select()
				.from(permissions)
				.where(
					and(
						eq(permissions.name, data.name),
						eq(permissions.action, data.action),
						eq(permissions.resourceId, data.resourceId)
					)
				)
			
			if (existingPermission.length > 0) {
				throw new Error(`El permiso ${data.name} con acción ${data.action} ya existe para este recurso`)
			}

			const result = await db.insert(permissions).values({
				name: data.name,
				action: data.action,
				resourceId: data.resourceId,
				description: data.description || null,
			}).returning()

			// Obtener el permiso con el nombre del recurso
			const permissionWithResource = await db
				.select({
					id: permissions.id,
					name: permissions.name,
					action: permissions.action,
					resourceId: permissions.resourceId,
					resourceName: resources.name,
					description: permissions.description,
					createdAt: permissions.createdAt,
					updatedAt: permissions.updatedAt,
				})
				.from(permissions)
				.leftJoin(resources, eq(permissions.resourceId, resources.id))
				.where(eq(permissions.id, result[0]!.id))

			return permissionWithResource[0]!
		} catch (error) {
			throw new Error(`Error al crear permiso: ${error}`)
		}
	}

	/**
	 * Actualizar un permiso
	 */
	static async updatePermission(id: number, data: UpdatePermissionInput) {
		try {
			// Verificar que el permiso existe
			await this.getPermissionById(id)

			// Si se intenta cambiar el resourceId, verificar que existe
			if (data.resourceId) {
				const resource = await db
					.select()
					.from(resources)
					.where(eq(resources.id, data.resourceId))
				
				if (resource.length === 0) {
					throw new Error(`Recurso con ID ${data.resourceId} no encontrado`)
				}
			}

			const updateData: any = {
				updatedAt: new Date(),
			}
			if (data.name) updateData.name = data.name
			if (data.action) updateData.action = data.action
			if (data.resourceId) updateData.resourceId = data.resourceId
			if (data.description !== undefined) updateData.description = data.description

			await db
				.update(permissions)
				.set(updateData)
				.where(eq(permissions.id, id))

			// Obtener el permiso actualizado con el nombre del recurso
			const updatedPermission = await db
				.select({
					id: permissions.id,
					name: permissions.name,
					action: permissions.action,
					resourceId: permissions.resourceId,
					resourceName: resources.name,
					description: permissions.description,
					createdAt: permissions.createdAt,
					updatedAt: permissions.updatedAt,
				})
				.from(permissions)
				.leftJoin(resources, eq(permissions.resourceId, resources.id))
				.where(eq(permissions.id, id))

			return updatedPermission[0]!
		} catch (error) {
			throw new Error(`Error al actualizar permiso: ${error}`)
		}
	}

	/**
	 * Eliminar un permiso
	 */
	static async deletePermission(id: number) {
		try {
			// Obtener el permiso antes de eliminarlo (con el nombre del recurso)
			const permission = await this.getPermissionById(id)

			// Verificar dependencias: roles con este permiso asignado
			const { rolePermissions } = await import('../role-permissions/schema.js')
			
			const rolesWithPermission = await db
				.select()
				.from(rolePermissions)
				.where(eq(rolePermissions.permissionId, id))
				.limit(1)
			
			if (rolesWithPermission.length > 0) {
				throw new Error(
					`No se puede eliminar el permiso porque está asignado a uno o más roles. ` +
					`Primero remueve el permiso de todos los roles.`
				)
			}

			await db.delete(permissions).where(eq(permissions.id, id))
			
			return permission
		} catch (error: any) {
			// Si el error ya tiene un mensaje descriptivo, lanzarlo tal cual
			if (error.message && error.message.includes('No se puede eliminar')) {
				throw error
			}
			throw new Error(`Error al eliminar permiso: ${error}`)
		}
	}
}

