'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormError } from '@/components/ui/form';
import {
  Permission,
  Resource,
  permissionsApi,
  CreatePermissionInput,
  UpdatePermissionInput
} from '@/lib/api';
import { toast } from '@/lib/toast';
import { permissionSchema, type PermissionFormData } from '@/lib/schemas/permission';

interface PermissionFormProps {
  permission?: Permission | null;
  resources: Resource[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function PermissionForm({
  permission,
  resources,
  onSuccess,
  onCancel
}: PermissionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: permission?.name || '',
      action: permission?.action || '',
      resourceId: permission?.resourceId || resources[0]?.id || 0,
      description: permission?.description || '',
    },
  });

  const selectedResourceId = watch('resourceId');

  const onSubmit = async (data: PermissionFormData) => {
    try {
      if (permission) {
        const updateData: UpdatePermissionInput = {
          name: data.name,
          action: data.action,
          resourceId: data.resourceId,
          description: data.description || undefined,
        };
        await permissionsApi.update(permission.id, updateData);
        toast.success('Permiso actualizado', 'Los cambios se guardaron correctamente');
      } else {
        const createData: CreatePermissionInput = {
          name: data.name,
          action: data.action,
          resourceId: data.resourceId,
          description: data.description || undefined,
        };
        await permissionsApi.create(createData);
        toast.success('Permiso creado', 'El permiso se creó correctamente');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error al guardar permiso:', error);
      toast.error('Error al guardar permiso', error.message || 'No se pudo guardar el permiso');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField>
        <Label htmlFor="name">Nombre del Permiso *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ej: read_posts, write_users"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && <FormError>{errors.name.message}</FormError>}
      </FormField>

      <FormField>
        <Label htmlFor="action">Acción *</Label>
        <Input
          id="action"
          {...register('action')}
          placeholder="Ej: read, write, delete, update"
          aria-invalid={errors.action ? 'true' : 'false'}
        />
        {errors.action && <FormError>{errors.action.message}</FormError>}
      </FormField>

      <FormField>
        <Label htmlFor="resourceId">Recurso *</Label>
        <Select
          value={selectedResourceId?.toString() || ''}
          onValueChange={(value) => setValue('resourceId', Number(value), { shouldValidate: true })}
        >
          <SelectTrigger id="resourceId" aria-invalid={errors.resourceId ? 'true' : 'false'}>
            <SelectValue placeholder="Selecciona un recurso" />
          </SelectTrigger>
          <SelectContent>
            {resources.map((resource) => (
              <SelectItem key={resource.id} value={resource.id.toString()}>
                {resource.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.resourceId && <FormError>{errors.resourceId.message}</FormError>}
      </FormField>

      <FormField>
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          {...register('description')}
          placeholder="Descripción del permiso"
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && <FormError>{errors.description.message}</FormError>}
      </FormField>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : permission ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

