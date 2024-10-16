//app/timesheet/page.js

import createTimesheet from '@/actions/actions';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import UserTimesheetData from '@/components/UserTimesheetData';
import { redirect } from 'next/navigation';
import TimesheetForm from './TimesheetForm';
import RotaList from '@/components/RotaList';

export const metadata = {
  title: 'Timesheet page',
  description: 'Simple timesheet for Deerpark staffs',
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
    return await createTimesheet(formData);
    // redirect('/timesheet');
  };

  const reloadData = async (formData) => {
    'use server';
    redirect('/timesheet');
  };

  return (
    <main className='bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
      <div className='container mx-auto'>

    {/* Hero Section with Username */}
        <div className='flex-1 bg-gradient-to-r from-slate-200 to-slate-100 shadow-md rounded-lg p-6 mb-8 h-[60vh] md:h-auto flex flex-col justify-center items-center'>
          <h1 className='text-2xl font-extrabold text-gray-800'>
            Welcome, <span className='text-green-600 font-bold'>{username}</span>
          </h1>
          <h2 className='text-xl font-semibold text-lime-900 text-center mt-2'>
            Submit your timesheets and see rotas.
          </h2>
          <p className='text-lg text-slate-700 text-center mt-4'>
            Manage your timesheet data and view your weekly rotas effortlessly.
          </p>
        </div>

        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex-1 bg-gradient-to-r from-slate-100 to-slate-50 shadow-md rounded-lg p-6'>
            <h1 className='text-2xl font-semibold text-slate-800 mb-4'>
              Timesheet Entry
            </h1>
            <TimesheetForm
              onSubmit={handleSubmit}
              reloadData={reloadData}
              username={username}
            />
          </div>

          <div className='flex-1 bg-gradient-to-r from-slate-100 to-slate-50 shadow-md rounded-lg p-6'>
            <h1 className='text-2xl font-semibold text-slate-800 mb-4'>
              Your Timesheet Data
            </h1>
            <UserTimesheetData username={username} />
          </div>
        </div>

        <div className='mt-8 bg-white shadow-md rounded-lg p-6'>
          <h1 className='text-2xl font-semibold text-slate-800 mb-4'>
            Rota List
          </h1>
          <RotaList userRole='basic' />
        </div>
      </div>
    </main>
  );
};

export default TimesheetPage;
