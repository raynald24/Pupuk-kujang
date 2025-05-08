import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSample = ({ isModalOpen, handleModalToggle, onSaved }) => {
  const [formData, setFormData] = useState({
    namaUnitPemohon: '',
    tanggalSurat: '',
    namaBahan: '',  // Using namaBahanId, will be changed after selecting the data
    nomorPO: '',
    nomorSurat: '',
    status: 'pending',
    noKendaraan: '',
    isiBerat: '',
    jumlahContoh: '',
    noKodeContoh: '',
    noSuratPOK: ''
  });

  const [namaBahanList, setNamaBahanList] = useState([]);  // State for the available list of bahan
  const [currentStep, setCurrentStep] = useState(1); // For step tracking (1st or 2nd part)

  // Fetch available bahan from API
  useEffect(() => {
    const fetchNamaBahan = async () => {
      try {
        const res = await axios.get('http://localhost:5000/namaBahan');
        setNamaBahanList(res.data);  // Store the fetched data of namaBahan
      } catch (err) {
        console.error(err);
      }
    };

    fetchNamaBahan();
  }, []); // This effect will only run once when the component first mounts

  if (!isModalOpen) return null;  // Do not render the modal if it's not open

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the form data to the backend, make sure to use namaBahanId
      const response = await axios.post('http://localhost:5000/samples', {
        namaUnitPemohon: formData.namaUnitPemohon,
        tanggalSurat: formData.tanggalSurat,
        namaBahanId: formData.namaBahan,  // Sending the namaBahanId
        nomorPO: formData.nomorPO,
        nomorSurat: formData.nomorSurat,
        status: formData.status,
        noKendaraan: formData.noKendaraan,
        isiBerat: formData.isiBerat,
        jumlahContoh: formData.jumlahContoh,
        noKodeContoh: formData.noKodeContoh,
        noSuratPOK: formData.noSuratPOK
      });
      console.log(response.data);  // Debugging response
      onSaved(); // Refresh the sample list after adding
      handleModalToggle(); // Close modal after successful addition
    } catch (err) {
      console.error("Error adding sample:", err.response || err.message);
    }
  };

  const handleCancel = () => {
    handleModalToggle();  // Close the modal
  };

  // Move to the next step (1st part -> 2nd part)
  const handleNextStep = () => {
    setCurrentStep(2);
  };

  // Move to the previous step (2nd part -> 1st part)
  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={handleCancel}></div>
      <div className="relative bg-white p-8 rounded-lg w-130 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{currentStep === 1 ? "Add New Sample - Part 1" : "Add New Sample - Part 2"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Step 1 */}
          {currentStep === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nama Unit Pemohon</label>
                <input
                  type="text"
                  name="namaUnitPemohon"
                  value={formData.namaUnitPemohon}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter Unit Pemohon"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tanggal Surat</label>
                <input
                  type="date"
                  name="tanggalSurat"
                  value={formData.tanggalSurat}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nama Bahan</label>
                <select
                  name="namaBahan"
                  value={formData.namaBahan}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                >
                  <option value="">Pilih Nama Bahan</option>
                  {namaBahanList.map((bahan) => (
                    <option key={bahan.id} value={bahan.id}>
                      {bahan.namaBahan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nomor PO</label>
                <input
                  type="text"
                  name="nomorPO"
                  value={formData.nomorPO}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter Nomor PO"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nomor Surat</label>
                <input
                  type="text"
                  name="nomorSurat"
                  value={formData.nomorSurat}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter Nomor Surat"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="complete">Complete</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Button for moving to next step */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-[#015db2] text-white rounded-md hover:bg-[#5fa7c9] transition duration-300"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">No Kendaraan</label>
                <input
                  type="text"
                  name="noKendaraan"
                  value={formData.noKendaraan}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter No Kendaraan"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Isi Berat</label>
                <input
                  type="number"
                  name="isiBerat"
                  value={formData.isiBerat}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter Isi Berat"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Jumlah Contoh</label>
                <input
                  type="number"
                  name="jumlahContoh"
                  value={formData.jumlahContoh}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter Jumlah Contoh"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">No Kode Contoh</label>
                <input
                  type="text"
                  name="noKodeContoh"
                  value={formData.noKodeContoh}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter No Kode Contoh"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">No Surat POK</label>
                <input
                  type="text"
                  name="noSuratPOK"
                  value={formData.noSuratPOK}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter No Surat POK"
                />
              </div>

              {/* Buttons for previous and submit */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#015db2] text-white rounded-md hover:bg-[#5fa7c9] transition duration-300"
                >
                  Add Sample
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddSample;
