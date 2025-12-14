import { db } from '../db.js'
import { users } from './schema.js'
import { eq } from 'drizzle-orm'

export interface CreateUserInput {
	name: string
	email: string
}

export interface UpdateUserInput {
	name?: string
	email?: string
}

/**
 * Servicio de usuarios con operaciones CRUD
 */
export class UsersService {
	/**
	 * Obtener todos los usuarios
	 */
	static async getAllUsers() {
		try {
			const allUsers = await db.select().from(users)
			return allUsers
		} catch (error) {
			throw new Error(`Error al obtener usuarios: ${error}`)
		}
	}

	/**
	 * Obtener un usuario por ID
	 */
	static async getUserById(id: number) {
		try {
			const user = await db.select().from(users).where(eq(users.id, id))
			
			if (user.length === 0) {
				throw new Error(`Usuario con ID ${id} no encontrado`)
			}
			
			return user[0]!
		} catch (error) {
			throw new Error(`Error al obtener usuario: ${error}`)
		}
	}

	/**
	 * Obtener un usuario por email
	 */
	static async getUserByEmail(email: string) {
		try {
			const user = await db.select().from(users).where(eq(users.email, email))
			
			if (user.length === 0) {
				return null
			}
			
			return user[0]
		} catch (error) {
			throw new Error(`Error al obtener usuario por email: ${error}`)
		}
	}

	/**
	 * Crear un nuevo usuario
	 */
	static async createUser(data: CreateUserInput) {
		try {
			// Verificar si el email ya existe
			const existingUser = await this.getUserByEmail(data.email)
			if (existingUser) {
				throw new Error(`El email ${data.email} ya está registrado`)
			}

			const result = await db.insert(users).values({
				name: data.name,
				email: data.email
			}).returning()

			return result[0]!
		} catch (error) {
			throw new Error(`Error al crear usuario: ${error}`)
		}
	}

	/**
	 * Actualizar un usuario
	 */
	static async updateUser(id: number, data: UpdateUserInput) {
		try {
			// Verificar que el usuario existe
			await this.getUserById(id)

			// Si se intenta cambiar el email, verificar que no exista
			if (data.email) {
				const existingUser = await db
					.select()
					.from(users)
					.where(eq(users.email, data.email))
				
				if (existingUser.length > 0 && existingUser[0]?.id !== id) {
					throw new Error(`El email ${data.email} ya está registrado`)
				}
			}

			const updateData: any = {}
			if (data.name) updateData.name = data.name
			if (data.email) updateData.email = data.email

			const result = await db
				.update(users)
				.set(updateData)
				.where(eq(users.id, id))
				.returning()

			return result[0]!
		} catch (error) {
			throw new Error(`Error al actualizar usuario: ${error}`)
		}
	}

	/**
	 * Eliminar un usuario
	 */
	static async deleteUser(id: number) {
		try {
			// Verificar que el usuario existe
			await this.getUserById(id)

			const result = await db.delete(users).where(eq(users.id, id)).returning()
			
			return result[0]!
		} catch (error) {
			throw new Error(`Error al eliminar usuario: ${error}`)
		}
	}

	/**
	 * Sign-in (placeholder para autenticación)
	 */
	static async signIn(email: string, password: string) {
		try {
			const user = await this.getUserByEmail(email)
			
			if (!user) {
				throw new Error('Credenciales inválidas')
			}

			// Aquí iría la verificación de contraseña
			// En este ejemplo, solo retornamos el usuario
			const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

			return {
				token,
				user: {
					id: user.id,
					name: user.name,
					email: user.email
				}
			}
		} catch (error) {
			throw new Error(`Error en sign-in: ${error}`)
		}
	}
}

// Alias para mantener compatibilidad
export const Users = UsersService
