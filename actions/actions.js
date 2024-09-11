// //mainfolder/actions/actions.js

'use server';

import connectMongo from '@/db/connectMongo';
import Timesheet from '@/models/Timesheet';
import WeeklySummary from '@/models/WeeklySummary';
import { calculateHoursWorked, getWeeklyPeriod } from '@/utils/dateUtils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function createTimesheet(formData) {
  try {
    await connectMongo();

    const session = await getKindeServerSession();
    const user = await session.getUser();
    const userId = user.id;
    const username =
      `${user.given_name || ''} ${user.family_name || ''}`.trim() || user.email;

    if (!userId || !username) throw new Error('User ID or username is missing');

    const dateStr = formData.get('date');
    const workstart = formData.get('start');
    const workend = formData.get('end');

    // Validate dateStr
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    console.log(`Date Parsed: ${date}`);
    const { startDate, endDate } = getWeeklyPeriod(date);

    console.log(`Weekly Period: StartDate: ${startDate}, EndDate: ${endDate}`);

    const newTimesheet = new Timesheet({
      userId,
      username,
      date,
      start: workstart,
      end: workend,
    });

    await newTimesheet.save();

    const hoursWorked = calculateHoursWorked(workstart, workend);

    await WeeklySummary.findOneAndUpdate(
      { userId, startDate, endDate },
      { $inc: { totalHours: hoursWorked } },
      { upsert: true }
    );

    console.log(
      `Start: ${workstart}, End: ${workend}, Hours Worked: ${hoursWorked}`
    );
  } catch (error) {
    console.error('Error saving timesheet:', error);
    // Handle the error appropriately, e.g., by showing an error message
  }
}
