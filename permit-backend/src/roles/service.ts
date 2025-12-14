import { db } from '../db.js'
import { roles } from './schema.js'
import { eq } from 'drizzle-orm'

export interface CreateRoleInput {
	name: string
	description?: string
}

export interface UpdateRoleInput {
	name?: string
	description?: string
}

/**
 * Servicio de roles con operaciones CRUD
 */
export class RolesService {
	/**
	 * Obtener todos los roles
	 */
	static async getAllRoles() {
		try {
			const allRoles = await db.select().from(roles)
			return allRoles
		} catch (error) {
			throw new Error(`Error al obtener roles: ${error}`)
		}
	}

	/**
	 * Obtener un rol por ID
	 */
	static async getRoleById(id: number) {
		try {
			const role = await db.select().from(roles).where(eq(roles.id, id))
			
			if (role.length === 0) {
				throw new Error(`Rol con ID ${id} no encontrado`)
			}
			
			return role[0]!
		} catch (error) {
			throw new Error(`Error al obtener rol: ${error}`)
		}
	}

	/**
	 * Obtener un rol por nombre
	 */
	static async getRoleByName(name: string) {
		try {
			const role = await db.select().from(roles).where(eq(roles.name, name))
			
			if (role.length === 0) {
				return null
			}
			
			return role[0]
		} catch (error) {
			throw new Error(`Error al obtener rol por nombre: ${error}`)
		}
	}

	/**
	 * Crear un nuevo rol
	 */
	static async createRole(data: CreateRoleInput) {
		try {
			// Verificar si el nombre ya existe
			const existingRole = await this.getRoleByName(data.name)
			if (existingRole) {
				throw new Error(`El rol ${data.name} ya existe`)
			}

			const result = await db.insert(roles).values({
				name: data.name,
				description: data.description || null,
			}).returning()

			return result[0]!
		} catch (error) {
			throw new Error(`Error al crear rol: ${error}`)
		}
	}

	/**
	 * Actualizar un rol
	 */
	static async updateRole(id: number, data: UpdateRoleInput) {
		try {
			// Verificar que el rol existe
			await this.getRoleById(id)

			// Si se intenta cambiar el nombre, verificar que no exista
			if (data.name) {
				const existingRole = await db
					.select()
					.from(roles)
					.where(eq(roles.name, data.name))
				
				if (existingRole.length > 0 && existingRole[0]?.id !== id) {
					throw new Error(`El rol ${data.name} ya existe`)
				}
			}

			const updateData: any = {
				updatedAt: new Date(),
			}
			if (data.name) updateData.name = data.name
			if (data.description !== undefined) updateData.description = data.description

			const result = await db
				.update(roles)
				.set(updateData)
				.where(eq(roles.id, id))
				.returning()

			return result[0]!
		} catch (error) {
			throw new Error(`Error al actualizar rol: ${error}`)
		}
	}

	/**
	 * Eliminar un rol
	 */
	static async deleteRole(id: number) {
		try {
			// Verificar que el rol existe
			await this.getRoleById(id)

			const result = await db.delete(roles).where(eq(roles.id, id)).returning()
			
			return result[0]!
		} catch (error) {
			throw new Error(`Error al eliminar rol: ${error}`)
		}
	}
}

