import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { userRolesApi } from '@/lib/api-server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const result = await userRolesApi.assign(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/permit/user-roles:', error);
    return NextResponse.json(
      { error: error.message || 'Error al asignar rol al usuario' },
      { status: error.status || 500 }
    );
  }
}

