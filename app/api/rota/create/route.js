// app/api/rota/create/route.js

import { parseExcelFile } from '/utils/excelUtils';
import { NextResponse } from 'next/server';
import connectMongo from '/db/connectMongo';
import Rota from '/models/Rota';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name'); // Get rota name from form data

    console.log('File received:', file);
    console.log('File name:', file.name);
    console.log('Rota name:', name);

    if (!file || !name) {
      return NextResponse.json(
        { error: 'No file or name provided' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer()); // Convert to Buffer
    let jsonData = await parseExcelFile(fileBuffer);

    // Filter out empty objects
    jsonData = jsonData.filter((item) => {
      // Check if the staff or post field contains meaningful data
      return item.staff?.trim() || item.post?.trim();
    });

    console.log('Filtered Parsed Data to Save:', jsonData); // Debugging line

    // Save the parsed data to MongoDB
    await connectMongo();
    const newRota = new Rota({
      name: name,
      fileData: file.name, // Store file name or path
      parsedData: jsonData,
    });

    await newRota.save();
    return NextResponse.json(newRota);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
