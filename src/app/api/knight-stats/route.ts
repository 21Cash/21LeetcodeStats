import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/constant/firebaseConfig';

const getKnightStats = async () => {
  const knightDataRef = doc(db, 'KnightStats', 'stats');
  const docSnap = await getDoc(knightDataRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  }
  return null;
};

export async function GET() {
  try {
    const data = await getKnightStats();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
