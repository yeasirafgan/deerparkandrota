// app/rota/page.js

'use client';

import { useState } from 'react';
import RotaUploadForm from '/components/RotaUploadForm';
import RotaList from '/components/RotaList';

export default function RotaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleUpload(formData) {
    setIsSubmitting(true);
    const response = await fetch('/api/rota/create', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      // Handle success, e.g., show a success message or redirect
    } else {
      // Handle error
    }
    setIsSubmitting(false);
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold text-lime-900'>Manage Rota</h1>
          <RotaUploadForm onSubmit={handleUpload} isSubmitting={isSubmitting} />
        </div>
        <RotaList />
      </div>
    </div>
  );
}
