// // // components/RotaUploadForm.js

'use client';

import { useState } from 'react';

export default function RotaUploadForm({ onSubmit, isSubmitting }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [weekStart, setWeekStart] = useState(''); // New state for weekStart

  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!file || !name || !weekStart) {
      // Handle validation if any of the fields are missing
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('weekStart', weekStart); // Add weekStart to FormData

    onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl'
    >
      <input
        type='text'
        placeholder='Rota Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='border border-gray-300 rounded-lg p-2 w-full md:w-1/3'
      />

      <input
        type='date' // You can change this to 'text' if you prefer manual input
        placeholder='Week Start Date'
        value={weekStart}
        onChange={(e) => setWeekStart(e.target.value)}
        className='border border-gray-300 rounded-lg p-2 w-full md:w-1/3'
      />

      <input
        type='file'
        accept='.xlsx'
        onChange={handleFileChange}
        className='border border-gray-300 rounded-lg p-2 w-full md:w-1/3'
      />

      <button
        type='submit'
        disabled={isSubmitting}
        className={`bg-slate-700 text-white p-2 rounded-lg hover:bg-lime-900 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Upload
      </button>
    </form>
  );
}
