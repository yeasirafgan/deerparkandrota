import connectMongo from '@/db/connectMongo';
import Rota from '@/models/Rota';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    await connectMongo();
    const rotas = await Rota.find();

    return new NextResponse(JSON.stringify(rotas));
  } catch (error) {
    console.error('Error fetching rota list:', error);
    return new NextResponse(
      { error: 'Failed to fetch rota list' },
      { status: 500 }
    );
  }
}
