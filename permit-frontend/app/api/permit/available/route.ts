import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { resourcesApi, permissionsApi } from '@/lib/api-server';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Obtener recursos y permisos
    const [allResources, allPermissions] = await Promise.all([
      resourcesApi.getAll(),
      permissionsApi.getAll(),
    ]);

    // Extraer acciones únicas de los permisos existentes
    const uniqueActions = Array.from(
      new Set(allPermissions.map((p) => p.action))
    ).sort();

    // Acciones comunes predefinidas
    const commonActions = ['read', 'write', 'create', 'update', 'delete', 'manage'];

    // Combinar acciones únicas con comunes (sin duplicados)
    const allActions = Array.from(
      new Set([...commonActions, ...uniqueActions])
    ).sort();

    return NextResponse.json({
      resources: allResources.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
      })),
      actions: allActions,
    });
  } catch (error: any) {
    console.error('Error en GET /api/permit/available:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener recursos y acciones' },
      { status: error.status || 500 }
    );
  }
}

