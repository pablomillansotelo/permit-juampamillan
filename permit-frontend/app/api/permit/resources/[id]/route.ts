import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { resourcesApi } from '@/lib/api-server';

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
    const resource = await resourcesApi.getById(Number(id));
    return NextResponse.json(resource);
  } catch (error: any) {
    console.error('Error en GET /api/permit/resources/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener recurso' },
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
    const resource = await resourcesApi.update(Number(id), body);
    return NextResponse.json(resource);
  } catch (error: any) {
    console.error('Error en PUT /api/permit/resources/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar recurso' },
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
    const result = await resourcesApi.delete(Number(id));
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en DELETE /api/permit/resources/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar recurso' },
      { status: error.status || 500 }
    );
  }
}

