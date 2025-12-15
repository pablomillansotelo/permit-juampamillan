'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormError } from '@/components/ui/form';
import { Role, rolesApi, CreateRoleInput, UpdateRoleInput } from '@/lib/api';
import { toast } from '@/lib/toast';
import { roleSchema, type RoleFormData } from '@/lib/schemas/role';

interface RoleFormProps {
  role?: Role | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoleForm({ role, onSuccess, onCancel }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
    },
  });

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (role) {
        const updateData: UpdateRoleInput = {
          name: data.name,
          description: data.description || undefined,
        };
        await rolesApi.update(role.id, updateData);
        toast.success('Rol actualizado', 'Los cambios se guardaron correctamente');
      } else {
        const createData: CreateRoleInput = {
          name: data.name,
          description: data.description || undefined,
        };
        await rolesApi.create(createData);
        toast.success('Rol creado', 'El rol se creó correctamente');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error al guardar rol:', error);
      toast.error('Error al guardar rol', error.message || 'No se pudo guardar el rol');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField>
        <Label htmlFor="name">Nombre del Rol *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ej: Administrador"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && <FormError>{errors.name.message}</FormError>}
      </FormField>

      <FormField>
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          {...register('description')}
          placeholder="Descripción del rol"
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && <FormError>{errors.description.message}</FormError>}
      </FormField>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : role ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

