//components/RotaTable.js

'use client';

import { useState } from 'react';

export default function RotaTable({ data, onUpdate }) {
  const [editingRow, setEditingRow] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  const handleEditClick = (rowIndex) => {
    setEditingRow(rowIndex);
    setUpdatedData(data[rowIndex]);
  };

  const handleInputChange = (e, field) => {
    setUpdatedData({
      ...updatedData,
      [field]: e.target.value,
    });
  };

  const handleSaveClick = () => {
    onUpdate({ [editingRow]: updatedData });
    setEditingRow(null);
  };

  return (
    <div>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Staff
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Post
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Description
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Monday
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Tuesday
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Wednesday
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Thursday
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Friday
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Saturday
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Sunday
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key} className='px-6 py-4 whitespace-nowrap'>
                  {editingRow === index ? (
                    <input
                      type='text'
                      value={updatedData[key]}
                      onChange={(e) => handleInputChange(e, key)}
                      className='w-full px-3 py-1 border border-gray-300 rounded-md'
                    />
                  ) : (
                    updatedData[key] || 'N/A'
                  )}
                </td>
              ))}
              <td className='px-6 py-4 whitespace-nowrap'>
                {editingRow === index ? (
                  <button
                    onClick={handleSaveClick}
                    className='bg-blue-500 text-white px-3 py-1 rounded-md'
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(index)}
                    className='bg-yellow-500 text-white px-3 py-1 rounded-md'
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
