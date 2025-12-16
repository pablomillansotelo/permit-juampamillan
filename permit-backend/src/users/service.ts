import { db } from '../db.js'
import { users } from './schema.js'
import { eq, and, or, like, sql } from 'drizzle-orm'

export interface CreateUserInput {
	name: string
	email: string
	employeeId?: string
	hireDate?: string
	positionId?: number
	departmentId?: number
	managerId?: number
	employmentType?: string
	status?: string
	phone?: string
	address?: string
	birthDate?: string
	emergencyContact?: any
	salary?: number
}

export interface UpdateUserInput {
	name?: string
	email?: string
	employeeId?: string
	hireDate?: string
	positionId?: number
	departmentId?: number
	managerId?: number
	employmentType?: string
	status?: string
	phone?: string
	address?: string
	birthDate?: string
	emergencyContact?: any
	salary?: number
}

export interface UserFilters {
	departmentId?: number
	positionId?: number
	status?: string
	managerId?: number
	employmentType?: string
	search?: string
}

/**
 * Servicio de usuarios con operaciones CRUD
 */
export class UsersService {
	/**
	 * Obtener todos los usuarios con filtros opcionales
	 */
	/**
	 * Transformar null a undefined para campos opcionales
	 */
	private static transformUserData(user: any): any {
		const transformed = { ...user }
		// Convertir null a undefined para campos opcionales
		const optionalFields = ['employeeId', 'hireDate', 'positionId', 'departmentId', 'managerId', 
			'employmentType', 'status', 'phone', 'address', 'birthDate', 'emergencyContact', 'salary', 'updatedAt']
		
		for (const field of optionalFields) {
			if (transformed[field] === null) {
				delete transformed[field]
			}
		}
		
		return transformed
	}

	static async getAllUsers(filters?: UserFilters) {
		try {
			let allUsers
			
			if (filters) {
				const conditions = []
				
				if (filters.departmentId) {
					conditions.push(eq(users.departmentId, filters.departmentId))
				}
				if (filters.positionId) {
					conditions.push(eq(users.positionId, filters.positionId))
				}
				if (filters.status) {
					conditions.push(eq(users.status, filters.status))
				}
				if (filters.managerId) {
					conditions.push(eq(users.managerId, filters.managerId))
				}
				if (filters.employmentType) {
					conditions.push(eq(users.employmentType, filters.employmentType))
				}
				if (filters.search) {
					conditions.push(
						or(
							like(users.name, `%${filters.search}%`),
							like(users.email, `%${filters.search}%`),
							like(users.employeeId, `%${filters.search}%`)
						)!
					)
				}
				
				if (conditions.length > 0) {
					allUsers = await db.select().from(users).where(and(...conditions))
				} else {
					allUsers = await db.select().from(users)
				}
			} else {
				allUsers = await db.select().from(users)
			}
			
			// Transformar null a undefined para validación de Elysia
			return allUsers.map(user => this.transformUserData(user))
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
			
			return this.transformUserData(user[0]!)
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
			
			return this.transformUserData(user[0]!)
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

			// Verificar si employeeId ya existe (si se proporciona)
			if (data.employeeId) {
				const existingEmployee = await db
					.select()
					.from(users)
					.where(eq(users.employeeId, data.employeeId))
				
				if (existingEmployee.length > 0) {
					throw new Error(`El ID de empleado ${data.employeeId} ya está registrado`)
				}
			}

			// Validar que manager existe si se proporciona
			if (data.managerId) {
				await this.getUserById(data.managerId)
			}

			const insertData: any = {
				name: data.name,
				email: data.email,
				updatedAt: new Date(),
			}

			// Agregar campos HR opcionales
			if (data.employeeId) insertData.employeeId = data.employeeId
			if (data.hireDate) insertData.hireDate = new Date(data.hireDate)
			if (data.positionId) insertData.positionId = data.positionId
			if (data.departmentId) insertData.departmentId = data.departmentId
			if (data.managerId) insertData.managerId = data.managerId
			if (data.employmentType) insertData.employmentType = data.employmentType
			if (data.status) insertData.status = data.status
			if (data.phone) insertData.phone = data.phone
			if (data.address) insertData.address = data.address
			if (data.birthDate) insertData.birthDate = new Date(data.birthDate)
			if (data.emergencyContact) insertData.emergencyContact = data.emergencyContact
			if (data.salary !== undefined) insertData.salary = data.salary.toString()

			const result = await db.insert(users).values(insertData).returning()

			return this.transformUserData(result[0]!)
		} catch (error: any) {
			throw new Error(`Error al crear usuario: ${error.message || error}`)
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

			// Verificar employeeId si se proporciona
			if (data.employeeId) {
				const existingEmployee = await db
					.select()
					.from(users)
					.where(eq(users.employeeId, data.employeeId))
				
				if (existingEmployee.length > 0 && existingEmployee[0]?.id !== id) {
					throw new Error(`El ID de empleado ${data.employeeId} ya está registrado`)
				}
			}

			// Validar que manager existe y no es el mismo usuario (evitar ciclos)
			if (data.managerId !== undefined) {
				if (data.managerId === id) {
					throw new Error('Un usuario no puede ser su propio manager')
				}
				if (data.managerId !== null) {
					await this.getUserById(data.managerId)
					// Verificar que no se crea un ciclo
					const wouldCreateCycle = await this.wouldCreateCycle(id, data.managerId)
					if (wouldCreateCycle) {
						throw new Error('No se puede asignar este manager: crearía un ciclo en la jerarquía')
					}
				}
			}

			const updateData: any = {
				updatedAt: new Date(),
			}
			
			if (data.name) updateData.name = data.name
			if (data.email) updateData.email = data.email
			if (data.employeeId !== undefined) updateData.employeeId = data.employeeId
			if (data.hireDate) updateData.hireDate = new Date(data.hireDate)
			if (data.positionId !== undefined) updateData.positionId = data.positionId
			if (data.departmentId !== undefined) updateData.departmentId = data.departmentId
			if (data.managerId !== undefined) updateData.managerId = data.managerId
			if (data.employmentType !== undefined) updateData.employmentType = data.employmentType
			if (data.status !== undefined) updateData.status = data.status
			if (data.phone !== undefined) updateData.phone = data.phone
			if (data.address !== undefined) updateData.address = data.address
			if (data.birthDate) updateData.birthDate = new Date(data.birthDate)
			if (data.emergencyContact !== undefined) updateData.emergencyContact = data.emergencyContact
			if (data.salary !== undefined) updateData.salary = data.salary.toString()

			const result = await db
				.update(users)
				.set(updateData)
				.where(eq(users.id, id))
				.returning()

			return this.transformUserData(result[0]!)
		} catch (error: any) {
			throw new Error(`Error al actualizar usuario: ${error.message || error}`)
		}
	}

	/**
	 * Verificar si asignar un manager crearía un ciclo
	 */
	private static async wouldCreateCycle(userId: number, managerId: number): Promise<boolean> {
		// Si el manager es null, no hay ciclo
		if (!managerId) return false
		
		// Obtener todos los ancestros del manager (hacia arriba en la jerarquía)
		const ancestors = await this.getAncestors(managerId)
		
		// Si el usuario está en los ancestros del manager, sería un ciclo
		return ancestors.some(a => a.id === userId)
	}

	/**
	 * Obtener todos los ancestros (managers superiores) de un usuario
	 */
	static async getAncestors(userId: number) {
		try {
			const ancestors: any[] = []
			let currentUserId: number | null = userId
			
			// Seguir la cadena de managers hacia arriba
			while (currentUserId) {
				const user = await db
					.select()
					.from(users)
					.where(eq(users.id, currentUserId))
				
				if (user.length === 0 || !user[0]?.managerId) {
					break
				}
				
				const manager = await db
					.select()
					.from(users)
					.where(eq(users.id, user[0].managerId!))
				
				if (manager.length > 0 && manager[0]) {
					ancestors.push(this.transformUserData(manager[0]))
					currentUserId = manager[0].managerId || null
				} else {
					break
				}
			}
			
			return ancestors
		} catch (error) {
			throw new Error(`Error al obtener ancestros: ${error}`)
		}
	}

	/**
	 * Obtener todos los subordinados (directos e indirectos) de un usuario
	 */
		static async getSubordinates(userId: number, includeIndirect = true) {
		try {
			if (!includeIndirect) {
				// Solo subordinados directos
				const directSubordinates = await db
					.select()
					.from(users)
					.where(eq(users.managerId, userId))
				return directSubordinates.map(user => this.transformUserData(user))
			}

			// Subordinados directos e indirectos usando recursión
			const allSubordinates: any[] = []
			const directSubordinates = await db
				.select()
				.from(users)
				.where(eq(users.managerId, userId))
			
			for (const subordinate of directSubordinates) {
				allSubordinates.push(this.transformUserData(subordinate))
				// Recursivamente obtener subordinados de cada subordinado
				const indirect = await this.getSubordinates(subordinate.id, true)
				allSubordinates.push(...indirect)
			}
			
			return allSubordinates
		} catch (error) {
			throw new Error(`Error al obtener subordinados: ${error}`)
		}
	}

	/**
	 * Obtener jerarquía completa (manager y subordinados)
	 */
	static async getHierarchy(userId: number) {
		try {
			const user = await this.getUserById(userId)
			const manager = user.managerId ? await this.getUserById(user.managerId) : null
			const subordinates = await this.getSubordinates(userId, true)
			
			return {
				user,
				manager,
				subordinates,
			}
		} catch (error) {
			throw new Error(`Error al obtener jerarquía: ${error}`)
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
			
			return this.transformUserData(result[0]!)
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
