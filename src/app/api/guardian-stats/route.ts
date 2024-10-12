import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/page';

const getGuardianData = async () => {
  const guardianDataRef = doc(db, 'GuardianStats', 'stats');
  const docSnap = await getDoc(guardianDataRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  }
  return null;
};

export async function GET() {
  try {
    const data = await getGuardianData();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
