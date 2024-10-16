// 'use client';

// import { enGB } from 'date-fns/locale';
// import { redirect } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const TimesheetForm = ({ onSubmit, reloadData, username }) => {
//   const [formData, setFormData] = useState({
//     date: new Date(),
//     start: '',
//     end: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [maxTime, setMaxTime] = useState(null);

//   useEffect(() => {
//     const now = new Date();
//     if (formData.date.toDateString() === now.toDateString()) {
//       const hours = String(now.getHours()).padStart(2, '0');
//       const minutes = String(now.getMinutes()).padStart(2, '0');
//       setMaxTime(`${hours}:${minutes}`);
//     } else {
//       setMaxTime(null);
//     }
//   }, [formData.date]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleDateChange = (date) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       date: date,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     const startDateTime = new Date(
//       `${formData.date.toISOString().split('T')[0]}T${formData.start}`
//     );
//     const endDateTime = new Date(
//       `${formData.date.toISOString().split('T')[0]}T${formData.end}`
//     );

//     if (endDateTime <= startDateTime) {
//       setError('End time must be later than start time.');
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const formDataObj = new FormData();
//       formDataObj.append('date', formData.date.toISOString().split('T')[0]);
//       formDataObj.append('start', formData.start);
//       formDataObj.append('end', formData.end);
//       formDataObj.append('username', username);

//       const result = await onSubmit(formDataObj);

//       if (result && result.status === 500) {
//         setError(result.message);
//       } else {
//         setFormData({ date: new Date(), start: '', end: '' });
//         setSuccessMessage('Thanks, submitted successfully...');
//         setTimeout(() => {
//           setSuccessMessage(null);
//           reloadData();
//         }, 3000);
//       }
//     } catch (err) {
//       setError(
//         'An error occurred while submitting the form. Please try again.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className='space-y-6 w-full p-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg shadow-lg border border-gray-200'
//     >
//       <div className='flex flex-col'>
//         <label
//           className='text-sm font-medium text-gray-700'
//           htmlFor='date-picker'
//         >
//           Date
//         </label>
//         <DatePicker
//           selected={formData.date}
//           onChange={handleDateChange}
//           dateFormat='dd MMMM yyyy'
//           id='date-picker'
//           className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
//           required
//           popperClassName='react-datepicker-popper'
//           calendarClassName='react-datepicker-custom'
//           locale={enGB}
//           maxDate={new Date()}
//         />
//       </div>

//       <div className='flex flex-col sm:flex-row sm:space-x-4'>
//         <div className='flex flex-col flex-1'>
//           <label className='text-sm font-medium text-gray-700' htmlFor='start'>
//             Start Time
//           </label>
//           <input
//             type='time'
//             name='start'
//             id='start'
//             value={formData.start}
//             onChange={handleChange}
//             className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
//             max={
//               formData.date.toDateString() === new Date().toDateString()
//                 ? maxTime
//                 : null
//             }
//             required
//           />
//         </div>

//         <div className='flex flex-col flex-1 mt-4 sm:mt-0'>
//           <label className='text-sm font-medium text-gray-700' htmlFor='end'>
//             End Time
//           </label>
//           <input
//             type='time'
//             name='end'
//             id='end'
//             value={formData.end}
//             onChange={handleChange}
//             className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
//             max={
//               formData.date.toDateString() === new Date().toDateString()
//                 ? maxTime
//                 : null
//             }
//             required
//           />
//         </div>
//       </div>

//       {error && <div className='text-red-500 text-sm'>{error}</div>}

//       {successMessage && (
//         <div className='text-green-500 text-sm'>{successMessage}</div>
//       )}

//       <button
//         type='submit'
//         disabled={isSubmitting}
//         className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
//           isSubmitting
//             ? 'bg-gray-400 cursor-not-allowed'
//             : 'bg-slate-700 hover:bg-slate-800'
//         }`}
//       >
//         {isSubmitting ? 'Submitting...' : 'Submit'}
//       </button>
//     </form>
//   );
// };

// export default TimesheetForm;


//app/timesheet/TimesheetForm.js

'use client';

import { enGB } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TimesheetForm = ({ onSubmit, reloadData, username }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    start: '',
    end: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [maxTime, setMaxTime] = useState(null);

  // Handle max time for current date
  useEffect(() => {
    const now = new Date();
    if (formData.date.toDateString() === now.toDateString()) {
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setMaxTime(`${hours}:${minutes}`);
    } else {
      setMaxTime(null);
    }
  }, [formData.date]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date: date,
    }));
  };

  // Convert time input (HH:MM) to Date object for comparison
  const convertTimeToDate = (date, time) => {
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    return newDate;
  };


  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      // Format the date as 'YYYY-MM-DD' without converting to UTC
      const formattedDate = formData.date
        .toLocaleDateString('en-CA'); // 'en-CA' gives format 'YYYY-MM-DD'
  
      const formDataObj = new FormData();
      formDataObj.append('date', formattedDate); // Use formattedDate
      formDataObj.append('start', formData.start);
      formDataObj.append('end', formData.end);
      formDataObj.append('username', username);
  
      const result = await onSubmit(formDataObj);
  
      if (result && result.status === 500) {
        setError(result.message);
      } else {
        setFormData({ date: new Date(), start: '', end: '' });
        setSuccessMessage('Thanks, submitted successfully...');
        setTimeout(() => {
          setSuccessMessage(null);
          reloadData();
        }, 3000);
      }
    } catch (err) {
      setError(
        'An error occurred while submitting the form. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  


  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 w-full p-4 bg-white rounded-lg shadow-lg border border-gray-200'
    >
      <div className='flex flex-col'>
        <label
          className='text-sm font-medium text-gray-700'
          htmlFor='date-picker'
        >
          Date
        </label>
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          dateFormat='dd MMMM yyyy'
          id='date-picker'
          className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
          required
          popperClassName='react-datepicker-popper'
          calendarClassName='react-datepicker-custom'
          locale={enGB}
          maxDate={new Date()}
        />
      </div>

      <div className='flex flex-col sm:flex-row sm:space-x-4'>
        <div className='flex flex-col flex-1'>
          <label className='text-sm font-medium text-gray-700' htmlFor='start'>
            Start Time
          </label>
          <input
            type='time'
            name='start'
            id='start'
            value={formData.start}
            onChange={handleChange}
            className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
            max={
              formData.date.toDateString() === new Date().toDateString()
                ? maxTime
                : null
            }
            required
          />
        </div>

        <div className='flex flex-col flex-1 mt-4 sm:mt-0'>
          <label className='text-sm font-medium text-gray-700' htmlFor='end'>
            End Time
          </label>
          <input
            type='time'
            name='end'
            id='end'
            value={formData.end}
            onChange={handleChange}
            className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
            max={
              formData.date.toDateString() === new Date().toDateString()
                ? maxTime
                : null
            }
            required
          />
        </div>
      </div>

      {error && <div className='text-red-500 text-sm'>{error}</div>}

      {successMessage && (
        <div className='text-green-500 text-sm'>{successMessage}</div>
      )}

      <button
        type='submit'
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-slate-700 hover:bg-slate-800'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default TimesheetForm;

