'use client';

import {
  calculateTotalMinutes,
  convertMinutesToHours,
} from '@/utils/dateUtils';
import Pagination from 'rc-pagination';
import { useState, useEffect } from 'react';

const UserTimesheetData = ({ username }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const limit = 10; // Limit of timesheets per page

  const fetchTimesheets = async (page) => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const res = await fetch(
        `/api/timesheets?username=${username}&page=${page}&limit=${limit}`
      );
      const data = await res.json();

      setTimesheets(data.timesheets);
      setTotalPages(Math.ceil(data.totalCount / limit));
    } catch (error) {
      console.error('Failed to fetch timesheets:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching completes
    }
  };

  useEffect(() => {
    fetchTimesheets(page);
  }, [page]);

  // Helper function: Format date as "17 Aug 24"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    }).format(date);
  };

  // Helper function: Format hours and minutes for display
  const formatTime = (hours, minutes) => {
    if (minutes === 0) {
      return `${hours} hrs`;
    } else {
      return `${hours} hrs ${minutes} mins`;
    }
  };

  // Calculate total minutes worked this week
  const totalMinutes = calculateTotalMinutes(timesheets);
  const { hours: totalHours, minutes: remainingMinutes } =
    convertMinutesToHours(totalMinutes);

  return (
    <div className='p-4 sm:p-5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg'>
      <h2 className='text-xl md:text-lg font-semibold mb-3 sm:mb-4 text-center sm:text-left text-slate-700'>
        {`${username}'s latest work`}
      </h2>

      {/* Display loading state */}
      {isLoading ? (
        <div className='text-center'>Loading timesheets...</div>
      ) : (
        <div className='overflow-x-auto rounded-md'>
          <table className='min-w-[400px] sm:min-w-full bg-white border text-xs sm:text-sm'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-2 sm:px-4 py-2 text-left'>Date</th>
                <th className='border px-2 sm:px-4 py-2 text-left'>Start</th>
                <th className='border px-2 sm:px-4 py-2 text-left'>End</th>
                <th className='border px-2 sm:px-4 py-2 text-left'>
                  Hours Worked
                </th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts) => {
                const { hours, minutes } = convertMinutesToHours(
                  calculateTotalMinutes([{ start: ts.start, end: ts.end }])
                );
                return (
                  <tr key={ts._id} className='hover:bg-gray-50'>
                    <td className='border px-2 sm:px-4 py-1 sm:py-2'>
                      {formatDate(ts.date)}
                    </td>
                    <td className='border px-2 sm:px-4 py-1 sm:py-2'>
                      {ts.start}
                    </td>
                    <td className='border px-2 sm:px-4 py-1 sm:py-2'>
                      {ts.end}
                    </td>
                    <td className='border px-2 sm:px-4 py-1 sm:py-2 font-medium'>
                      {formatTime(Math.floor(hours), Math.round(minutes))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className='bg-gray-100'>
                <td
                  colSpan='3'
                  className='border px-2 sm:px-4 py-2 font-bold text-left'
                >
                  Total Hours
                </td>
                <td className='border px-2 sm:px-4 py-2 font-bold'>
                  {formatTime(totalHours, remainingMinutes)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {timesheets.length > 0 && (
        <div className='mt-4 flex justify-center'>
          <Pagination
            current={page}
            total={totalPages * limit} // total count of items (timesheets)
            pageSize={limit} // items per page
            onChange={(page) => setPage(page)} // update page state on change
            className='pagination'
          />
        </div>
      )}
    </div>
  );
};

export default UserTimesheetData;
