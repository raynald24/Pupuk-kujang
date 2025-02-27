import React from 'react';

const EditSample = ({ isEditOpen, handleEditToggle }) => {
  if (!isEditOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-50"></div>

      {/* Modal Content */}
      <div className="relative bg-white p-8 rounded-lg w-130 shadow-lg z-10">
        <h2 className="text-2xl font-semibold mb-4">Edit Sample</h2>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              defaultValue="Sample 1" // Contoh, bisa diganti dengan state atau prop
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              defaultValue="Test 1" // Contoh
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Staff</label>
            <input
              type="text"
              defaultValue="John Doe" // Contoh
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              defaultValue="2025-02-25" // Contoh
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleEditToggle} // Menggunakan handleEditToggle untuk menutup modal
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type=""
              className="px-4 py-2 bg-[#015db2] text-white rounded-md hover:bg-[#5fa7c9] transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSample;
