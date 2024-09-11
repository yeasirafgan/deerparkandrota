// //mainfolder/app/api/delete-timesheet/[id]/route.js

import { NextResponse } from 'next/server';
import connectMongo from '@/db/connectMongo';
import Timesheet from '@/models/Timesheet';
import WeeklySummary from '@/models/WeeklySummary';
import { getWeeklyPeriod, calculateHoursWorked } from '@/utils/dateUtils';

export async function DELETE(req, { params }) {
  try {
    await connectMongo();

    const { id } = params;

    if (!id) {
      console.error('No ID provided in params');
      return new NextResponse('Timesheet ID is required', { status: 400 });
    }

    const timesheet = await Timesheet.findByIdAndDelete(id);

    if (!timesheet) {
      console.error('Timesheet not found:', id);
      return new NextResponse('Timesheet not found', { status: 404 });
    }

    const { startDate, endDate } = getWeeklyPeriod(timesheet.date);

    const timesheets = await Timesheet.find({
      userId: timesheet.userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const totalHours = timesheets.reduce(
      (sum, ts) => sum + calculateHoursWorked(ts.start, ts.end),
      0
    );

    if (timesheets.length > 0) {
      await WeeklySummary.findOneAndUpdate(
        { userId: timesheet.userId, startDate, endDate },
        { totalHours },
        { upsert: true }
      );
      console.log('WeeklySummary updated or created');
    } else {
      const result = await WeeklySummary.findOneAndDelete({
        userId: timesheet.userId,
        startDate,
        endDate,
      });

      if (result) {
        console.log('WeeklySummary successfully deleted');
      } else {
        console.log('No WeeklySummary entry found to delete');
      }
    }

    return new NextResponse('Timesheet deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting timesheet:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
