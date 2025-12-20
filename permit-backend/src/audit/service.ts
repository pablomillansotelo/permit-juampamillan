import { db } from '../db.js'
import { auditLogs } from './schema.js'
import { eq, and, desc, gte, lte } from 'drizzle-orm'

export interface CreateAuditLogInput {
	userId?: number | null
	action: string
	entityType: string
	entityId?: number | null
	changes?: {
		before?: any
		after?: any
	}
	ipAddress?: string
	userAgent?: string
	metadata?: any
}

export interface AuditLogFilters {
	userId?: number
	action?: string
	entityType?: string
	entityId?: number
	startDate?: string
	endDate?: string
	limit?: number
	offset?: number
}

/**
 * Servicio de Auditoría
 */
export class AuditService {
	/**
	 * Crear un log de auditoría
	 */
	static async createLog(data: CreateAuditLogInput) {
		try {
			const result = await db
				.insert(auditLogs)
				.values({
					userId: data.userId ?? null,
					action: data.action,
					entityType: data.entityType,
					entityId: data.entityId ?? null,
					changes: data.changes || {},
					ipAddress: data.ipAddress,
					userAgent: data.userAgent,
					metadata: data.metadata || {},
				})
				.returning()

			return result[0]!
		} catch (error: any) {
			// No fallar si hay error en auditoría (no debe afectar la operación principal)
			console.error('Error al crear log de auditoría:', error)
			return null
		}
	}

	/**
	 * Obtener logs de auditoría con filtros
	 */
	static async getLogs(filters: AuditLogFilters = {}) {
		try {
			let query = db.select().from(auditLogs)

			const conditions = []
			if (filters.userId) {
				conditions.push(eq(auditLogs.userId, filters.userId))
			}
			if (filters.action) {
				conditions.push(eq(auditLogs.action, filters.action))
			}
			if (filters.entityType) {
				conditions.push(eq(auditLogs.entityType, filters.entityType))
			}
			if (filters.entityId) {
				conditions.push(eq(auditLogs.entityId, filters.entityId))
			}
			if (filters.startDate) {
				conditions.push(gte(auditLogs.createdAt, new Date(filters.startDate)) as any)
			}
			if (filters.endDate) {
				conditions.push(lte(auditLogs.createdAt, new Date(filters.endDate)) as any)
			}

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any
			}

			const limit = filters.limit || 100
			const offset = filters.offset || 0

			return await query
				.orderBy(desc(auditLogs.createdAt))
				.limit(limit)
				.offset(offset)
		} catch (error: any) {
			throw new Error(`Error al obtener logs de auditoría: ${error.message || error}`)
		}
	}

	/**
	 * Obtener logs de una entidad específica
	 */
	static async getEntityLogs(entityType: string, entityId: number, limit: number = 50) {
		try {
			return await db
				.select()
				.from(auditLogs)
				.where(and(eq(auditLogs.entityType, entityType), eq(auditLogs.entityId, entityId)))
				.orderBy(desc(auditLogs.createdAt))
				.limit(limit)
		} catch (error: any) {
			throw new Error(`Error al obtener logs de entidad: ${error.message || error}`)
		}
	}

	/**
	 * Obtener logs de un usuario
	 */
	static async getUserLogs(userId: number, limit: number = 100) {
		try {
			return await db
				.select()
				.from(auditLogs)
				.where(eq(auditLogs.userId, userId))
				.orderBy(desc(auditLogs.createdAt))
				.limit(limit)
		} catch (error: any) {
			throw new Error(`Error al obtener logs de usuario: ${error.message || error}`)
		}
	}

	/**
	 * Obtener contador de logs (útil para paginación)
	 */
	static async getLogsCount(filters: AuditLogFilters = {}) {
		try {
			let query = db.select().from(auditLogs)

			const conditions = []
			if (filters.userId) {
				conditions.push(eq(auditLogs.userId, filters.userId))
			}
			if (filters.action) {
				conditions.push(eq(auditLogs.action, filters.action))
			}
			if (filters.entityType) {
				conditions.push(eq(auditLogs.entityType, filters.entityType))
			}
			if (filters.entityId) {
				conditions.push(eq(auditLogs.entityId, filters.entityId))
			}

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any
			}

			const result = await query
			return result.length
		} catch (error: any) {
			throw new Error(`Error al contar logs: ${error.message || error}`)
		}
	}
}

/**
 * Helper para crear logs de auditoría automáticamente
 */
export async function auditLog(
	action: string,
	entityType: string,
	options: {
		userId?: number | null
		entityId?: number | null
		before?: any
		after?: any
		ipAddress?: string
		userAgent?: string
		metadata?: any
	}
) {
	const changes: any = {}
	if (options.before) changes.before = options.before
	if (options.after) changes.after = options.after

	return await AuditService.createLog({
		userId: options.userId ?? null,
		action,
		entityType,
		entityId: options.entityId ?? null,
		changes: Object.keys(changes).length > 0 ? changes : undefined,
		ipAddress: options.ipAddress,
		userAgent: options.userAgent,
		metadata: options.metadata,
	})
}

