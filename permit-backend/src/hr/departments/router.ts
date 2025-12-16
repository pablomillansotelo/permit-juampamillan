import { Elysia, t } from 'elysia'
import { DepartmentsService } from './service.js'
import { DepartmentsModel } from './model.js'

export const departments = new Elysia({ prefix: '/departments' })
	/**
	 * GET /departments - Obtener todos los departamentos
	 */
	.get(
		'/',
		async () => {
			try {
				const allDepartments = await DepartmentsService.getAllDepartments()
				return allDepartments
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: DepartmentsModel.departmentsList,
			detail: {
				tags: ['departments'],
				summary: 'Obtener todos los departamentos',
			},
		}
	)

	/**
	 * GET /departments/:id - Obtener un departamento por ID
	 */
	.get(
		'/:id',
		async ({ params }) => {
			try {
				const dept = await DepartmentsService.getDepartmentById(Number(params.id))
				return dept
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: DepartmentsModel.departmentResponse,
			detail: {
				tags: ['departments'],
				summary: 'Obtener un departamento por ID',
			},
		}
	)

	/**
	 * POST /departments - Crear un nuevo departamento
	 */
	.post(
		'/',
		async ({ body }) => {
			try {
				const newDept = await DepartmentsService.createDepartment({
					name: body.name,
					description: body.description,
					parentId: body.parentId,
					managerId: body.managerId,
				})
				return newDept
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: DepartmentsModel.createBody,
			response: DepartmentsModel.departmentResponse,
			detail: {
				tags: ['departments'],
				summary: 'Crear un nuevo departamento',
			},
		}
	)

	/**
	 * PUT /departments/:id - Actualizar un departamento
	 */
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				const updatedDept = await DepartmentsService.updateDepartment(
					Number(params.id),
					body
				)
				return updatedDept
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			body: DepartmentsModel.updateBody,
			response: DepartmentsModel.departmentResponse,
			detail: {
				tags: ['departments'],
				summary: 'Actualizar un departamento',
			},
		}
	)

	/**
	 * DELETE /departments/:id - Eliminar un departamento
	 */
	.delete(
		'/:id',
		async ({ params }) => {
			try {
				const deletedDept = await DepartmentsService.deleteDepartment(Number(params.id))
				return {
					message: 'Departamento eliminado exitosamente',
					department: deletedDept
				}
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				message: t.String(),
				department: DepartmentsModel.departmentResponse
			}),
			detail: {
				tags: ['departments'],
				summary: 'Eliminar un departamento',
			},
		}
	)
	.compile()

