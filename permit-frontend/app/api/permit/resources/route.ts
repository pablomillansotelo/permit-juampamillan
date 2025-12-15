import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { resourcesApi } from '@/lib/api-server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const resources = await resourcesApi.getAll();
    return NextResponse.json(resources);
  } catch (error: any) {
    console.error('Error en GET /api/permit/resources:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener recursos' },
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
    const resource = await resourcesApi.create(body);
    return NextResponse.json(resource, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/permit/resources:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear recurso' },
      { status: error.status || 500 }
    );
  }
}

