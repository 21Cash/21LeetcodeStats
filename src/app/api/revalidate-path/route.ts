import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const route = searchParams.get('route');
  const adminSecretKey = searchParams.get('secretKey');

  if (!route || !adminSecretKey) {
    return NextResponse.json(
      { message: 'Route query param is required.' },
      { status: 400 }
    );
  }

  const correctKey = process.env.NEXT_ADMIN_SECRET_KEY;

  if (adminSecretKey != correctKey) {
    return NextResponse.json(
      { message: 'Access Denied, Admin Secret is Incorrect.' },
      { status: 403 }
    );
  }

  try {
    revalidatePath(route);
    console.log(`Route Revalidated : ${route}`);
    return NextResponse.json({
      message: `Revalidation triggered for ${route}`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to revalidate.', error },
      { status: 500 }
    );
  }
}
