import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { permissionsApi } from '@/lib/api-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { resourceId } = await params;
    const permissions = await permissionsApi.getByResource(Number(resourceId));
    return NextResponse.json(permissions);
  } catch (error: any) {
    console.error('Error en GET /api/permit/permissions/resource/[resourceId]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener permisos del recurso' },
      { status: error.status || 500 }
    );
  }
}

