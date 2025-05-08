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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch samples from the backend
  const fetchSamples = async () => {
    try {
      const res = await axios.get('http://localhost:5000/samples', { withCredentials: true });
      setSamples(res.data);
      setFilteredSamples(res.data); // Initialize filtered samples
    } catch (err) {
      console.error(err);
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

  // Handle search functionality
  const handleSearch = () => {
    let filtered = samples;

    if (searchQuery) {
      filtered = samples.filter(sample =>
        sample.namaUnitPemohon.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.namaBahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.nomorPO.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sample.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (location.state && location.state.status) {
      filtered = filtered.filter(sample => sample.status === location.state.status);
    }

    setFilteredSamples(filtered);
  };

  const handleSearchChange = (event) => {
    const capitalizedInput = event.target.value.toUpperCase(); 
    setSearchQuery(capitalizedInput); 
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

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this sample?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/samples/${id}`, { withCredentials: true });
        fetchSamples(); 
      } catch (err) {
        console.error('Error deleting sample:', err);
      }
    }
  };

  const handleMoreInfo = (id) => {
    navigate('/sample/moreinfo', { state: { sampleId: id } });
  };

  return (
    <div className="bg-gray-200 min-h-screen p-6">
      {/* Header with gradient blue background */}
      <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-8 rounded-xl shadow-lg mb-8">
        <div className="pb-5">
          <h1 className="text-3xl font-bold text-white">Samples</h1>
          <h2 className="text-gray-200">List of Samples</h2>
        </div>

        <div className="w-full mx-auto flex items-center gap-x-5 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}  
              className="block p-2.5 w-full text-sm rounded-e-lg border focus:ring-2 focus:ring-sky-500"
              placeholder="Search Name of Sample, Staff, Type of Sample"
              required
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-sky-700 rounded-e-lg"
            >
              Search
            </button>
          </div>

          <div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-[#015db2] text-white px-4 py-2 rounded-md hover:bg-[#5fa7c9] transition duration-300"
            >
              Add Sample
            </button>
          </div>
        </div>
      </div>

      {/* Table of samples */}
      <div className="w-full overflow-x-auto rounded-2xl border-sky-500 border-1">
        <table className="min-w-full table-auto bg-white text-black shadow-md rounded-lg">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="px-4 py-2 text-center font-medium">No</th>
              <th className="px-4 py-2 text-center font-medium">Nama Unit pemohon</th>
              <th className="px-4 py-2 text-center font-medium">Tanggal surat /PM/POK</th>
              <th className="px-4 py-2 text-center font-medium">Nama Bahan</th>
              <th className="px-4 py-2 text-center font-medium">Nomor PO</th>
              <th className="px-4 py-2 text-center font-medium">Nomor Surat</th>
              <th className="px-4 py-2 text-center font-medium">Status</th>
              <th className="px-4 py-2 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((sample, index) => (
              <tr className="border-t text-center" key={sample.uuid}>
                <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                <td className="px-4 py-2">{sample.namaUnitPemohon}</td>
                <td className="px-4 py-2">{formatDate(sample.tanggalSurat)}</td>
                <td className="px-4 py-2">{sample.namaBahan?.namaBahan}</td> 
                <td className="px-4 py-2">{sample.nomorPO}</td>
                <td className="px-4 py-2">{sample.nomorSurat}</td>
                <td className="px-4 py-2">{sample.status}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEditToggle(sample)} className="bg-[#015db2] text-white px-3 py-1 rounded-md hover:bg-[#5fa7c9] transition duration-300">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(sample.uuid)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 ml-2">
                    Delete
                  </button>
                  <button onClick={() => handleMoreInfo(sample.uuid)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300 ml-2">
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

      <AddSample isModalOpen={isModalOpen} handleModalToggle={setIsModalOpen} onSaved={fetchSamples} />
      <EditSample isEditOpen={isEditOpen} handleEditToggle={handleEditToggle} sample={selectedSample} onSaved={fetchSamples} />
    </div>
  );
}

export default SampleList;
