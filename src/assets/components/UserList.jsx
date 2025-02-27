import React, { useEffect, useState } from 'react';
import AddUser from '../components/user/AddUser'; 
import EditUser from '../components/user/EditUser'; // Import EditUser
import axios from 'axios';

const UserList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Menyimpan user yang sedang diedit

  // Toggle modal
  const handleModalToggle = (user = null) => {
    setCurrentUser(user); // Set currentUser untuk EditUser atau null untuk AddUser
    setIsModalOpen(!isModalOpen); // Toggle modal state
  };

  // Mendapatkan daftar users
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axios.get("http://localhost:5000/users");
    setUsers(response.data);
  };

  // Menghapus user
  const deleteUser = async (userId) => {
    await axios.delete(`http://localhost:5000/users/${userId}`);
    getUsers();
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="pb-5">
        <h1 className="text-3xl font-bold">Users</h1>
        <h2 className="text-zinc-500">List of Users</h2>  
      </div>
 
      <div className="flex flex-col items-center space-y-4">
        {/* Add User Button */}
        <button
          onClick={() => handleModalToggle()} // Call handleModalToggle without user for AddUser
          className="self-end bg-[#015db2] text-white px-4 py-2 rounded-md hover:bg-[#5fa7c9] transition duration-300"
        >
          Add User
        </button>

        <div className="w-full overflow-x-auto rounded-2xl border-[#5fa7c9] border-1">
          <table className="min-w-full table-auto bg-white text-black shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium">No</th>
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">Role</th>
                <th className="px-4 py-2 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.uuid} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleModalToggle(user)} // Pass selected user to EditUser
                      className="bg-[#015db2] text-white px-3 py-1 rounded-md hover:bg-[#5fa7c9] transition duration-300"
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
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
