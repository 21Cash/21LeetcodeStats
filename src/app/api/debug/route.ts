import {
  getLowestRatedGuardianUserInfo,
  getUserContestBadge,
  getUserContestBadgeByRank,
} from '@/app/api/Utils';
import { attachReactRefresh } from 'next/dist/build/webpack-config';
import { requestToBodyStream } from 'next/dist/server/body-streams';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    // const username = 'kreakEmp';
    // const badge = await getUserContestBadge(username);

    // const data = { badge };

    // const rank = 8000;
    // const badgeName = await getUserContestBadgeByRank(rank);
    // console.log(badgeName);
    // const data = { badgeName };

    const data = await getLowestRatedGuardianUserInfo();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
