// // app/api/rota/[id]/route.js

import connectMongo from '/db/connectMongo';
import Rota from '/models/Rota';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectMongo();
    const rota = await Rota.findById(id);

    if (!rota) {
      return new Response(JSON.stringify({ message: 'Rota not found.' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(rota), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error message:', error.message);
    return new Response(JSON.stringify({ message: 'Error fetching rota.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
