import { NextResponse } from 'next/server';

import {
  getLowestRatedGuardianUserInfo,
  getUserInfo,
  getUsernameByRank,
  getUserRating,
} from '@/app/api/Utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rank = Number(searchParams.get('rank'));
    const username = await getUsernameByRank(Number(rank));
    const data = {
      username,
    };
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
