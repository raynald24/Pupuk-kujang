import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation untuk membaca state dari Dashboard
import axios from 'axios';
import AddSample from './AddSample';  // Assuming AddSample is a modal component
import EditSample from './EditSample';  // Assuming EditSample is a modal component

function SampleList() {
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk menyimpan query pencarian
  const location = useLocation(); // Hook untuk mengambil state dari Dashboard
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch samples dari backend
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
    // Jika ada status dari Dashboard, otomatis filter berdasarkan status tersebut
    if (location.state && location.state.status) {
      const filtered = samples.filter(sample => sample.status === location.state.status);
      setFilteredSamples(filtered); // Update filteredSamples sesuai status
    } else {
      // Jika tidak ada status filter, reset filtered samples ke semua samples
      setFilteredSamples(samples);
    }
  }, [location.state, samples]);

  // Fungsi untuk memformat tanggal menjadi yyyy-MM-dd
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0]; // Hanya ambil bagian yyyy-MM-dd
  };

  // Fungsi untuk menangani pencarian
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

    // Terapkan filter berdasarkan status jika ada
    if (location.state && location.state.status) {
      filtered = filtered.filter(sample => sample.status === location.state.status);
    }

    setFilteredSamples(filtered);
  };

  // Handle perubahan input pencarian
  const handleSearchChange = (event) => {
    const capitalizedInput = event.target.value.toUpperCase(); // Ubah input ke huruf besar
    setSearchQuery(capitalizedInput); // Set input yang sudah diubah menjadi kapital
  };

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

  // Edit and Delete handlers
  const handleEditToggle = (sample = null) => {
    setSelectedSample(sample);
    setIsEditOpen(!isEditOpen); 
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this sample?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/samples/${id}`, { withCredentials: true });
        fetchSamples(); // Refetch samples after deletion
      } catch (err) {
        console.error('Error deleting sample:', err);
      }
    }
  };

  const handleMoreInfo = (id) => {
    // You can add logic for showing more details or opening a modal for more info
    alert(`More Info for Sample ID: ${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="pb-5">
        <h1 className="text-3xl font-bold">Samples</h1>
        <h2 className="text-zinc-500">List of Samples</h2>
      </div>

      <div className="w-full mx-auto flex items-center gap-x-5 mb-4">
        <div className="relative flex-1">
          {/* Input Pencarian */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}  // Ubah input menjadi huruf kapital
            className="block p-2.5 w-full text-sm rounded-e-lg border focus:ring-blue-500"
            placeholder="Search Name of Sample, Staff, Type of Sample"
            required
          />
          {/* Tombol Search */}
          <button
            type="button"
            onClick={handleSearch}
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg"
          >
            Search
          </button>
        </div>

        <div>
          {/* Add Sample Button */}
          <button onClick={() => setIsModalOpen(true)} className="bg-[#015db2] text-white px-4 py-2 rounded-md hover:bg-[#5fa7c9] transition duration-300">
            Add Sample
          </button>
        </div>
      </div>

      {/* Tabel Samples */}
      <div className="w-full overflow-x-auto rounded-2xl border-[#5fa7c9] border-1">
        <table className="min-w-full table-auto bg-white text-black shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium">No</th>
              <th className="px-4 py-2 text-left font-medium">Nama Unit pemohon</th>
              <th className="px-4 py-2 text-left font-medium">Tanggal surat /PM/POK</th>
              <th className="px-4 py-2 text-left font-medium">Nama Bahan</th>
              <th className="px-4 py-2 text-left font-medium">Nomor PO</th>
              <th className="px-4 py-2 text-left font-medium">Nomor Surat</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((sample, index) => (
              <tr className="border-t" key={sample.uuid}>
                <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                <td className="px-4 py-2">{sample.namaUnitPemohon}</td>
                <td className="px-4 py-2">{formatDate(sample.tanggalSurat)}</td>
                <td className="px-4 py-2">{sample.namaBahan}</td>
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
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
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
