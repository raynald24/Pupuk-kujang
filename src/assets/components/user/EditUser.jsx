import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUser = ({ isModalOpen, handleModalToggle, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confPassword: '',
    role: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        password: '', // Kosongkan password ketika edit
        confPassword: ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Menyiapkan data yang akan dikirim
      const dataToSend = { ...formData };

      // Jika password diisi, tambahkan confirm password
      if (formData.password && formData.password !== '') {
        dataToSend.confPassword = formData.confPassword; // Menambahkan confirm password
      }

      await axios.patch(`http://localhost:5000/users/${currentUser.uuid}`, dataToSend);
      handleModalToggle(); // Menutup modal setelah berhasil update
    } catch (error) {
      console.error("There was an error updating the user:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0"></div>
      <div className="relative bg-white p-8 rounded-lg w-130 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit User</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter user name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confPassword"
              value={formData.confPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Confirm new password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
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

export default EditUser;
