import { db } from '../../db.js'
import { positions } from './schema.js'
import { eq } from 'drizzle-orm'

export interface CreatePositionInput {
	title: string
	description?: string
	departmentId?: number
	level?: number
}

export interface UpdatePositionInput {
	title?: string
	description?: string
	departmentId?: number
	level?: number
}

/**
 * Servicio de puestos con operaciones CRUD
 */
export class PositionsService {
	/**
	 * Obtener todos los puestos
	 */
	static async getAllPositions() {
		try {
			const allPositions = await db.select().from(positions)
			return allPositions
		} catch (error) {
			throw new Error(`Error al obtener puestos: ${error}`)
		}
	}

	/**
	 * Obtener un puesto por ID
	 */
	static async getPositionById(id: number) {
		try {
			const position = await db.select().from(positions).where(eq(positions.id, id))
			
			if (position.length === 0) {
				throw new Error(`Puesto con ID ${id} no encontrado`)
			}
			
			return position[0]!
		} catch (error) {
			throw new Error(`Error al obtener puesto: ${error}`)
		}
	}

	/**
	 * Crear un nuevo puesto
	 */
	static async createPosition(data: CreatePositionInput) {
		try {
			const result = await db.insert(positions).values({
				title: data.title,
				description: data.description,
				departmentId: data.departmentId,
				level: data.level,
				updatedAt: new Date(),
			}).returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al crear puesto: ${error.message || error}`)
		}
	}

	/**
	 * Actualizar un puesto
	 */
	static async updatePosition(id: number, data: UpdatePositionInput) {
		try {
			// Verificar que el puesto existe
			await this.getPositionById(id)

			const updateData: any = {
				updatedAt: new Date(),
			}
			
			if (data.title) updateData.title = data.title
			if (data.description !== undefined) updateData.description = data.description
			if (data.departmentId !== undefined) updateData.departmentId = data.departmentId
			if (data.level !== undefined) updateData.level = data.level

			const result = await db
				.update(positions)
				.set(updateData)
				.where(eq(positions.id, id))
				.returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al actualizar puesto: ${error.message || error}`)
		}
	}

	/**
	 * Eliminar un puesto
	 */
	static async deletePosition(id: number) {
		try {
			// Verificar que el puesto existe
			await this.getPositionById(id)

			const result = await db.delete(positions).where(eq(positions.id, id)).returning()
			
			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al eliminar puesto: ${error.message || error}`)
		}
	}
}

