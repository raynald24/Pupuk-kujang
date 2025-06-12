import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditUser from "./EditUser"
import AddUser from "./AddUser"
import axios from 'axios';
import { Users, PlusCircle, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const UserList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 7;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const paginate = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentPageData = paginate(filteredUsers, currentPage, itemsPerPage);

  const handleModalToggle = (user = null) => {
    setCurrentUser(user);
    setIsModalOpen(!isModalOpen);
  };

  const deleteUser = async (userId) => {
    await axios.delete(`http://localhost:5000/users/${userId}`);
    fetchUsers();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-600 p-8 rounded-xl shadow-lg mb-8 relative overflow-hidden"
        variants={headerVariants}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="relative pb-5 flex items-center gap-4">
          <motion.div
            className="bg-white/20 p-3 rounded-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={28} className="text-white" />
          </motion.div>
          <div>
            <motion.h1
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Users
            </motion.h1>
            <motion.h2
              className="text-blue-100 text-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              List of Users
            </motion.h2>
          </div>
        </div>

        <div className="w-full mx-auto flex items-center gap-x-5 mb-4">
          <motion.div
            className="relative flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block p-2.5 w-full text-sm rounded-md border focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder-white/70"
              placeholder="Search Name, Email, Role"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700/50 rounded-r-md hover:bg-blue-800/50 backdrop-blur-sm transition duration-300 flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </motion.button>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModalToggle()}
            className="self-end bg-blue-700/50 text-white px-4 py-2 rounded-md hover:bg-blue-800/50 backdrop-blur-sm transition duration-300 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add User
          </motion.button>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        className="w-full overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-xl"
        variants={tableVariants}
      >
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 text-white">
            <tr>
              <th className="px-6 py-4 text-center font-medium">No</th>
              <th className="px-6 py-4 text-center font-medium">Name</th>
              <th className="px-6 py-4 text-center font-medium">Email</th>
              <th className="px-6 py-4 text-center font-medium">Role</th>
              <th className="px-6 py-4 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentPageData.map((user, index) => (
                <motion.tr
                  key={user.uuid}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="border-t text-center hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModalToggle(user)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-300 flex items-center gap-1"
                    >
                      <Edit2 size={16} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteUser(user.uuid)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Pagination Section */}
      <motion.div
        className="flex justify-center items-center gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
          Previous
        </motion.button>
        <span className="px-4 py-2 text-lg font-semibold text-gray-700 bg-white rounded-md shadow">
          Page {currentPage} of {totalPages}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight size={18} />
        </motion.button>
      </motion.div>

      {/* Add or Edit User Modal */}
      {isModalOpen && (
        currentUser ? (
          <EditUser
            isModalOpen={isModalOpen}
            handleModalToggle={handleModalToggle}
            currentUser={currentUser}
          />
        ) : (
          <AddUser isModalOpen={isModalOpen} handleModalToggle={handleModalToggle} />
        )
      )}
    </motion.div>
  );
};

export default UserList;