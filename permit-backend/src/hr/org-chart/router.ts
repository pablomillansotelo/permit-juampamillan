import { Elysia, t } from 'elysia'
import { OrgChartService } from './service.js'
import { UsersModel } from '../../users/model.js'

export const orgChart = new Elysia({ prefix: '/org-chart' })
	/**
	 * GET /org-chart - Obtener árbol completo del organigrama
	 */
	.get(
		'/',
		async () => {
			try {
				const orgChart = await OrgChartService.getFullOrgChart()
				return orgChart
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Any(),
			detail: {
				tags: ['org-chart'],
				summary: 'Obtener árbol completo del organigrama',
			},
		}
	)

	/**
	 * GET /org-chart/:userId - Obtener subárbol desde un usuario
	 */
	.get(
		'/:userId',
		async ({ params }) => {
			try {
				const orgChart = await OrgChartService.getOrgChartFromUser(Number(params.userId))
				return orgChart
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Object({
				user: UsersModel.userResponse,
				subordinates: t.Array(t.Any()),
			}),
			detail: {
				tags: ['org-chart'],
				summary: 'Obtener subárbol desde un usuario',
			},
		}
	)

	/**
	 * GET /org-chart/flat - Obtener lista plana con niveles
	 */
	.get(
		'/flat',
		async () => {
			try {
				const flatChart = await OrgChartService.getFlatOrgChart()
				return flatChart
			} catch (error: any) {
				throw new Error(error.message)
			}
		},
		{
			response: t.Array(t.Any()),
			detail: {
				tags: ['org-chart'],
				summary: 'Obtener lista plana con niveles',
			},
		}
	)
	.compile()

