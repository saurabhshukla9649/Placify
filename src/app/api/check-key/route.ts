import { NextResponse } from 'next/server';
import { conductMockInterview } from '@/ai/flows/conduct-mock-interview';

export async function GET() {
  try {
    const res = await conductMockInterview({
      jobRole: 'Software Engineer',
      history: []
    });
    return NextResponse.json({ success: true, res });
  } catch(e: any) {
    return NextResponse.json({ success: false, error: e.message, status: e.status, code: e.code, stack: e.stack });
  }
}
