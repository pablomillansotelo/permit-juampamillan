import { db } from '../../db.js'
import { users } from '../../users/schema.js'
import { eq, sql } from 'drizzle-orm'

/**
 * Servicio de organigrama
 */
export class OrgChartService {
	/**
	 * Obtener árbol completo del organigrama
	 */
	static async getFullOrgChart() {
		try {
			// Obtener todos los usuarios con sus relaciones
			const allUsers = await db.select().from(users)
			
			// Construir árbol jerárquico
			const userMap = new Map()
			const rootUsers: any[] = []
			
			// Primero, crear un mapa de todos los usuarios
			for (const user of allUsers) {
				userMap.set(user.id, {
					...user,
					subordinates: [],
				})
			}
			
			// Luego, construir la jerarquía
			for (const user of allUsers) {
				const userNode = userMap.get(user.id)
				if (user.managerId) {
					const manager = userMap.get(user.managerId)
					if (manager) {
						manager.subordinates.push(userNode)
					} else {
						// Manager no encontrado, tratar como root
						rootUsers.push(userNode)
					}
				} else {
					// No tiene manager, es root
					rootUsers.push(userNode)
				}
			}
			
			return rootUsers
		} catch (error) {
			throw new Error(`Error al obtener organigrama: ${error}`)
		}
	}

	/**
	 * Obtener subárbol desde un usuario específico
	 */
	static async getOrgChartFromUser(userId: number) {
		try {
			const user = await db.select().from(users).where(eq(users.id, userId))
			
			if (user.length === 0) {
				throw new Error(`Usuario con ID ${userId} no encontrado`)
			}
			
			// Obtener todos los subordinados (directos e indirectos)
			const subordinates = await this.getSubordinatesRecursive(userId)
			
			return {
				user: user[0],
				subordinates,
			}
		} catch (error: any) {
			throw new Error(`Error al obtener organigrama: ${error.message || error}`)
		}
	}

	/**
	 * Obtener subordinados recursivamente
	 */
	private static async getSubordinatesRecursive(userId: number): Promise<any[]> {
		const directSubordinates = await db
			.select()
			.from(users)
			.where(eq(users.managerId, userId))
		
		const result: any[] = []
		
		for (const subordinate of directSubordinates) {
			const children = await this.getSubordinatesRecursive(subordinate.id)
			result.push({
				...subordinate,
				subordinates: children,
			})
		}
		
		return result
	}

	/**
	 * Obtener lista plana del organigrama con niveles
	 */
	static async getFlatOrgChart() {
		try {
			// Usar query recursiva SQL para obtener niveles
			const result = await db.execute(sql`
				WITH RECURSIVE org_tree AS (
					SELECT 
						id, 
						name, 
						email,
						manager_id, 
						0 as level,
						ARRAY[id] as path
					FROM users 
					WHERE manager_id IS NULL
					
					UNION ALL
					
					SELECT 
						u.id, 
						u.name, 
						u.email,
						u.manager_id, 
						ot.level + 1,
						ot.path || u.id
					FROM users u
					INNER JOIN org_tree ot ON u.manager_id = ot.id
					WHERE NOT u.id = ANY(ot.path)  -- Prevenir ciclos
				)
				SELECT * FROM org_tree
				ORDER BY level, name;
			`)
			
			return result.rows || []
		} catch (error) {
			throw new Error(`Error al obtener organigrama plano: ${error}`)
		}
	}
}

