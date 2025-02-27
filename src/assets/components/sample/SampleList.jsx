import React, { useState } from 'react';
import AddSample from './AddSample';
import EditSample from './EditSample';

function SampleList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleEditToggle = () => {
    console.log('Toggling Edit Modal'); // Menambahkan log untuk debug
    setIsEditOpen(!isEditOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="pb-5">
        <h1 className="text-3xl font-bold">Samples</h1>
        <h2 className="text-zinc-500">List of Samples</h2>
      </div>
      
      {/* Form Search and Add Sample Button */}
      <div className="w-full mx-auto flex items-center gap-x-5 mb-4">
        {/* Input Search */}
        <div className="relative flex-1">
          <input 
            type="search" 
            id="search-dropdown" 
            className="block p-2.5 w-full text-sm rounded-e-lg border focus:ring-blue-500  dark:bg-white dark:border-s-blue-600 dark:placeholder-gray-400 dark:text-[#000] dark:focus:border-blue-500" 
            placeholder="Search Name of Sample, Staff, Type of Sample" 
            required 
          />
          <button 
            type="submit" 
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
        
        {/* Button Add Sample (diletakkan di sebelah kanan search bar) */}
        <div>
          <button
            onClick={handleModalToggle}
            className="bg-[#015db2] text-white px-4 py-2 rounded-md hover:bg-[#5fa7c9] transition duration-300"
          >
            Add Sample
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto rounded-2xl border-[#5fa7c9] border-1">
        <table className="min-w-full table-auto bg-white text-black shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium">No</th>
              <th className="px-4 py-2 text-left font-medium">Name of Sample</th>
              <th className="px-4 py-2 text-left font-medium">Type of Test</th>
              <th className="px-4 py-2 text-left font-medium">Staff</th>
              <th className="px-4 py-2 text-left font-medium">Deadline</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">Sample 1</td>
              <td className="px-4 py-2">Test 1</td>
              <td className="px-4 py-2">John Doe</td>
              <td className="px-4 py-2">2025-02-25</td>
              <td className="px-4 py-2">Pending</td>
              <td className="px-4 py-2">
                <button
                  onClick={handleEditToggle} // Menambahkan fungsi toggle di sini
                  className="bg-[#015db2] text-white px-3 py-1 rounded-md hover:bg-[#5fa7c9] transition duration-300"
                >
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 ml-2">
                  Delete
                </button>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300 ml-2">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Add Sample */}
      <AddSample isModalOpen={isModalOpen} handleModalToggle={handleModalToggle} />
      
      {/* Modal Edit Sample */}
      <EditSample isEditOpen={isEditOpen} handleEditToggle={handleEditToggle} />
    </div>
  );
}

export default SampleList;
