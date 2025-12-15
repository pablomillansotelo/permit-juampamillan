import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rolesApi } from '@/lib/api-server';

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
    const role = await rolesApi.getById(Number(id));
    return NextResponse.json(role);
  } catch (error: any) {
    console.error('Error en GET /api/permit/roles/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener rol' },
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
    const role = await rolesApi.update(Number(id), body);
    return NextResponse.json(role);
  } catch (error: any) {
    console.error('Error en PUT /api/permit/roles/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar rol' },
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
    const result = await rolesApi.delete(Number(id));
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en DELETE /api/permit/roles/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar rol' },
      { status: error.status || 500 }
    );
  }
}

