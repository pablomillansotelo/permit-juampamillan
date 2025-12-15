import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { userRolesApi } from '@/lib/api-server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; roleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { userId, roleId } = await params;
    const result = await userRolesApi.remove(Number(userId), Number(roleId));
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en DELETE /api/permit/user-roles/[userId]/[roleId]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al remover rol del usuario' },
      { status: error.status || 500 }
    );
  }
}

