import React, { useEffect, useState } from 'react';
import AddUser from './AddUser'
import EditUser from './EditUser'; // Import EditUser
import axios from 'axios';

const UserList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Menyimpan user yang sedang diedit
  const [searchQuery, setSearchQuery] = useState(''); // State untuk menyimpan query pencarian
  const [filteredUsers, setFilteredUsers] = useState([]); // State untuk menyaring hasil pencarian
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman
  const itemsPerPage = 7; // Batas 7 data per halaman

  // Fetch users dari backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      setUsers(res.data);
      setFilteredUsers(res.data); 
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Menghitung data yang akan ditampilkan pada halaman saat ini
  const paginate = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredUsers(users); // Jika tidak ada query pencarian, tampilkan semua users
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered); // Menyaring users berdasarkan query pencarian
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Menangani perubahan halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentPageData = paginate(filteredUsers, currentPage, itemsPerPage);

  // Toggle modal
  const handleModalToggle = (user = null) => {
    setCurrentUser(user); // Set currentUser untuk EditUser atau null untuk AddUser
    setIsModalOpen(!isModalOpen); // Toggle modal state
  };

  // Menghapus user
  const deleteUser = async (userId) => {
    await axios.delete(`http://localhost:5000/users/${userId}`);
    fetchUsers();
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="pb-5">
        <h1 className="text-3xl font-bold">Users</h1>
        <h2 className="text-zinc-500">List of Users</h2>
      </div>

      <div className="flex items-center mb-4 space-x-4">
        {/* Input Pencarian */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange} // Handle perubahan input
            className="block p-2.5 w-full text-sm rounded-md border focus:ring-blue-500"
            placeholder="Search Name, Email, Role"
          />
          <button
            type="button"
            onClick={handleSearch} // Fungsi pencarian dipanggil saat tombol klik
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-md"
          >
            Search
          </button>
        </div>
        {/* Add User Button */}
        <button
          onClick={() => handleModalToggle()} // Call handleModalToggle without user for AddUser
          className="self-end bg-[#015db2] text-white px-4 py-2 rounded-md hover:bg-[#5fa7c9] transition duration-300"
        >
          Add User
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto rounded-2xl border-[#5fa7c9] border-1">
        <table className="min-w-full table-auto bg-white text-black shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium">No</th>
              <th className="px-6 py-3 text-left font-medium">Name</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-left font-medium">Role</th>
              <th className="px-6 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((user, index) => (
              <tr key={user.uuid} className="border-t">
                <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleModalToggle(user)} // Pass selected user to EditUser
                    className="bg-[#015db2] text-white px-3 py-1 rounded-md hover:bg-[#5fa7c9] transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.uuid)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-5 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-5 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add or Edit User Modal */}
      {isModalOpen && (
        currentUser ? (
          <EditUser
            isModalOpen={isModalOpen}
            handleModalToggle={handleModalToggle}
            currentUser={currentUser} // Pass selected user to EditUser
          />
        ) : (
          <AddUser isModalOpen={isModalOpen} handleModalToggle={handleModalToggle} />
        )
      )}
    </div>
  );
};

export default UserList;
