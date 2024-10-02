import {
  getCurrentUTCTime,
  getLowestRatedGuardianUserInfo,
} from '@/app/api/Utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getLowestRatedGuardianUserInfo();
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
