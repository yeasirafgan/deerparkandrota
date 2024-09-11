// // // mainfolder/utils/timesheetUtils.js

import {
  getLastFourWeeks,
  calculateHoursWorked,
  calculateMinutesWorked,
  convertMinutesToHours,
} from './dateUtils';
import Timesheet from '@/models/Timesheet';
import connectMongo from '@/db/connectMongo';

export async function fetchTimesheetData() {
  await connectMongo();

  const timesheets = await Timesheet.find({}).sort({ date: 1 });

  // Debugging: Log fetched timesheets
  console.log('Fetched Timesheets for Detailed Report:', timesheets);

  return timesheets.map((ts) => ({
    username: ts.username,
    date: new Date(ts.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    }),
    start: ts.start,
    end: ts.end,
    hoursWorked: calculateHoursWorked(ts.start, ts.end),
  }));
}

export async function fetchTimesheetSummary() {
  await connectMongo();

  const weeks = getLastFourWeeks();
  const summary = {};

  const timesheets = await Timesheet.find({
    date: {
      $gte: new Date(weeks[0].start),
      $lte: new Date(weeks[3].end),
    },
  });

  timesheets.forEach((ts) => {
    const username = ts.username;
    if (!summary[username]) {
      summary[username] = { weeklyMinutes: [], totalMinutes: 0 };
      weeks.forEach(() => summary[username].weeklyMinutes.push(0));
    }

    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i];
      const entryDate = new Date(ts.date);
      if (
        entryDate >= new Date(week.start) &&
        entryDate <= new Date(week.end)
      ) {
        const minutesWorked = calculateMinutesWorked(ts.start, ts.end);
        summary[username].weeklyMinutes[i] += minutesWorked;
        summary[username].totalMinutes += minutesWorked;
        break;
      }
    }
  });

  return Object.entries(summary).map(([username, data]) => {
    const totalHoursAndMinutes = convertMinutesToHours(data.totalMinutes);
    const summaryData = {
      username,
      totalHours: `${totalHoursAndMinutes.hours}h ${totalHoursAndMinutes.minutes}m`,
    };

    weeks.forEach((week, i) => {
      const formattedWeek = `${new Date(week.start).getDate()} ${new Date(
        week.start
      ).toLocaleString('en-GB', { month: 'short' })} ${new Date(week.start)
        .getFullYear()
        .toString()
        .slice(-2)} - ${new Date(week.end).getDate()} ${new Date(
        week.end
      ).toLocaleString('en-GB', { month: 'short' })} ${new Date(week.end)
        .getFullYear()
        .toString()
        .slice(-2)}`;

      const weeklyHoursAndMinutes = convertMinutesToHours(
        data.weeklyMinutes[i]
      );
      summaryData[
        formattedWeek
      ] = `${weeklyHoursAndMinutes.hours}h ${weeklyHoursAndMinutes.minutes}m`;
    });

    return summaryData;
  });
}
