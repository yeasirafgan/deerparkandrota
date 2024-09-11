// components/RotaUploadForm.js

import { useState } from 'react';

export default function RotaUploadForm({ onSubmit, isSubmitting }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');

  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!file || !name) {
      // Handle validation
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

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
        type='file'
        accept='.xlsx'
        onChange={handleFileChange}
        className='border border-gray-300 rounded-lg p-2 w-full md:w-2/3'
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
