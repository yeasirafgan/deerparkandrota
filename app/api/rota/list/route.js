// app/api/rota/list/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '/db/connectMongo';
import Rota from '/models/Rota';

export async function GET() {
  try {
    await connectMongo();
    const rotas = await Rota.find();
    return NextResponse.json(rotas);
  } catch (error) {
    console.error('Error fetching rota list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rota list' },
      { status: 500 }
    );
  }
}
