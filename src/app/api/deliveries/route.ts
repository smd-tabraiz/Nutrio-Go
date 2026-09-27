import { NextResponse } from 'next/server';
import { INITIAL_DELIVERIES } from '@/data/seedData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_DELIVERIES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Delivery recorded successfully',
      data: body,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
