import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rolePermissionsApi } from '@/lib/api-server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string; permissionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { roleId, permissionId } = await params;
    const result = await rolePermissionsApi.remove(
      Number(roleId),
      Number(permissionId)
    );
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en DELETE /api/permit/role-permissions/[roleId]/[permissionId]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al remover permiso del rol' },
      { status: error.status || 500 }
    );
  }
}

