//app/rota/[id]/page.js
'use client';

import { useState, useEffect } from 'react';

export default function RotaDetailsPage({ params }) {
  const { id } = params; // Dynamic route param
  const [rotaDetails, setRotaDetails] = useState(null);
  const [rotaName, setRotaName] = useState('');

  useEffect(() => {
    async function fetchRotaDetails() {
      try {
        const response = await fetch(`/api/rota/${id}`);
        const data = await response.json();

        if (data && Array.isArray(data.parsedData)) {
          // Exclude unnecessary rows (e.g., first two rows)
          const formattedData = data.parsedData
            .slice(1) // Skip the first row if needed
            .filter(
              (row) =>
                !(
                  row.staff === 'Upstairs Cleaning' ||
                  row.staff === 'Abuu Daud' ||
                  row.staff.includes('NIGHT STAFF')
                )
            ) // Filter out unwanted rows
            .map((row) => ({
              staff: row.staff,
              post: row.post, // Combined field
              monday: row.monday,
              tuesday: row.tuesday,
              wednesday: row.wednesday,
              thursday: row.thursday,
              friday: row.friday,
              saturday: row.saturday,
              sunday: row.sunday,
            }));
          setRotaDetails(formattedData);
          setRotaName(data.name); // Set the rota name
        } else {
          console.error('Unexpected response format', data);
          setRotaDetails(null);
        }
      } catch (error) {
        console.error('Failed to fetch rota details', error);
        setRotaDetails(null);
      }
    }

    if (id) {
      fetchRotaDetails();
    }
  }, [id]);

  if (!rotaDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='rota-details-container p-6'>
      <h1 className='text-lg font-semibold text-lime-900 mb-3 mt-3 ml-5'>
        Deer park staff rota for: {rotaName}
      </h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Staff
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Post
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Monday
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Tuesday
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Wednesday
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Thursday
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Friday
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Saturday
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-lime-700 uppercase tracking-wider border-b border-gray-200'>
                Sunday
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {rotaDetails.map((rota, index) => (
              <tr
                key={index}
                className='hover:bg-gray-100 hover:shadow-md transition-all duration-200 ease-in-out'
              >
                <td className='px-4 py-2 whitespace-nowrap text-sm font-semibold text-slate-950 border-r border-gray-200'>
                  {rota.staff}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-slate-950 border-r border-gray-200'>
                  {rota.post}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-slate-950 border-r border-gray-200'>
                  {rota.monday}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-slate-950 border-r border-gray-200'>
                  {rota.tuesday}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-slate-950 border-r border-gray-200'>
                  {rota.wednesday}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-slate-950 border-r border-gray-200'>
                  {rota.thursday}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-slate-950 border-r border-gray-200'>
                  {rota.friday}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-slate-950 border-r border-gray-200'>
                  {rota.saturday}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-slate-950'>
                  {rota.sunday}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
