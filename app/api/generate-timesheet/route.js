// // // app/api/generate-timesheet/route.js

import { NextResponse } from 'next/server';
import { exportToExcel } from '@/utils/exportsToExcel';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'detailed';

  try {
    const buffer = await exportToExcel(type);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=timesheet_${type}.xlsx`,
      },
    });
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
