import { db } from '../../db.js'
import { leaveRequests } from './schema.js'
import { eq, and, gte, lte, sql } from 'drizzle-orm'
import { UsersService } from '../../users/service.js'

export interface CreateLeaveRequestInput {
	userId: number
	leaveTypeId: number
	startDate: string
	endDate: string
	reason?: string
}

export interface UpdateLeaveRequestInput {
	startDate?: string
	endDate?: string
	reason?: string
	status?: string
	rejectionReason?: string
}

export class LeaveRequestsService {
	/**
	 * Calcular días hábiles entre dos fechas (excluyendo fines de semana)
	 */
	static calculateBusinessDays(startDate: Date, endDate: Date): number {
		let count = 0
		const current = new Date(startDate)
		
		while (current <= endDate) {
			const dayOfWeek = current.getDay()
			if (dayOfWeek !== 0 && dayOfWeek !== 6) { // No es domingo (0) ni sábado (6)
				count++
			}
			current.setDate(current.getDate() + 1)
		}
		
		return count
	}

	static async getAllLeaveRequests(filters?: { userId?: number; status?: string; startDate?: string; endDate?: string }) {
		try {
			if (filters) {
				const conditions = []
				if (filters.userId) conditions.push(eq(leaveRequests.userId, filters.userId))
				if (filters.status) conditions.push(eq(leaveRequests.status, filters.status))
				if (filters.startDate) conditions.push(gte(leaveRequests.startDate, filters.startDate))
				if (filters.endDate) conditions.push(lte(leaveRequests.endDate, filters.endDate))
				
				if (conditions.length > 0) {
					return await db.select().from(leaveRequests).where(and(...conditions))
				}
			}
			
			return await db.select().from(leaveRequests)
		} catch (error) {
			throw new Error(`Error al obtener solicitudes: ${error}`)
		}
	}

	static async getLeaveRequestById(id: number) {
		try {
			const result = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id))
			if (result.length === 0) {
				throw new Error(`Solicitud con ID ${id} no encontrada`)
			}
			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al obtener solicitud: ${error.message || error}`)
		}
	}

	static async createLeaveRequest(data: CreateLeaveRequestInput) {
		try {
			const startDate = new Date(data.startDate)
			const endDate = new Date(data.endDate)
			
			if (endDate < startDate) {
				throw new Error('La fecha de fin debe ser posterior a la fecha de inicio')
			}

			const daysCount = this.calculateBusinessDays(startDate, endDate)
			
			// Verificar solapamiento con otras solicitudes aprobadas
			const overlapping = await db.execute(sql`
				SELECT * FROM leave_requests 
				WHERE user_id = ${data.userId}
				AND status = 'approved'
				AND (
					(start_date >= ${data.startDate} AND start_date <= ${data.endDate})
					OR (end_date >= ${data.startDate} AND end_date <= ${data.endDate})
					OR (start_date <= ${data.startDate} AND end_date >= ${data.endDate})
				)
			`)
			
			if (overlapping.rows && overlapping.rows.length > 0) {
				throw new Error('Ya existe una solicitud aprobada que se solapa con estas fechas')
			}

			const result = await db.insert(leaveRequests).values({
				userId: data.userId,
				leaveTypeId: data.leaveTypeId,
				startDate: data.startDate,
				endDate: data.endDate,
				daysCount,
				reason: data.reason,
				status: 'pending',
				updatedAt: new Date(),
			}).returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al crear solicitud: ${error.message || error}`)
		}
	}

	static async approveLeaveRequest(id: number, approvedBy: number) {
		try {
			const request = await this.getLeaveRequestById(id)
			
			if (request.status !== 'pending') {
				throw new Error('Solo se pueden aprobar solicitudes pendientes')
			}

			// Verificar que el aprobador es el manager del usuario
			const user = await UsersService.getUserById(request.userId)
			if (user.managerId !== approvedBy) {
				throw new Error('Solo el manager directo puede aprobar la solicitud')
			}

			const result = await db
				.update(leaveRequests)
				.set({
					status: 'approved',
					approvedBy,
					approvedAt: new Date(),
					updatedAt: new Date(),
				})
				.where(eq(leaveRequests.id, id))
				.returning()

			// Actualizar saldo de ausencias
			// TODO: Implementar actualización de leave-balances

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al aprobar solicitud: ${error.message || error}`)
		}
	}

	static async rejectLeaveRequest(id: number, approvedBy: number, rejectionReason: string) {
		try {
			const request = await this.getLeaveRequestById(id)
			
			if (request.status !== 'pending') {
				throw new Error('Solo se pueden rechazar solicitudes pendientes')
			}

			const result = await db
				.update(leaveRequests)
				.set({
					status: 'rejected',
					approvedBy,
					approvedAt: new Date(),
					rejectionReason,
					updatedAt: new Date(),
				})
				.where(eq(leaveRequests.id, id))
				.returning()

			return result[0]!
		} catch (error: any) {
			throw new Error(`Error al rechazar solicitud: ${error.message || error}`)
		}
	}
}

