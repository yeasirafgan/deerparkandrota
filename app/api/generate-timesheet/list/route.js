import connectMongo from '@/db/connectMongo';
import Timesheet from '@/models/Timesheet';
import {
  getLastFourWeeks,
  calculateMinutesWorked,
  convertMinutesToHours,
  formatDate,
  getPreviousWeek,
} from '@/utils/dateUtils';
import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Connect to MongoDB
  await connectMongo();

  // Fetch all timesheets
  const timesheets = await Timesheet.find({}).sort({ date: 1 });

  // Prepare date ranges for the last four weeks
  const lastFourWeeks = getLastFourWeeks();
  const previousWeek = getPreviousWeek(new Date());

  const dateRanges = [previousWeek, ...lastFourWeeks];
  const uniqueDateRanges = Array.from(
    new Set(dateRanges.map((range) => JSON.stringify(range)))
  ).map((range) => JSON.parse(range));

  uniqueDateRanges.sort((a, b) => new Date(b.start) - new Date(a.start));

  // Group timesheets by users
  const usersTimesheets = timesheets.reduce((acc, timesheet) => {
    const { username, date, start, end } = timesheet;
    const timesheetDate = new Date(date).toISOString().split('T')[0];
    const minutesWorked = calculateMinutesWorked(start, end);

    if (!acc[username]) {
      acc[username] = { username, periods: {}, totalMinutes: 0 };
    }

    uniqueDateRanges.forEach((range) => {
      const rangeStart = new Date(range.start).toISOString().split('T')[0];
      const rangeEnd = new Date(range.end).toISOString().split('T')[0];

      if (
        new Date(timesheetDate) >= new Date(rangeStart) &&
        new Date(timesheetDate) <= new Date(rangeEnd)
      ) {
        const periodKey = `${formatDate(new Date(range.start))} - ${formatDate(
          new Date(range.end)
        )}`;
        acc[username].periods[periodKey] =
          (acc[username].periods[periodKey] || 0) + minutesWorked;
        acc[username].totalMinutes += minutesWorked;
      }
    });

    return acc;
  }, {});

  // Create Excel file using ExcelJS
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Timesheets Summary');

  // Add headers in the specified order
  const headers = [
    'Username',
    ...lastFourWeeks.map(
      (range) =>
        `${formatDate(new Date(range.start))} - ${formatDate(
          new Date(range.end)
        )}`
    ),
    'Total (4 Weeks)',
  ];
  sheet.addRow(headers);

  // Set column widths
  sheet.columns = [
    { header: 'Username', width: 20 }, // Adjust width for 'Username' column
    ...lastFourWeeks.map(() => ({ width: 18 })), // Set width for each week column
    { header: 'Total (4 Weeks)', width: 20 }, // Set width for 'Total' column
  ];

  // Add timesheet data for each user in the specified order
  Object.values(usersTimesheets).forEach((user) => {
    const row = [user.username];
    let totalMinutes = 0;

    // Reverse the order of the periods for data rows
    lastFourWeeks.forEach((range) => {
      const periodKey = `${formatDate(new Date(range.start))} - ${formatDate(
        new Date(range.end)
      )}`;
      const periodMinutes = user.periods[periodKey] || 0;
      const { hours, minutes } = convertMinutesToHours(periodMinutes);
      row.push(formatTime(hours, minutes)); // Use the new formatTime function
      totalMinutes += periodMinutes;
    });

    const { hours: totalHours, minutes: totalRemainingMinutes } =
      convertMinutesToHours(totalMinutes);
    row.push(formatTime(totalHours, totalRemainingMinutes)); // Use the new formatTime function
    sheet.addRow(row);
  });

  // Prepare the file as a buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Return the file as a downloadable response
  return new NextResponse(buffer, {
    headers: {
      'Content-Disposition': 'attachment; filename=timesheet_summary.xlsx',
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
}

// Function to format time
const formatTime = (hours, minutes) => {
  if (hours === 0 && minutes === 0) {
    return `0 mins`;
  } else if (minutes === 0) {
    return `${hours} hrs`;
  } else if (hours === 0) {
    return `${minutes} mins`;
  } else {
    return `${hours} hrs ${minutes} mins`; // Keep the original order here
  }
};
