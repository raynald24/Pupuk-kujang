import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditSample = ({ isEditOpen, handleEditToggle, sample, onSaved }) => {
  const [formData, setFormData] = useState({
    namaUnitPemohon: '',
    tanggalSurat: '',
    namaBahanId: '',
    nomorPO: '',
    nomorSurat: '',
    status: 'pending',
    noKendaraan: '',
    isiBerat: '',
    jumlahContoh: '',
    noKodeContoh: '',
    noSuratPOK: ''
  });

  const [namaBahanList, setNamaBahanList] = useState([]); // State untuk namaBahan
  const [currentStep, setCurrentStep] = useState(1); // Track current step (1 or 2)

  // Format tanggal menjadi yyyy-MM-dd
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];  // Format to yyyy-MM-dd
  };

  // Mengambil data namaBahan untuk dropdown
  useEffect(() => {
    const fetchNamaBahan = async () => {
      try {
        const res = await axios.get('http://localhost:5000/namaBahan');
        setNamaBahanList(res.data); // Menyimpan data namaBahan yang diterima
      } catch (err) {
        console.error(err);
      }
    };

    fetchNamaBahan();

    if (sample) {
      setFormData({
        namaUnitPemohon: sample.namaUnitPemohon,
        tanggalSurat: formatDate(sample.tanggalSurat), // Format the date to yyyy-MM-dd
        namaBahanId: sample.namaBahanId,  // Menggunakan namaBahanId
        nomorPO: sample.nomorPO,
        nomorSurat: sample.nomorSurat,
        status: sample.status,
        noKendaraan: sample.noKendaraan,
        isiBerat: sample.isiBerat,
        jumlahContoh: sample.jumlahContoh,
        noKodeContoh: sample.noKodeContoh,
        noSuratPOK: sample.noSuratPOK
      });
    }
  }, [sample]); // Hook bergantung pada sample

  if (!isEditOpen || !sample) return null; // Menghindari kesalahan jika tidak ada sample atau edit tidak terbuka

  // Function to handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mengirimkan data ke backend untuk memperbarui sample
      await axios.patch(`http://localhost:5000/samples/${sample.uuid}`, formData, { withCredentials: true });
      onSaved(); // Refresh sample list setelah menyimpan perubahan
      handleEditToggle(); // Menutup modal setelah menyimpan perubahan
    } catch (err) {
      console.error("Error updating sample:", err);
    }
  };

  // Handle next and previous step for form
  const handleNextStep = () => {
    setCurrentStep(2); // Move to step 2
  };

  const handlePreviousStep = () => {
    setCurrentStep(1); // Go back to step 1
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={handleEditToggle}></div>
      <div className="relative bg-white p-8 rounded-lg w-130 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{currentStep === 1 ? "Edit Sample - Part 1" : "Edit Sample - Part 2"}</h2>

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
                  value={formData.tanggalSurat} // This should already be in yyyy-MM-dd format
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nama Bahan</label>
                <select
                  name="namaBahanId" // Use namaBahanId for the foreign key
                  value={formData.namaBahanId}
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
                  onClick={handleEditToggle}
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
                  Save Changes
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditSample;
