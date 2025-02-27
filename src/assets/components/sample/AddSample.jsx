import React from 'react';

const AddSample = ({ isModalOpen, handleModalToggle }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Background Overlay with reduced opacity */}
      <div className="absolute "></div>

      {/* Modal Content */}
      <div className="relative bg-white p-8 rounded-lg w-130 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Sample</h2>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter user name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleModalToggle}
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#015db2] text-white rounded-md hover:bg-[#5fa7c9] transition duration-300"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSample;