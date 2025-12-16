import { db } from '../../db.js'
import { leaveTypes } from './schema.js'
import { eq } from 'drizzle-orm'

export interface CreateLeaveTypeInput {
	name: string
	code: string
	maxDaysPerYear?: number
	carryOverAllowed?: boolean
	requiresApproval?: boolean
	color?: string
}

export interface UpdateLeaveTypeInput {
	name?: string
	code?: string
	maxDaysPerYear?: number
	carryOverAllowed?: boolean
	requiresApproval?: boolean
	color?: string
}

export class LeaveTypesService {
	static async getAllLeaveTypes() {
		try {
			return await db.select().from(leaveTypes)
		} catch (error) {
			throw new Error(`Error al obtener tipos de ausencia: ${error}`)
		}
	}

	static async getLeaveTypeById(id: number) {
		try {
			const result = await db.select().from(leaveTypes).where(eq(leaveTypes.id, id))
			if (result.length === 0) {
				throw new Error(`Tipo de ausencia con ID ${id} no encontrado`)
			}
			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al obtener tipo de ausencia: ${error.message || error}`)
		}
	}

	static async createLeaveType(data: CreateLeaveTypeInput) {
		try {
			// Verificar que el código no exista
			const existing = await db
				.select()
				.from(leaveTypes)
				.where(eq(leaveTypes.code, data.code))
			
			if (existing.length > 0) {
				throw new Error(`El código ${data.code} ya existe`)
			}

			const result = await db.insert(leaveTypes).values({
				name: data.name,
				code: data.code,
				maxDaysPerYear: data.maxDaysPerYear,
				carryOverAllowed: data.carryOverAllowed ?? false,
				requiresApproval: data.requiresApproval ?? true,
				color: data.color,
			}).returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al crear tipo de ausencia: ${error.message || error}`)
		}
	}

	static async updateLeaveType(id: number, data: UpdateLeaveTypeInput) {
		try {
			await this.getLeaveTypeById(id)

			if (data.code) {
				const existing = await db
					.select()
					.from(leaveTypes)
					.where(eq(leaveTypes.code, data.code))
				
				if (existing.length > 0 && existing[0]?.id !== id) {
					throw new Error(`El código ${data.code} ya existe`)
				}
			}

			const updateData: any = {}
			if (data.name) updateData.name = data.name
			if (data.code) updateData.code = data.code
			if (data.maxDaysPerYear !== undefined) updateData.maxDaysPerYear = data.maxDaysPerYear
			if (data.carryOverAllowed !== undefined) updateData.carryOverAllowed = data.carryOverAllowed
			if (data.requiresApproval !== undefined) updateData.requiresApproval = data.requiresApproval
			if (data.color !== undefined) updateData.color = data.color

			const result = await db
				.update(leaveTypes)
				.set(updateData)
				.where(eq(leaveTypes.id, id))
				.returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al actualizar tipo de ausencia: ${error.message || error}`)
		}
	}

	static async deleteLeaveType(id: number) {
		try {
			await this.getLeaveTypeById(id)
			const result = await db.delete(leaveTypes).where(eq(leaveTypes.id, id)).returning()
			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al eliminar tipo de ausencia: ${error.message || error}`)
		}
	}
}

