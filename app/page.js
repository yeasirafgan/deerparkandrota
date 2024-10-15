// // mainfolder/app/page.js

export const metadata = {
  title: 'Deerpark timesheet',
  description: 'Simple timesheet for Deerpark staffs...',
};

const Home = () => {
  return (
    <main className='flex flex-col items-center justify-center min-h-[82vh] w-full px-4 bg-gradient-to-r from-slate-200 to-slate-100'>
      <div className='text-center max-w-2xl'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-slate-800 mb-4'>
          Deer Park Timesheet
        </h1>
        <p className='text-lg md:text-xl text-slate-600 font-semibold'>
          Please submit your hours...
        </p>
      </div>
    </main>
  );
};

export default Home;
