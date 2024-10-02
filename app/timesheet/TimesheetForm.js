'use client';

import { enGB } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TimesheetForm = ({ onSubmit, username }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    start: '',
    end: '',
  });
  const [maxTime, setMaxTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setMaxTime(`${hours}:${minutes}`);
  }, []);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update form data for start and end times
    }));
  };

  // Handle date changes with DatePicker
  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date: date, // Update the date value in the form data
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare form data object for submission
      const formDataObj = new FormData();
      formDataObj.append('date', formData.date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
      formDataObj.append('start', formData.start);
      formDataObj.append('end', formData.end);
      formDataObj.append('username', username);

      // Trigger the form submission handler passed via props
      await onSubmit(formDataObj);

      // Reset form fields on successful submission
      setFormData({ date: new Date(), start: '', end: '' });
      setSuccessMessage('Thanks, submitted successfully...');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Handle submission errors
      setError(
        'An error occurred while submitting the form. Please try again.'
      );
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 w-full p-4 bg-white rounded-lg shadow-lg border border-gray-200'
    >
      {/* Date Field */}
      <div className='flex flex-col'>
        <label
          className='text-sm font-medium text-gray-700'
          htmlFor='date-picker'
        >
          Date
        </label>
        <DatePicker
          selected={formData.date} // Bind date selection to form data
          onChange={handleDateChange}
          dateFormat='dd MMMM yyyy' // Display format for the date
          id='date-picker'
          className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
          required
          popperClassName='react-datepicker-popper'
          calendarClassName='react-datepicker-custom'
          locale={enGB} // Ensure week starts on Monday using enGB locale
          maxDate={new Date()}
        />
      </div>

      {/* Time Fields */}
      <div className='flex flex-col sm:flex-row sm:space-x-4'>
        {/* Start Time Field */}
        <div className='flex flex-col flex-1'>
          <label className='text-sm font-medium text-gray-700' htmlFor='start'>
            Start Time
          </label>
          <input
            type='time'
            name='start'
            id='start'
            value={formData.start} // Bind start time to form data
            onChange={handleChange}
            className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
            // max={maxTime}
            required
          />
        </div>

        {/* End Time Field */}
        <div className='flex flex-col flex-1 mt-4 sm:mt-0'>
          <label className='text-sm font-medium text-gray-700' htmlFor='end'>
            End Time
          </label>
          <input
            type='time'
            name='end'
            id='end'
            value={formData.end} // Bind end time to form data
            onChange={handleChange}
            className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
            // max={maxTime}
            required
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <div className='text-red-500 text-sm'>{error}</div>}

      {/* Success Message */}
      {successMessage && (
        <div className='text-green-500 text-sm'>{successMessage}</div>
      )}

      {/* Submit Button */}
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
