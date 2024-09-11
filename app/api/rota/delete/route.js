//app/api/rota/delete/route.js

import { NextResponse } from 'next/server';
import connectMongo from '/db/connectMongo';
import Rota from '/models/Rota';

export async function DELETE(request) {
  const { id } = await request.json();

  console.log('Rota ID to delete:', id);

  await connectMongo();
  const deletedRota = await Rota.findByIdAndDelete(id);

  if (!deletedRota) {
    return NextResponse.json({ error: 'Rota not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Rota deleted successfully' });
}
