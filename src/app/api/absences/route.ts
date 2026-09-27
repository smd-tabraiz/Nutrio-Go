import { NextResponse } from 'next/server';
import { INITIAL_ABSENCES } from '@/data/seedData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_ABSENCES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Absence Successfully Recorded ✓',
      data: body,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
