import { NextResponse } from 'next/server';
import { INITIAL_FEEDBACK } from '@/data/seedData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_FEEDBACK,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: body,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
