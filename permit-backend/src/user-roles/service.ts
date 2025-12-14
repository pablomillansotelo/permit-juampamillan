import { db } from '../db.js'
import { userRoles } from './schema.js'
import { users } from '../users/schema.js'
import { roles } from '../roles/schema.js'
import { permissions } from '../permissions/schema.js'
import { rolePermissions } from '../role-permissions/schema.js'
import { resources } from '../resources/schema.js'
import { eq, and } from 'drizzle-orm'

export interface AssignRoleToUserInput {
	userId: number
	roleId: number
}

/**
 * Servicio para gestionar la asignación de roles a usuarios
 */
export class UserRolesService {
	/**
	 * Asignar un rol a un usuario
	 */
	static async assignRoleToUser(data: AssignRoleToUserInput) {
		try {
			// Verificar que el usuario existe
			const user = await db.select().from(users).where(eq(users.id, data.userId))
			if (user.length === 0) {
				throw new Error(`Usuario con ID ${data.userId} no encontrado`)
			}

			// Verificar que el rol existe
			const role = await db.select().from(roles).where(eq(roles.id, data.roleId))
			if (role.length === 0) {
				throw new Error(`Rol con ID ${data.roleId} no encontrado`)
			}

			// Verificar que no exista ya la asignación
			const existing = await db
				.select()
				.from(userRoles)
				.where(
					and(
						eq(userRoles.userId, data.userId),
						eq(userRoles.roleId, data.roleId)
					)
				)
			
			if (existing.length > 0) {
				throw new Error(`El rol ya está asignado a este usuario`)
			}

			const result = await db.insert(userRoles).values({
				userId: data.userId,
				roleId: data.roleId,
			}).returning()

			return result[0]!
		} catch (error) {
			throw new Error(`Error al asignar rol a usuario: ${error}`)
		}
	}

	/**
	 * Remover un rol de un usuario
	 */
	static async removeRoleFromUser(userId: number, roleId: number) {
		try {
			const result = await db
				.delete(userRoles)
				.where(
					and(
						eq(userRoles.userId, userId),
						eq(userRoles.roleId, roleId)
					)
				)
				.returning()
			
			if (result.length === 0) {
				throw new Error(`La asignación entre el usuario y el rol no existe`)
			}
			
			return result[0]!
		} catch (error) {
			throw new Error(`Error al remover rol del usuario: ${error}`)
		}
	}

	/**
	 * Obtener todos los roles de un usuario
	 */
	static async getUserRoles(userId: number) {
		try {
			const userRolesList = await db
				.select({
					id: userRoles.id,
					userId: userRoles.userId,
					roleId: userRoles.roleId,
					roleName: roles.name,
					roleDescription: roles.description,
					createdAt: userRoles.createdAt,
				})
				.from(userRoles)
				.leftJoin(roles, eq(userRoles.roleId, roles.id))
				.where(eq(userRoles.userId, userId))
			
			return userRolesList
		} catch (error) {
			throw new Error(`Error al obtener roles del usuario: ${error}`)
		}
	}

	/**
	 * Obtener todos los permisos de un usuario (a través de sus roles)
	 */
	static async getUserPermissions(userId: number) {
		try {
			// Obtener todos los permisos del usuario a través de sus roles
			// Usamos una consulta con múltiples joins
			const userPermissions = await db
				.select({
					permissionId: rolePermissions.permissionId,
					permissionName: permissions.name,
					permissionAction: permissions.action,
					resourceId: permissions.resourceId,
					resourceName: resources.name,
					roleId: userRoles.roleId,
					roleName: roles.name,
				})
				.from(userRoles)
				.innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
				.innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
				.innerJoin(resources, eq(permissions.resourceId, resources.id))
				.innerJoin(roles, eq(userRoles.roleId, roles.id))
				.where(eq(userRoles.userId, userId))
			
			// Eliminar duplicados basándose en permissionId
			const uniquePermissions = Array.from(
				new Map(userPermissions.map(p => [p.permissionId, p])).values()
			)

			return uniquePermissions
		} catch (error) {
			throw new Error(`Error al obtener permisos del usuario: ${error}`)
		}
	}

	/**
	 * Obtener todos los usuarios que tienen un rol específico
	 */
	static async getUsersWithRole(roleId: number) {
		try {
			const usersWithRole = await db
				.select({
					id: userRoles.id,
					userId: userRoles.userId,
					userName: users.name,
					userEmail: users.email,
					roleId: userRoles.roleId,
					createdAt: userRoles.createdAt,
				})
				.from(userRoles)
				.leftJoin(users, eq(userRoles.userId, users.id))
				.where(eq(userRoles.roleId, roleId))
			
			return usersWithRole
		} catch (error) {
			throw new Error(`Error al obtener usuarios con el rol: ${error}`)
		}
	}
}

