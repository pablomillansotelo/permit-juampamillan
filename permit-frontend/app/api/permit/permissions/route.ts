import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { permissionsApi } from '@/lib/api-server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const permissions = await permissionsApi.getAll();
    return NextResponse.json(permissions);
  } catch (error: any) {
    console.error('Error en GET /api/permit/permissions:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener permisos' },
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
    const permission = await permissionsApi.create(body);
    return NextResponse.json(permission, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/permit/permissions:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear permiso' },
      { status: error.status || 500 }
    );
  }
}

