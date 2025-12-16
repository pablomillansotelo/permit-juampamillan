import { Elysia, t } from 'elysia'
import { LeaveTypesService } from './service.js'

export const leaveTypes = new Elysia({ prefix: '/leave-types' })
	.get('/', async () => {
		try {
			return await LeaveTypesService.getAllLeaveTypes()
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		detail: {
			tags: ['leave-types'],
			summary: 'Obtener todos los tipos de ausencia',
		},
	})
	.get('/:id', async ({ params }) => {
		try {
			return await LeaveTypesService.getLeaveTypeById(Number(params.id))
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		detail: {
			tags: ['leave-types'],
			summary: 'Obtener un tipo de ausencia por ID',
		},
	})
	.post('/', async ({ body }) => {
		try {
			return await LeaveTypesService.createLeaveType(body)
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		body: t.Object({
			name: t.String(),
			code: t.String(),
			maxDaysPerYear: t.Optional(t.Number()),
			carryOverAllowed: t.Optional(t.Boolean()),
			requiresApproval: t.Optional(t.Boolean()),
			color: t.Optional(t.String()),
		}),
		detail: {
			tags: ['leave-types'],
			summary: 'Crear un nuevo tipo de ausencia',
		},
	})
	.put('/:id', async ({ params, body }) => {
		try {
			return await LeaveTypesService.updateLeaveType(Number(params.id), body)
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		body: t.Object({
			name: t.Optional(t.String()),
			code: t.Optional(t.String()),
			maxDaysPerYear: t.Optional(t.Number()),
			carryOverAllowed: t.Optional(t.Boolean()),
			requiresApproval: t.Optional(t.Boolean()),
			color: t.Optional(t.String()),
		}),
		detail: {
			tags: ['leave-types'],
			summary: 'Actualizar un tipo de ausencia',
		},
	})
	.delete('/:id', async ({ params }) => {
		try {
			const deleted = await LeaveTypesService.deleteLeaveType(Number(params.id))
			return { message: 'Tipo de ausencia eliminado exitosamente', leaveType: deleted }
		} catch (error: any) {
			throw new Error(error.message)
		}
	}, {
		detail: {
			tags: ['leave-types'],
			summary: 'Eliminar un tipo de ausencia',
		},
	})
	.compile()

