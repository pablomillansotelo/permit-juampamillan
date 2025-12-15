import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { permissionsApi } from '@/lib/api-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;
    const permission = await permissionsApi.getById(Number(id));
    return NextResponse.json(permission);
  } catch (error: any) {
    console.error('Error en GET /api/permit/permissions/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener permiso' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const permission = await permissionsApi.update(Number(id), body);
    return NextResponse.json(permission);
  } catch (error: any) {
    console.error('Error en PUT /api/permit/permissions/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar permiso' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;
    const result = await permissionsApi.delete(Number(id));
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en DELETE /api/permit/permissions/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar permiso' },
      { status: error.status || 500 }
    );
  }
}

