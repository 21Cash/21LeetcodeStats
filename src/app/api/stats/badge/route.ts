import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const response = await fetch('https://leetcode.com', {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch LeetCode: ${response.status}`);
    }

    const leetcodePage = await response.text();
    return new NextResponse(leetcodePage, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const getMinRatingForGuardian = () => {};
