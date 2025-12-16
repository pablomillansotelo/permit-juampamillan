import { Elysia } from 'elysia'
import { indicators } from './indicators/router.js'
import { evaluations } from './evaluations/router.js'

/**
 * Router principal de Performance
 * Agrupa todos los endpoints relacionados con gestión de performance
 */
export const performance = new Elysia({ prefix: '/performance' })
	.use(indicators)
	.use(evaluations)

