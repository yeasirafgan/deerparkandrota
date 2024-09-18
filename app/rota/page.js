// app/rota/page.js

'use client';

import { useState } from 'react';
import RotaUploadForm from '/components/RotaUploadForm';
import RotaList from '/components/RotaList';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RotaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleUpload(formData) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/rota/create', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        router.refresh(); // Refresh the page to reflect changes
      } else {
        console.error('Error response:', result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='container mx-auto'>
        {/* Heading */}
        <h1 className='text-2xl font-bold text-lime-900 mb-6'>Manage Rota</h1>

        {/* Rota Upload Form */}
        <div className='w-full mb-6'>
          <RotaUploadForm
            onSubmit={handleUpload}
            isSubmitting={isSubmitting}
            className='w-full'
          />
        </div>

        {/* Rota List */}
        <div className='w-full'>
          <RotaList userRole='admin' />
        </div>
      </div>

      {/* Go Back Button */}
      <div className='flex justify-end items-center mt-4 pr-6'>
        <Link
          href={'/admin'}
          className='px-4 py-2 bg-slate-700 hover:bg-slate-900 text-white rounded text-xs sm:text-sm'
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
