import { db } from '../../db.js'
import { departments } from './schema.js'
import { eq, and, or, like } from 'drizzle-orm'

export interface CreateDepartmentInput {
	name: string
	description?: string
	parentId?: number
	managerId?: number
}

export interface UpdateDepartmentInput {
	name?: string
	description?: string
	parentId?: number
	managerId?: number
}

/**
 * Servicio de departamentos con operaciones CRUD
 */
export class DepartmentsService {
	/**
	 * Obtener todos los departamentos
	 */
	static async getAllDepartments() {
		try {
			const allDepartments = await db.select().from(departments)
			return allDepartments
		} catch (error) {
			throw new Error(`Error al obtener departamentos: ${error}`)
		}
	}

	/**
	 * Obtener un departamento por ID
	 */
	static async getDepartmentById(id: number) {
		try {
			const dept = await db.select().from(departments).where(eq(departments.id, id))
			
			if (dept.length === 0) {
				throw new Error(`Departamento con ID ${id} no encontrado`)
			}
			
			return dept[0]!
		} catch (error) {
			throw new Error(`Error al obtener departamento: ${error}`)
		}
	}

	/**
	 * Crear un nuevo departamento
	 */
	static async createDepartment(data: CreateDepartmentInput) {
		try {
			// Verificar si el nombre ya existe
			const existing = await db
				.select()
				.from(departments)
				.where(eq(departments.name, data.name))
			
			if (existing.length > 0) {
				throw new Error(`El departamento ${data.name} ya existe`)
			}

			// Validar parentId si se proporciona
			if (data.parentId) {
				await this.getDepartmentById(data.parentId)
			}

			const result = await db.insert(departments).values({
				name: data.name,
				description: data.description,
				parentId: data.parentId,
				managerId: data.managerId,
				updatedAt: new Date(),
			}).returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al crear departamento: ${error.message || error}`)
		}
	}

	/**
	 * Actualizar un departamento
	 */
	static async updateDepartment(id: number, data: UpdateDepartmentInput) {
		try {
			// Verificar que el departamento existe
			await this.getDepartmentById(id)

			// Si se intenta cambiar el nombre, verificar que no exista
			if (data.name) {
				const existing = await db
					.select()
					.from(departments)
					.where(eq(departments.name, data.name))
				
				if (existing.length > 0 && existing[0]?.id !== id) {
					throw new Error(`El departamento ${data.name} ya existe`)
				}
			}

			// Validar parentId (no puede ser el mismo departamento)
			if (data.parentId !== undefined) {
				if (data.parentId === id) {
					throw new Error('Un departamento no puede ser su propio padre')
				}
				if (data.parentId !== null) {
					await this.getDepartmentById(data.parentId)
				}
			}

			const updateData: any = {
				updatedAt: new Date(),
			}
			
			if (data.name) updateData.name = data.name
			if (data.description !== undefined) updateData.description = data.description
			if (data.parentId !== undefined) updateData.parentId = data.parentId
			if (data.managerId !== undefined) updateData.managerId = data.managerId

			const result = await db
				.update(departments)
				.set(updateData)
				.where(eq(departments.id, id))
				.returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al actualizar departamento: ${error.message || error}`)
		}
	}

	/**
	 * Eliminar un departamento
	 */
	static async deleteDepartment(id: number) {
		try {
			// Verificar que el departamento existe
			await this.getDepartmentById(id)

			// Verificar que no tenga departamentos hijos
			const children = await db
				.select()
				.from(departments)
				.where(eq(departments.parentId, id))
			
			if (children.length > 0) {
				throw new Error('No se puede eliminar un departamento que tiene subdepartamentos')
			}

			const result = await db.delete(departments).where(eq(departments.id, id)).returning()
			
			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al eliminar departamento: ${error.message || error}`)
		}
	}
}

