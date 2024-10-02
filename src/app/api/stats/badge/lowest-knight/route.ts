import { NextResponse } from 'next/server';

import {
  getCurrentUTCTime,
  getLowestRatedKnightUserInfo,
} from '@/app/api/Utils';

export async function GET() {
  try {
    const data = await getLowestRatedKnightUserInfo();
    const lastUpdatedTime = getCurrentUTCTime();

    const responseData = {
      ...data,
      lastUpdatedTime,
    };

    const response = NextResponse.json(responseData, { status: 200 });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
