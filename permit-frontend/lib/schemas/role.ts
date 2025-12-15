import { z } from 'zod';

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del rol es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type RoleFormData = z.infer<typeof roleSchema>;

