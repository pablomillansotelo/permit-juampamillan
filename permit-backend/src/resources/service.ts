import { db } from '../db.js'
import { resources } from './schema.js'
import { eq } from 'drizzle-orm'

export interface CreateResourceInput {
	name: string
	description?: string
}

export interface UpdateResourceInput {
	name?: string
	description?: string
}

/**
 * Servicio de recursos con operaciones CRUD
 */
export class ResourcesService {
	/**
	 * Obtener todos los recursos
	 */
	static async getAllResources() {
		try {
			const allResources = await db.select().from(resources)
			return allResources
		} catch (error) {
			throw new Error(`Error al obtener recursos: ${error}`)
		}
	}

	/**
	 * Obtener un recurso por ID
	 */
	static async getResourceById(id: number) {
		try {
			const resource = await db.select().from(resources).where(eq(resources.id, id))
			
			if (resource.length === 0) {
				throw new Error(`Recurso con ID ${id} no encontrado`)
			}
			
			return resource[0]!
		} catch (error) {
			throw new Error(`Error al obtener recurso: ${error}`)
		}
	}

	/**
	 * Obtener un recurso por nombre
	 */
	static async getResourceByName(name: string) {
		try {
			const resource = await db.select().from(resources).where(eq(resources.name, name))
			
			if (resource.length === 0) {
				return null
			}
			
			return resource[0]
		} catch (error) {
			throw new Error(`Error al obtener recurso por nombre: ${error}`)
		}
	}

	/**
	 * Crear un nuevo recurso
	 */
	static async createResource(data: CreateResourceInput) {
		try {
			// Verificar si el nombre ya existe
			const existingResource = await this.getResourceByName(data.name)
			if (existingResource) {
				throw new Error(`El recurso ${data.name} ya existe`)
			}

			const result = await db.insert(resources).values({
				name: data.name,
				description: data.description || null,
			}).returning()

			return result[0]!
		} catch (error) {
			throw new Error(`Error al crear recurso: ${error}`)
		}
	}

	/**
	 * Actualizar un recurso
	 */
	static async updateResource(id: number, data: UpdateResourceInput) {
		try {
			// Verificar que el recurso existe
			await this.getResourceById(id)

			// Si se intenta cambiar el nombre, verificar que no exista
			if (data.name) {
				const existingResource = await db
					.select()
					.from(resources)
					.where(eq(resources.name, data.name))
				
				if (existingResource.length > 0 && existingResource[0]?.id !== id) {
					throw new Error(`El recurso ${data.name} ya existe`)
				}
			}

			const updateData: any = {
				updatedAt: new Date(),
			}
			if (data.name) updateData.name = data.name
			if (data.description !== undefined) updateData.description = data.description

			const result = await db
				.update(resources)
				.set(updateData)
				.where(eq(resources.id, id))
				.returning()

			return result[0]!
		} catch (error) {
			throw new Error(`Error al actualizar recurso: ${error}`)
		}
	}

	/**
	 * Eliminar un recurso
	 */
	static async deleteResource(id: number) {
		try {
			// Verificar que el recurso existe
			await this.getResourceById(id)

			const result = await db.delete(resources).where(eq(resources.id, id)).returning()
			
			return result[0]!
		} catch (error) {
			throw new Error(`Error al eliminar recurso: ${error}`)
		}
	}
}

