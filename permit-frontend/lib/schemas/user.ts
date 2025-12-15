import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres'),
});

export type UserFormData = z.infer<typeof userSchema>;

