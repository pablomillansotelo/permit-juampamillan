import { db } from '../../db.js'
import { evaluationScores } from '../evaluation-scores/schema.js'
import { performanceIndicators } from '../indicators/schema.js'
import { employeeIndicators } from '../employee-indicators/schema.js'
import { eq, and, desc } from 'drizzle-orm'
import { evaluations as evaluationsTable } from './schema.js'

export interface CreateEvaluationInput {
	userId: number
	evaluatorId: number
	periodType: 'monthly' | 'quarterly' | 'annual'
	periodStart: string
	periodEnd: string
	comments?: string
	scores?: Array<{
		indicatorId: number
		value: number
		targetValue?: number
		notes?: string
	}>
}

export interface UpdateEvaluationInput {
	status?: 'draft' | 'submitted' | 'reviewed' | 'finalized'
	overallScore?: number
	comments?: string
	scores?: Array<{
		indicatorId: number
		value: number
		targetValue?: number
		notes?: string
	}>
}

/**
 * Servicio de Evaluaciones de Performance
 */
export class EvaluationsService {
	/**
	 * Calcular porcentaje de logro
	 */
	private static calculateAchievementPercentage(value: number, targetValue: number | null | undefined): number | null {
		if (!targetValue || targetValue === 0) return null
		return Number(((value / Number(targetValue)) * 100).toFixed(2))
	}

	/**
	 * Calcular score general ponderado
	 */
	private static calculateOverallScore(scores: Array<{ value: number; weight: number; targetValue?: number | null }>): number {
		if (scores.length === 0) return 0

		let totalWeight = 0
		let weightedSum = 0

		for (const score of scores) {
			const weight = Number(score.weight) || 1
			const value = Number(score.value)
			const targetValue = score.targetValue ? Number(score.targetValue) : null

			// Si hay target, calcular porcentaje de logro
			// Si no, usar el valor directamente
			const normalizedValue = targetValue && targetValue > 0
				? (value / targetValue) * 100
				: value

			weightedSum += normalizedValue * weight
			totalWeight += weight
		}

		return totalWeight > 0 ? Number((weightedSum / totalWeight).toFixed(2)) : 0
	}

	/**
	 * Obtener todas las evaluaciones
	 */
	static async getAllEvaluations(filters?: {
		userId?: number
		evaluatorId?: number
		status?: string
		periodType?: string
	}) {
		try {
			let query = db.select().from(evaluationsTable)

			const conditions = []
			if (filters?.userId) {
				conditions.push(eq(evaluationsTable.userId, filters.userId))
			}
			if (filters?.evaluatorId) {
				conditions.push(eq(evaluationsTable.evaluatorId, filters.evaluatorId))
			}
			if (filters?.status) {
				conditions.push(eq(evaluationsTable.status, filters.status))
			}
			if (filters?.periodType) {
				conditions.push(eq(evaluationsTable.periodType, filters.periodType))
			}

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any
			}

			return await query.orderBy(desc(evaluationsTable.createdAt))
		} catch (error: any) {
			throw new Error(`Error al obtener evaluaciones: ${error.message || error}`)
		}
	}

	/**
	 * Obtener una evaluación por ID con sus scores
	 */
	static async getEvaluationById(id: number) {
		try {
			const evaluation = await db
				.select()
				.from(evaluationsTable)
				.where(eq(evaluationsTable.id, id))

			if (evaluation.length === 0) {
				throw new Error('Evaluación no encontrada')
			}

			const scores = await db
				.select({
					id: evaluationScores.id,
					indicatorId: evaluationScores.indicatorId,
					value: evaluationScores.value,
					targetValue: evaluationScores.targetValue,
					achievementPercentage: evaluationScores.achievementPercentage,
					notes: evaluationScores.notes,
					indicator: {
						id: performanceIndicators.id,
						name: performanceIndicators.name,
						type: performanceIndicators.type,
						unit: performanceIndicators.unit,
						weight: performanceIndicators.weight,
					},
				})
				.from(evaluationScores)
				.innerJoin(performanceIndicators, eq(evaluationScores.indicatorId, performanceIndicators.id))
				.where(eq(evaluationScores.evaluationId, id))

			return {
				...evaluation[0]!,
				scores,
			}
		} catch (error: any) {
			throw new Error(`Error al obtener evaluación: ${error.message || error}`)
		}
	}

	/**
	 * Crear una nueva evaluación
	 */
	static async createEvaluation(data: CreateEvaluationInput) {
		try {
			// Verificar que el usuario tiene indicadores asignados
			const userIndicators = await db
				.select()
				.from(employeeIndicators)
				.where(and(
					eq(employeeIndicators.userId, data.userId),
					eq(employeeIndicators.isActive, true)
				))

			if (userIndicators.length === 0) {
				throw new Error('El usuario no tiene indicadores asignados')
			}

			// Crear evaluación
			const evaluationResult = await db
				.insert(evaluationsTable)
				.values({
					userId: data.userId,
					evaluatorId: data.evaluatorId,
					periodType: data.periodType,
					periodStart: data.periodStart,
					periodEnd: data.periodEnd,
					status: 'draft',
					comments: data.comments,
					updatedAt: new Date(),
				})
				.returning()

			if (evaluationResult.length === 0 || !evaluationResult[0]) {
				throw new Error('Error al crear la evaluación')
			}

			const evaluation = evaluationResult[0]

			// Crear scores si se proporcionan
			if (data.scores && data.scores.length > 0) {
				const scoresToInsert = []
				const indicatorWeights: Record<number, number> = {}

				// Obtener pesos de los indicadores
				for (const score of data.scores) {
					const indicator = await db
						.select()
						.from(performanceIndicators)
						.where(eq(performanceIndicators.id, score.indicatorId))

					if (indicator.length > 0) {
						indicatorWeights[score.indicatorId] = Number(indicator[0]!.weight) || 1
					}
				}

				for (const score of data.scores) {
					const indicator = await db
						.select()
						.from(performanceIndicators)
						.where(eq(performanceIndicators.id, score.indicatorId))

					if (indicator.length === 0) {
						throw new Error(`Indicador ${score.indicatorId} no encontrado`)
					}

					const targetValue = score.targetValue ?? (indicator[0]!.targetValue ? Number(indicator[0]!.targetValue) : null)
					const achievementPercentage = this.calculateAchievementPercentage(score.value, targetValue)

					scoresToInsert.push({
						evaluationId: evaluation.id,
						indicatorId: score.indicatorId,
						value: score.value.toString(),
						targetValue: targetValue?.toString(),
						achievementPercentage: achievementPercentage?.toString(),
						notes: score.notes,
					})
				}

				await db.insert(evaluationScores).values(scoresToInsert)

				// Calcular score general
				const allScores = await db
					.select({
						value: evaluationScores.value,
						weight: performanceIndicators.weight,
						targetValue: evaluationScores.targetValue,
					})
					.from(evaluationScores)
					.innerJoin(performanceIndicators, eq(evaluationScores.indicatorId, performanceIndicators.id))
					.where(eq(evaluationScores.evaluationId, evaluation.id))

				const overallScore = this.calculateOverallScore(
					allScores.map(s => ({
						value: Number(s.value),
						weight: Number(s.weight) || 1,
						targetValue: s.targetValue ? Number(s.targetValue) : null,
					}))
				)

				await db
					.update(evaluationsTable)
					.set({ overallScore: overallScore.toString(), updatedAt: new Date() })
					.where(eq(evaluationsTable.id, evaluation.id))
			}

			return await this.getEvaluationById(evaluation.id)
		} catch (error: any) {
			throw new Error(`Error al crear evaluación: ${error.message || error}`)
		}
	}

	/**
	 * Actualizar una evaluación
	 */
	static async updateEvaluation(id: number, data: UpdateEvaluationInput) {
		try {
			const updateData: any = {}
			if (data.status !== undefined) updateData.status = data.status
			if (data.overallScore !== undefined) updateData.overallScore = data.overallScore.toString()
			if (data.comments !== undefined) updateData.comments = data.comments
			updateData.updatedAt = new Date()

			// Actualizar scores si se proporcionan
			if (data.scores && data.scores.length > 0) {
				// Eliminar scores existentes
				await db.delete(evaluationScores).where(eq(evaluationScores.evaluationId, id))

				// Insertar nuevos scores
				const scoresToInsert = []
				for (const score of data.scores) {
					const indicator = await db
						.select()
						.from(performanceIndicators)
						.where(eq(performanceIndicators.id, score.indicatorId))

					if (indicator.length === 0) {
						throw new Error(`Indicador ${score.indicatorId} no encontrado`)
					}

					const targetValue = score.targetValue ?? (indicator[0]!.targetValue ? Number(indicator[0]!.targetValue) : null)
					const achievementPercentage = this.calculateAchievementPercentage(score.value, targetValue)

					scoresToInsert.push({
						evaluationId: id,
						indicatorId: score.indicatorId,
						value: score.value.toString(),
						targetValue: targetValue?.toString(),
						achievementPercentage: achievementPercentage?.toString(),
						notes: score.notes,
					})
				}

				await db.insert(evaluationScores).values(scoresToInsert)

				// Recalcular score general
				const allScores = await db
					.select({
						value: evaluationScores.value,
						weight: performanceIndicators.weight,
						targetValue: evaluationScores.targetValue,
					})
					.from(evaluationScores)
					.innerJoin(performanceIndicators, eq(evaluationScores.indicatorId, performanceIndicators.id))
					.where(eq(evaluationScores.evaluationId, id))

				const overallScore = this.calculateOverallScore(
					allScores.map(s => ({
						value: Number(s.value),
						weight: Number(s.weight) || 1,
						targetValue: s.targetValue ? Number(s.targetValue) : null,
					}))
				)

				updateData.overallScore = overallScore.toString()
			}

			const result = await db
				.update(evaluationsTable)
				.set(updateData)
				.where(eq(evaluationsTable.id, id))
				.returning()

			if (result.length === 0) {
				throw new Error('Evaluación no encontrada')
			}

			return await this.getEvaluationById(id)
		} catch (error: any) {
			throw new Error(`Error al actualizar evaluación: ${error.message || error}`)
		}
	}

	/**
	 * Enviar evaluación para revisión
	 */
	static async submitEvaluation(id: number) {
		return await this.updateEvaluation(id, { status: 'submitted' })
	}

	/**
	 * Finalizar evaluación
	 */
	static async finalizeEvaluation(id: number) {
		return await this.updateEvaluation(id, { status: 'finalized' })
	}

	/**
	 * Obtener resumen de performance de un usuario
	 */
	static async getUserPerformanceSummary(userId: number, periodType?: string) {
		try {
			const conditions = [eq(evaluationsTable.userId, userId), eq(evaluationsTable.status, 'finalized')]
			if (periodType) {
				conditions.push(eq(evaluationsTable.periodType, periodType))
			}

			const allEvaluations = await db
				.select()
				.from(evaluationsTable)
				.where(and(...conditions))
				.orderBy(desc(evaluationsTable.periodEnd))

			// Calcular promedios y tendencias
			const scores = allEvaluations.map(e => Number(e.overallScore) || 0)
			const averageScore = scores.length > 0
				? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
				: 0

			return {
				totalEvaluations: allEvaluations.length,
				averageScore,
				latestScore: allEvaluations[0]?.overallScore ? Number(allEvaluations[0].overallScore) : null,
				evaluations: allEvaluations,
			}
		} catch (error: any) {
			throw new Error(`Error al obtener resumen de performance: ${error.message || error}`)
		}
	}
}

