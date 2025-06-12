import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AnalysisList() {
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchSamples = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/samples', { withCredentials: true });
      setSamples(res.data);
      setFilteredSamples(res.data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Error fetching samples:', err);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

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
    applyFilters(searchQuery, statusFilter);
  };

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);
  };

  const applyFilters = (searchQuery, statusFilter) => {
    let filtered = samples;

    if (searchQuery) {
      filtered = filtered.filter(sample =>
        sample.nomorPO.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sample.namaBahan && sample.namaBahan.namaBahan && sample.namaBahan.namaBahan.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(sample => sample.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredSamples(filtered);
  };

  const handleAnalysis = (sampleId) => {
    navigate('/analysis/result', { state: { sampleId } });
  };

  const handleMoreInfo = (id) => {
    navigate('/sample/moreinfo', { state: { sampleId: id } });
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending') || statusLower.includes('waiting')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (statusLower.includes('complete') || statusLower.includes('done') || statusLower.includes('finished')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (statusLower.includes('cancel') || statusLower.includes('reject') || statusLower.includes('failed')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (statusLower.includes('process') || statusLower.includes('progress')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const LoadingComponent = () => (
    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-gray-100 bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 animate-spin">
            <div className="w-4 h-4 bg-sky-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            <div className="w-4 h-4 bg-sky-600 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDirection: 'reverse', animationDelay: '0.5s' }}>
            <div className="w-4 h-4 bg-sky-400 rounded-full absolute top-1/4 right-0"></div>
            <div className="w-4 h-4 bg-sky-700 rounded-full absolute bottom-1/4 left-0"></div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Analysis Data</h3>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">Please wait</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-600 p-8 rounded-2xl shadow-xl mb-8 border border-sky-300">
        <div className="pb-6">
          <h1 className="text-4xl font-bold text-white">Analysis Page</h1>
          <h2 className="text-sky-100 text-lg">List of Samples for Analysis</h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block p-2.5 w-full text-sm border-2 border-white border-opacity-20 rounded-xl bg-white bg-opacity-90 backdrop-blur-sm focus:ring-4 focus:ring-sky-300 focus:border-sky-300 placeholder-gray-500 shadow-lg"
              placeholder="Search by PO or Material Name"
              required
            />
          </div>
          <div className="relative flex-1 w-full">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="block p-2.5 w-full text-sm border-2 border-white border-opacity-20 rounded-xl bg-white bg-opacity-90 backdrop-blur-sm focus:ring-4 focus:ring-sky-300 focus:border-sky-300"
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
            className="p-2.5 text-sm font-medium text-white bg-sky-700 rounded-xl hover:bg-sky-800 transition-all duration-300 shadow-lg"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-sky-600 to-blue-700">
              <tr>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">No PO</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Nama Bahan</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPageData.map((sample, index) => (
                <tr className="hover:bg-gray-50 transition-colors duration-200" key={sample.uuid}>
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + (index + 1)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700 font-medium">
                    {sample.nomorPO}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700 font-medium">
                    {sample.namaBahan && sample.namaBahan.namaBahan}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(sample.status)}`}>
                      {sample.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleAnalysis(sample.uuid)}
                        className=" bg-blue-500 text-white px-3 py-2  hover:bg-blue-600 rounded-lg transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m-3-3H9m3-4a9 9 0 100 18 9 9 0 000-18z" />
                        </svg>
                        Analysis
                      </button>
                      <button
                        onClick={() => handleMoreInfo(sample.uuid)}
                        className="flex items-center bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105 space-x-1"
                      >
                        <svg className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Info
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSamples.length)} of {filteredSamples.length} samples
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 text-sm font-medium text-sky-600 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-all duration-300 shadow-md"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 shadow-md ${
                  currentPage === i + 1
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-sky-600 border border-sky-300 hover:bg-sky-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 text-sm font-medium text-sky-600 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-all duration-300 shadow-md"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisList;
