// // // // app/admin/[username]/page.js

import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';
import connectMongo from '@/db/connectMongo';
import Timesheet from '@/models/Timesheet';
import {
  calculateHoursWorked,
  calculateMinutesWorked,
  convertMinutesToHours,
} from '@/utils/dateUtils'; // Ensure these functions exist
import Link from 'next/link';
import { parseISO, format, subWeeks, startOfDay } from 'date-fns';

export const metadata = {
  title: 'Staff details',
  description: 'Simple timesheet app for Deerpark staffs',
};

const UserDetailPage = async ({ params }) => {
  const username = decodeURIComponent(params.username);

  // Connect to MongoDB
  await connectMongo();

  // Fetch timesheets sorted by date descending (latest first)
  const timesheets = await Timesheet.find({ username }).sort({ date: 1 });

  // Function to format the date
  const formatDate = (dateString) => {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd MMM yy EE'); // Format as "01 Aug 24 Thu"
  };

  // Calculate total hours worked for the last four weeks
  const today = new Date();
  const fourWeeksAgo = subWeeks(startOfDay(today), 4); // 4 weeks back

  const lastFourWeeksTimesheets = timesheets.filter((timesheet) => {
    const date =
      typeof timesheet.date === 'string'
        ? parseISO(timesheet.date)
        : timesheet.date;
    return date >= fourWeeksAgo;
  });

  // Calculate total minutes
  const totalMinutes = lastFourWeeksTimesheets.reduce((acc, timesheet) => {
    const minutesWorked = calculateMinutesWorked(
      timesheet.start,
      timesheet.end
    );
    return acc + minutesWorked;
  }, 0);

  // Convert total minutes to hours and minutes
  const { hours, minutes } = convertMinutesToHours(totalMinutes);

  // Function to format hours and minutes based on conditions
  const formatTime = (hours, minutes) => {
    if (minutes === 0) {
      return `${hours} hrs`;
    } else {
      return `${hours} hrs ${minutes} mins`;
    }
  };

  return (
    <main className='p-4 sm:p-8'>
      <div className='flex justify-end gap-2 mb-4'>
        <Link
          href='/api/generate-timesheet?type=detailed'
          className='px-3 py-1 bg-slate-700 hover:bg-slate-900 text-white rounded text-xs sm:text-sm'
        >
          Export Details
        </Link>
        <Link
          href='../admin'
          className='px-3 py-1 bg-slate-700 hover:bg-slate-900 text-white rounded text-xs sm:text-sm'
        >
          Go Back
        </Link>
      </div>
      <h1 className='text-md sm:text-lg font-semibold mb-4 text-lime-800 hover:text-emerald-950 text-center sm:text-left'>
        {`${username}'s work.`}
      </h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm font-semibold text-lime-800 hover:text-emerald-950'>
                Date
              </th>
              <th className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm font-semibold text-lime-800 hover:text-emerald-950'>
                Start
              </th>
              <th className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm font-semibold text-lime-800 hover:text-emerald-950'>
                End
              </th>
              <th className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm font-semibold text-lime-800 hover:text-emerald-950'>
                Hours Worked
              </th>
              <th className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm font-semibold text-lime-800 hover:text-emerald-950'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {lastFourWeeksTimesheets.map((timesheet) => (
              <tr key={timesheet._id.toString()} className='hover:bg-gray-50'>
                <td className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm text-slate-700 hover:text-emerald-900 font-semibold'>
                  {formatDate(timesheet.date)}
                </td>
                <td className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm text-slate-700 hover:text-emerald-900'>
                  {timesheet.start}
                </td>
                <td className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm text-slate-700 hover:text-emerald-900'>
                  {timesheet.end}
                </td>
                <td className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm text-slate-700 hover:text-emerald-900 font-bold'>
                  {formatTime(
                    Math.floor(
                      calculateHoursWorked(timesheet.start, timesheet.end)
                    ),
                    calculateMinutesWorked(timesheet.start, timesheet.end) % 60
                  )}
                </td>

                <td className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm text-lime-800 hover:text-emerald-950 flex gap-2'>
                  <EditButton id={timesheet._id.toString()} />
                  <DeleteButton id={timesheet._id.toString()} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                className='border border-gray-300 px-2 py-1 text-left text-xs sm:text-sm text-slate-700 hover:text-emerald-900 font-extrabold'
                colSpan='3'
              >
                Total Hours (Last 4 Weeks)
              </td>
              <td
                className='border border-gray-300 px-2 py-1 text-left text-slate-950 hover:text-emerald-900 font-extrabold text-xs sm:text-sm'
                colSpan='2'
              >
                {formatTime(hours, minutes)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
};

export default UserDetailPage;
