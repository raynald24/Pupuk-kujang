import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddSample from './AddSample';
import EditSample from './EditSample';

function SampleList() {
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch samples from the backend
  const fetchSamples = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/samples', { withCredentials: true });
      setSamples(res.data);
      setFilteredSamples(res.data); // Initialize filtered samples
      await new Promise(resolve => setTimeout(resolve, 900));
    } catch (err) {
      console.error(err);
      await new Promise(resolve => setTimeout(resolve, 900));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  useEffect(() => {
    if (location.state && location.state.status) {
      const filtered = samples.filter(sample => sample.status === location.state.status);
      setFilteredSamples(filtered);
    } else {
      setFilteredSamples(samples);
    }
  }, [location.state, samples]);

  // Fungsi untuk memformat tanggal menjadi yyyy-MM-dd
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Fungsi untuk menentukan warna status
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

  // Fungsi untuk memproses pencarian
  const handleSearch = () => {
    let filtered = samples;

    if (searchQuery.trim()) {
      filtered = samples.filter(sample =>
        sample.namaUnitPemohon?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.namaBahan?.nameBahan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.nomorPO?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.nomorSurat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.status?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (location.state && location.state.status) {
      filtered = filtered.filter(sample => sample.status === location.state.status);
    }

    setFilteredSamples(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Fungsi untuk menangani klik tombol Search
  const handleSearchClick = () => {
    handleSearch();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Menyimpan nilai pencarian
  };

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

  const handleEditToggle = (sample = null) => {
    setSelectedSample(sample);
    setIsEditOpen(!isEditOpen);
  };

  const handleDelete = async (id, sampleName) => {
    const alertContainer = document.createElement('div');
    alertContainer.className = 'fixed inset-0 flex items-center justify-center z-50 animate-fade-in';
    alertContainer.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform animate-scale-in">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Delete Sample</h3>
            <p class="text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        <p class="text-gray-700 mb-6">Are you sure you want to delete the sample "${sampleName || 'this sample'}"?</p>
        <div class="flex space-x-3">
          <button id="cancelDelete" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium">
            Cancel
          </button>
          <button id="confirmDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium">
            Delete
          </button>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scale-in {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .animate-fade-in {
        animation: fade-in 0.2s ease-out;
      }
      .animate-scale-in {
        animation: scale-in 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(alertContainer);

    // Handle button clicks
    const handleConfirm = async () => {
      try {
        await axios.delete(`http://localhost:5000/samples/${id}`, { withCredentials: true });
        fetchSamples();
        document.body.removeChild(alertContainer);
        document.head.removeChild(style);
      } catch (err) {
        console.error('Error deleting sample:', err);
        document.body.removeChild(alertContainer);
        document.head.removeChild(style);
      }
    };

    const handleCancel = () => {
      document.body.removeChild(alertContainer);
      document.head.removeChild(style);
    };

    document.getElementById('confirmDelete').addEventListener('click', handleConfirm);
    document.getElementById('cancelDelete').addEventListener('click', handleCancel);
    alertContainer.addEventListener('click', (e) => {
      if (e.target === alertContainer) handleCancel();
    });
  };

  const handleMoreInfo = (id) => {
    navigate('/sample/moreinfo', { state: { sampleId: id } });
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Sample Data</h3>
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
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-blue-100/25 bg-opacity-50 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">Sample Management</h1>
          </div>
          <p className="text-sky-100 text-lg">Manage and track your laboratory samples</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block pl-10 pr-20 py-3 w-full text-sm border-2 border-white border-opacity-20 rounded-xl bg-white bg-opacity-90 backdrop-blur-sm focus:ring-4 focus:ring-sky-300 focus:border-sky-300 placeholder-gray-500 shadow-lg"
              placeholder="Search by unit, material, PO number, or status..."
              required
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="absolute inset-y-0 right-0 px-6 text-sm font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-r-xl transition-all duration-300 shadow-lg"
            >
              Search
            </button>
          </div>

          <div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="group bg-white bg-opacity-20 backdrop-blur-sm text-black px-6 py-3 rounded-xl hover:bg-opacity-30 transition-all duration-300 font-semibold shadow-lg border border-white border-opacity-30 flex items-center space-x-2 transform hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="group-hover:tracking-wider transition-all duration-300">Add Sample</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-sky-600 to-blue-700">
              <tr>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Unit Pemohon</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Tanggal Surat</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Nama Bahan</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Nomor PO</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Nomor Surat</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-white text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPageData.map((sample, index) => (
                <tr 
                  className="hover:bg-gray-50 transition-colors duration-200" 
                  key={sample.uuid}
                >
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + (index + 1)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700 font-medium">
                    {sample.namaUnitPemohon}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {formatDate(sample.tanggalSurat)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700 font-medium">
                    {sample.namaBahan?.namaBahan}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 font-mono">
                    {sample.nomorPO}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 font-mono">
                    {sample.nomorSurat}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(sample.status)}`}>
                      {sample.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleEditToggle(sample)} 
                        className="group bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1"
                      >
                        <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(sample.uuid, sample.namaUnitPemohon)} 
                        className="group bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1"
                      >
                        <svg className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                      <button 
                        onClick={() => handleMoreInfo(sample.uuid)} 
                        className="group bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1"
                      >
                        <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Info</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
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

      <AddSample 
        isModalOpen={isModalOpen} 
        handleModalToggle={setIsModalOpen} 
        onSaved={fetchSamples}
        modalClass="animate-modal-enter"
      />
      <EditSample 
        isEditOpen={isEditOpen} 
        handleEditToggle={handleEditToggle} 
        sample={selectedSample} 
        onSaved={fetchSamples}
        modalClass="animate-modal-enter"
      />
    </div>
  );
}

export default SampleList;
