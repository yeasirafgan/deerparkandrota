//mainfolder/app/timesheet/TimesheetForm.js

'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { enGB } from 'date-fns/locale'; // Import English locale

const TimesheetForm = ({ onSubmit, username }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    start: '',
    end: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append('date', formData.date.toISOString().split('T')[0]);
      formDataObj.append('start', formData.start);
      formDataObj.append('end', formData.end);
      formDataObj.append('username', username);

      await onSubmit(formDataObj);
      setFormData({ date: new Date(), start: '', end: '' });
      setSuccessMessage('Thanks, submitted successfully...');
      setTimeout(() => setSuccessMessage(null), 3000);
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
        <label className='text-sm font-medium text-gray-700' htmlFor='date'>
          Date
        </label>
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          dateFormat='dd MMMM yyyy'
          className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-700 sm:text-sm'
          required
          popperClassName='react-datepicker-popper'
          calendarClassName='react-datepicker-custom'
          locale={enGB} // Set locale to start week on Monday
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
