'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormError } from '@/components/ui/form';
import {
  Resource,
  resourcesApi,
  CreateResourceInput,
  UpdateResourceInput
} from '@/lib/api';
import { toast } from '@/lib/toast';
import { resourceSchema, type ResourceFormData } from '@/lib/schemas/resource';

interface ResourceFormProps {
  resource?: Resource | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ResourceForm({
  resource,
  onSuccess,
  onCancel
}: ResourceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: resource?.name || '',
      description: resource?.description || '',
    },
  });

  const onSubmit = async (data: ResourceFormData) => {
    try {
      if (resource) {
        const updateData: UpdateResourceInput = {
          name: data.name,
          description: data.description || undefined,
        };
        await resourcesApi.update(resource.id, updateData);
        toast.success('Recurso actualizado', 'Los cambios se guardaron correctamente');
      } else {
        const createData: CreateResourceInput = {
          name: data.name,
          description: data.description || undefined,
        };
        await resourcesApi.create(createData);
        toast.success('Recurso creado', 'El recurso se creó correctamente');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error al guardar recurso:', error);
      toast.error('Error al guardar recurso', error.message || 'No se pudo guardar el recurso');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField>
        <Label htmlFor="name">Nombre del Recurso *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ej: posts, users, settings"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && <FormError>{errors.name.message}</FormError>}
      </FormField>

      <FormField>
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          {...register('description')}
          placeholder="Descripción del recurso"
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && <FormError>{errors.description.message}</FormError>}
      </FormField>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : resource ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

