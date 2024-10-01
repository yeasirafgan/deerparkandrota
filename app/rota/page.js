'use client';

import RotaList from '@/components/RotaList';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import RotaUploadForm from '/components/RotaUploadForm';

export default function RotaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false); // New state to trigger re-fetch
  const { getPermission } = useKindeBrowserClient();
  const requiredPermission = getPermission('delete:timesheet');

  async function handleUpload(formData) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/rota/create', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setShouldRefresh((prev) => !prev); // Trigger re-fetch
      } else {
        console.error('Error response:', result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!requiredPermission?.isGranted) {
      redirect('/timesheet');
    }
  }, [requiredPermission]);

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
          <RotaList userRole='admin' shouldRefresh={shouldRefresh} />{' '}
          {/* Pass the refresh state */}
        </div>
      </div>

      {/* Go Back Button
      <div className='flex justify-end items-center mt-4 pr-6'>
        <Link
          href={'/admin'}
          className='px-4 py-2 bg-slate-700 hover:bg-slate-900 text-white rounded text-xs sm:text-sm'
        >
          Go Back
        </Link>
      </div> */}
    </div>
  );
}
