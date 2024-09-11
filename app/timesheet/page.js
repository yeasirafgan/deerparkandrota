// //mainfolder/app/timesheet/page.js

import createTimesheet from '@/actions/actions';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import UserTimesheetData from '@/components/UserTimesheetData';
import { redirect } from 'next/navigation';
import TimesheetForm from './TimesheetForm';

export const metadata = {
  title: 'Timesheet page',
  description: 'Simple timesheet app for Deerpark staffs',
};

const TimesheetPage = async ({ searchParams }) => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect('/api/auth/login?post_login_redirect_url=/timesheet');
  }

  const user = await getUser();
  const username = user
    ? `${user.given_name || ''} ${user.family_name || ''}`.trim() || user.email
    : 'Unknown';

  const handleSubmit = async (formData) => {
    'use server';
    await createTimesheet(formData);
    redirect('/timesheet');
  };

  return (
    <main className='flex flex-col md:flex-row justify-center items-start bg-white py-5 space-y-5 md:space-y-0'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full md:w-1/2 lg:w-1/3'>
        <h1 className='text-xl md:text-lg font-bold mb-6 text-slate-700 text-center md:text-left'>
          How many hours you work today
        </h1>
        <TimesheetForm onSubmit={handleSubmit} username={username} />
      </div>

      <div className='bg-white lg:ml-2 shadow-lg rounded-lg p-8 w-full md:w-1/2 lg:w-2/3'>
        <UserTimesheetData username={username} />
      </div>
    </main>
  );
};

export default TimesheetPage;
