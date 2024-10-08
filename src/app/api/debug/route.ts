import { NextResponse } from 'next/server';

import {
  getLowestRatedGuardianUserInfo,
  getUserInfo,
  getUsernameByRank,
  getUserRating,
} from '@/app/api/Utils';

export async function GET() {
  try {
    return NextResponse.json({ msg: 'Done' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
