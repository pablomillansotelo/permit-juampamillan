import { Elysia, t } from 'elysia'
import { LeaveRequestsService } from './service.js'

export const leaveRequests = new Elysia({ prefix: '/leave-requests' })
	.get('/', async ({ query }) => {
		try {
			const filters: any = {}
			if (query.user_id) filters.userId = Number(query.user_id)
			if (query.status) filters.status = query.status as string
			if (query.start_date) filters.startDate = query.start_date as string
			if (query.end_date) filters.endDate = query.end_date as string
			return await LeaveRequestsService.getAllLeaveRequests(filters)
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		query: t.Object({
			user_id: t.Optional(t.String()),
			status: t.Optional(t.String()),
			start_date: t.Optional(t.String()),
			end_date: t.Optional(t.String()),
		}),
		detail: {
			tags: ['leave-requests'],
			summary: 'Obtener todas las solicitudes de ausencia',
		},
	})
	.get('/:id', async ({ params }) => {
		try {
			return await LeaveRequestsService.getLeaveRequestById(Number(params.id))
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		detail: {
			tags: ['leave-requests'],
			summary: 'Obtener una solicitud de ausencia por ID',
		},
	})
	.post('/', async ({ body }) => {
		try {
			return await LeaveRequestsService.createLeaveRequest(body)
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		body: t.Object({
			userId: t.Number(),
			leaveTypeId: t.Number(),
			startDate: t.String(),
			endDate: t.String(),
			reason: t.Optional(t.String()),
		}),
		detail: {
			tags: ['leave-requests'],
			summary: 'Crear una nueva solicitud de ausencia',
		},
	})
	.put('/:id/approve', async ({ params, body }) => {
		try {
			return await LeaveRequestsService.approveLeaveRequest(Number(params.id), body.approvedBy)
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		body: t.Object({
			approvedBy: t.Number(),
		}),
		detail: {
			tags: ['leave-requests'],
			summary: 'Aprobar una solicitud de ausencia',
		},
	})
	.put('/:id/reject', async ({ params, body }) => {
		try {
			return await LeaveRequestsService.rejectLeaveRequest(Number(params.id), body.approvedBy, body.rejectionReason)
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		body: t.Object({
			approvedBy: t.Number(),
			rejectionReason: t.String(),
		}),
		detail: {
			tags: ['leave-requests'],
			summary: 'Rechazar una solicitud de ausencia',
		},
	})
	.compile()

