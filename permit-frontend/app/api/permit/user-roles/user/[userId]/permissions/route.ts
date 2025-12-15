import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { userRolesApi } from '@/lib/api-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { userId } = await params;
    const permissions = await userRolesApi.getUserPermissions(Number(userId));
    return NextResponse.json(permissions);
  } catch (error: any) {
    console.error('Error en GET /api/permit/user-roles/user/[userId]/permissions:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener permisos del usuario' },
      { status: error.status || 500 }
    );
  }
}

