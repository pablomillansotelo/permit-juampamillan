import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rolesApi } from '@/lib/api-server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const roles = await rolesApi.getAll();
    return NextResponse.json(roles);
  } catch (error: any) {
    console.error('Error en GET /api/permit/roles:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener roles' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const role = await rolesApi.create(body);
    return NextResponse.json(role, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/permit/roles:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear rol' },
      { status: error.status || 500 }
    );
  }
}

