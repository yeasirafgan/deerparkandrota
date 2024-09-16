//app/api/rota/update/route.js

import { NextResponse } from 'next/server';
import connectMongo from '/db/connectMongo';
import Rota from '/models/Rota';

export async function PATCH(request) {
  const { id, updates } = await request.json();

  console.log('Rota ID to update:', id);
  console.log('Updates:', updates);

  await connectMongo();
  const rota = await Rota.findById(id);

  if (!rota) {
    return NextResponse.json({ error: 'Rota not found' }, { status: 404 });
  }

  // Handle updates to parsedData
  if (updates.parsedData) {
    updates.parsedData.forEach((update, index) => {
      if (rota.parsedData[index]) {
        // Update existing row
        Object.assign(rota.parsedData[index], update);
      } else {
        // Add new row if it doesn't exist
        rota.parsedData.push(update);
      }
    });
  }

  // Apply other updates
  Object.assign(rota, updates);

  const updatedRota = await rota.save();

  return NextResponse.json(updatedRota);
}
