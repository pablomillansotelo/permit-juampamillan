import { z } from 'zod';

export const permissionSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del permiso es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  action: z
    .string()
    .min(1, 'La acción es requerida')
    .max(50, 'La acción no puede exceder 50 caracteres'),
  resourceId: z
    .number()
    .int('El ID del recurso debe ser un número entero')
    .positive('Debes seleccionar un recurso'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type PermissionFormData = z.infer<typeof permissionSchema>;

