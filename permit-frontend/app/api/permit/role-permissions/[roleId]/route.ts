import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rolePermissionsApi } from '@/lib/api-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { roleId } = await params;
    const permissions = await rolePermissionsApi.getByRole(Number(roleId));
    return NextResponse.json(permissions);
  } catch (error: any) {
    console.error('Error en GET /api/permit/role-permissions/[roleId]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener permisos del rol' },
      { status: error.status || 500 }
    );
  }
}

