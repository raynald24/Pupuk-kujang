import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AnalysisList() {
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchSamples = async () => {
    try {
      const res = await axios.get('http://localhost:5000/samples', { withCredentials: true });
      setSamples(res.data);
      setFilteredSamples(res.data);
    } catch (err) {
      console.error('Error fetching samples:', err);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  // Pagination logic
  const paginate = (samples, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return samples.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredSamples.length / itemsPerPage);
  const currentPageData = paginate(filteredSamples, currentPage, itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    applyFilters(searchQuery, statusFilter); // Apply filter when search button is clicked
  };

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);
  };

  const applyFilters = (searchQuery, statusFilter) => {
    let filtered = samples;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(sample =>
        sample.nomorPO.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sample.namaBahan && sample.namaBahan.namaBahan && sample.namaBahan.namaBahan.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter when search button is clicked
    if (statusFilter) {
      filtered = filtered.filter(sample => sample.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredSamples(filtered);
  };

  const handleAnalysis = (sampleId) => {
    // Navigate to the analysis page and pass sampleId as state
    navigate('/analysis/result', { state: { sampleId } });
  };

  const handleMoreInfo = (id) => {
    navigate('/sample/moreinfo', { state: { sampleId: id } });
  };

  return (
    <div className="bg-gray-200 min-h-screen p-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-8 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-white text-left">Analysis Page</h1>
        <h2 className="text-gray-200 text-left">List of Samples for Analysis</h2>
        <div className="w-full mx-auto flex items-center gap-x-5 mb-4 pt-6 justify-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block p-2.5 w-full text-sm rounded-e-lg border focus:ring-2 focus:ring-sky-500"
              placeholder="Search by PO or Material Name"
              required
            />
          </div>

          <div className="relative flex-1">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="block p-2.5 w-full text-sm rounded-e-lg border focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="p-2.5 text-sm font-medium text-white bg-sky-700 rounded-e-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table of samples */}
      <div className="w-full overflow-x-auto rounded-2xl border-sky-500 border-1">
        <table className="min-w-full table-auto bg-white text-black shadow-md rounded-lg">
          <thead className="bg-sky-600 text-white">
            <tr className="text-center">
              <th className="px-4 py-2 font-medium">No</th>
              <th className="px-4 py-2 font-medium">No PO</th>
              <th className="px-4 py-2 font-medium">Nama Bahan</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((sample, index) => (
              <tr className="border-t text-center" key={sample.uuid}>
                <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                <td className="px-4 py-2">{sample.nomorPO}</td>
                <td className="px-4 py-2">{sample.namaBahan && sample.namaBahan.namaBahan}</td>
                <td className="px-4 py-2">{sample.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleAnalysis(sample.uuid)}
                    className="bg-[#015db2] text-white px-3 py-1 rounded-md hover:bg-[#5fa7c9] transition duration-300"
                  >
                    Analysis
                  </button>
                  <button
                    onClick={() => handleMoreInfo(sample.uuid)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300 ml-2"
                  >
                    More Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 text-white bg-sky-500 rounded-md hover:bg-sky-600 disabled:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 text-white bg-sky-500 rounded-md hover:bg-sky-600 disabled:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AnalysisList;
