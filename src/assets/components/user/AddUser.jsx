import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AddUser = ({ isModalOpen, handleModalToggle }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");  // Ubah menjadi confPassword
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");  // Pesan error
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();

    // Pastikan password dan confirm password cocok
    if (password !== confPassword) {
      setMsg("Password and confirm password do not match.");
      return;
    }

    try {
      // Kirim request POST untuk menambahkan user
      await axios.post("http://localhost:5000/users", {
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,  // Pastikan sesuai dengan backend
        role: role,
      });
      
      // Setelah berhasil, tutup modal dan navigasi ke halaman /users
      handleModalToggle(); // Menutup modal
      navigate("/users");  // Arahkan ke halaman user setelah sukses
    } catch (error) {
      // Menangani error dan menampilkan pesan dari backend
      if (error.response) {
        setMsg(error.response.data.msg);  // Menampilkan pesan dari backend
      } else {
        setMsg("Something went wrong!");  // Pesan error umum
      }
    }
  };

  if (!isModalOpen) return null;  // Hanya tampilkan jika modal terbuka

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0"></div>

      {/* Modal Content */}
      <div className="relative bg-white p-8 rounded-lg w-130 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New User</h2>

        <form onSubmit={saveUser}>
          {/* Pesan error */}
          <p className="text-center text-red-500">{msg}</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter user name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#015db2]"
              placeholder="Confirm password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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

export default AddUser;
