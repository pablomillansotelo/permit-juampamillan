import { db } from '../../db.js'
import { performanceIndicators } from './schema.js'
import { eq, and } from 'drizzle-orm'

export interface CreateIndicatorInput {
	name: string
	description?: string
	type: 'numeric' | 'percentage' | 'boolean' | 'text'
	unit?: string
	targetValue?: number
	weight?: number
	category?: string
	isActive?: boolean
}

export interface UpdateIndicatorInput {
	name?: string
	description?: string
	type?: 'numeric' | 'percentage' | 'boolean' | 'text'
	unit?: string
	targetValue?: number
	weight?: number
	category?: string
	isActive?: boolean
}

/**
 * Servicio de Indicadores de Performance
 */
export class IndicatorsService {
	/**
	 * Obtener todos los indicadores
	 */
	static async getAllIndicators(activeOnly: boolean = false) {
		try {
			if (activeOnly) {
				return await db
					.select()
					.from(performanceIndicators)
					.where(eq(performanceIndicators.isActive, true))
			}
			return await db.select().from(performanceIndicators)
		} catch (error: any) {
			throw new Error(`Error al obtener indicadores: ${error.message || error}`)
		}
	}

	/**
	 * Obtener un indicador por ID
	 */
	static async getIndicatorById(id: number) {
		try {
			const result = await db
				.select()
				.from(performanceIndicators)
				.where(eq(performanceIndicators.id, id))

			if (result.length === 0) {
				throw new Error('Indicador no encontrado')
			}

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al obtener indicador: ${error.message || error}`)
		}
	}

	/**
	 * Crear un nuevo indicador
	 */
	static async createIndicator(data: CreateIndicatorInput) {
		try {
			const result = await db
				.insert(performanceIndicators)
				.values({
					name: data.name,
					description: data.description,
					type: data.type,
					unit: data.unit,
					targetValue: data.targetValue?.toString(),
					weight: data.weight?.toString() || '1.00',
					category: data.category,
					isActive: data.isActive ?? true,
					updatedAt: new Date(),
				})
				.returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al crear indicador: ${error.message || error}`)
		}
	}

	/**
	 * Actualizar un indicador
	 */
	static async updateIndicator(id: number, data: UpdateIndicatorInput) {
		try {
			const updateData: any = {}
			if (data.name !== undefined) updateData.name = data.name
			if (data.description !== undefined) updateData.description = data.description
			if (data.type !== undefined) updateData.type = data.type
			if (data.unit !== undefined) updateData.unit = data.unit
			if (data.targetValue !== undefined) updateData.targetValue = data.targetValue.toString()
			if (data.weight !== undefined) updateData.weight = data.weight.toString()
			if (data.category !== undefined) updateData.category = data.category
			if (data.isActive !== undefined) updateData.isActive = data.isActive
			updateData.updatedAt = new Date()

			const result = await db
				.update(performanceIndicators)
				.set(updateData)
				.where(eq(performanceIndicators.id, id))
				.returning()

			if (result.length === 0) {
				throw new Error('Indicador no encontrado')
			}

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al actualizar indicador: ${error.message || error}`)
		}
	}

	/**
	 * Eliminar un indicador (soft delete)
	 */
	static async deleteIndicator(id: number) {
		try {
			const result = await db
				.update(performanceIndicators)
				.set({ isActive: false, updatedAt: new Date() })
				.where(eq(performanceIndicators.id, id))
				.returning()

			if (result.length === 0) {
				throw new Error('Indicador no encontrado')
			}

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al eliminar indicador: ${error.message || error}`)
		}
	}
}

