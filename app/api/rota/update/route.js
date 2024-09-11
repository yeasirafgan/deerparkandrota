//app/api/rota/update/route.js

import { NextResponse } from 'next/server';
import connectMongo from '/db/connectMongo';
import Rota from '/models/Rota';

export async function PATCH(request) {
  const { id, updates } = await request.json();

  console.log('Rota ID to update:', id);
  console.log('Updates:', updates);

  await connectMongo();
  const updatedRota = await Rota.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedRota) {
    return NextResponse.json({ error: 'Rota not found' }, { status: 404 });
  }

  return NextResponse.json(updatedRota);
}
