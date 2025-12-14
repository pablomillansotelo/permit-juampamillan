import { db } from '../db.js'
import { rolePermissions } from './schema.js'
import { permissions } from '../permissions/schema.js'
import { roles } from '../roles/schema.js'
import { resources } from '../resources/schema.js'
import { eq, and } from 'drizzle-orm'

export interface AssignPermissionToRoleInput {
	roleId: number
	permissionId: number
}

/**
 * Servicio para gestionar la asociación de permisos a roles
 */
export class RolePermissionsService {
	/**
	 * Asignar un permiso a un rol
	 */
	static async assignPermissionToRole(data: AssignPermissionToRoleInput) {
		try {
			// Verificar que el rol existe
			const role = await db.select().from(roles).where(eq(roles.id, data.roleId))
			if (role.length === 0) {
				throw new Error(`Rol con ID ${data.roleId} no encontrado`)
			}

			// Verificar que el permiso existe
			const permission = await db.select().from(permissions).where(eq(permissions.id, data.permissionId))
			if (permission.length === 0) {
				throw new Error(`Permiso con ID ${data.permissionId} no encontrado`)
			}

			// Verificar que no exista ya la asociación
			const existing = await db
				.select()
				.from(rolePermissions)
				.where(
					and(
						eq(rolePermissions.roleId, data.roleId),
						eq(rolePermissions.permissionId, data.permissionId)
					)
				)
			
			if (existing.length > 0) {
				throw new Error(`El permiso ya está asignado a este rol`)
			}

			const result = await db.insert(rolePermissions).values({
				roleId: data.roleId,
				permissionId: data.permissionId,
			}).returning()

			return result[0]!
		} catch (error) {
			throw new Error(`Error al asignar permiso a rol: ${error}`)
		}
	}

	/**
	 * Remover un permiso de un rol
	 */
	static async removePermissionFromRole(roleId: number, permissionId: number) {
		try {
			const result = await db
				.delete(rolePermissions)
				.where(
					and(
						eq(rolePermissions.roleId, roleId),
						eq(rolePermissions.permissionId, permissionId)
					)
				)
				.returning()
			
			if (result.length === 0) {
				throw new Error(`La asociación entre el rol y el permiso no existe`)
			}
			
			return result[0]!
		} catch (error) {
			throw new Error(`Error al remover permiso del rol: ${error}`)
		}
	}

	/**
	 * Obtener todos los permisos de un rol
	 */
	static async getRolePermissions(roleId: number) {
		try {
			const rolePerms = await db
				.select({
					id: rolePermissions.id,
					roleId: rolePermissions.roleId,
					permissionId: rolePermissions.permissionId,
					permissionName: permissions.name,
					permissionAction: permissions.action,
					resourceId: permissions.resourceId,
					resourceName: resources.name,
					createdAt: rolePermissions.createdAt,
				})
				.from(rolePermissions)
				.leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
				.leftJoin(resources, eq(permissions.resourceId, resources.id))
				.where(eq(rolePermissions.roleId, roleId))
			
			return rolePerms
		} catch (error) {
			throw new Error(`Error al obtener permisos del rol: ${error}`)
		}
	}

	/**
	 * Obtener todos los roles que tienen un permiso específico
	 */
	static async getRolesWithPermission(permissionId: number) {
		try {
			const rolesWithPerm = await db
				.select({
					id: rolePermissions.id,
					roleId: rolePermissions.roleId,
					roleName: roles.name,
					permissionId: rolePermissions.permissionId,
					createdAt: rolePermissions.createdAt,
				})
				.from(rolePermissions)
				.leftJoin(roles, eq(rolePermissions.roleId, roles.id))
				.where(eq(rolePermissions.permissionId, permissionId))
			
			return rolesWithPerm
		} catch (error) {
			throw new Error(`Error al obtener roles con el permiso: ${error}`)
		}
	}
}

