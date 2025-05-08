import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SampleDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sample, setSample] = useState(null);

  // Fetch the sample detail from backend
  const fetchSampleDetail = async () => {
    if (location.state && location.state.sampleId) {
      try {
        const res = await axios.get(`http://localhost:5000/samples/${location.state.sampleId}`, { withCredentials: true });
        setSample(res.data);
      } catch (err) {
        console.error('Error fetching sample details:', err);
      }
    }
  };

  useEffect(() => {
    fetchSampleDetail();
  }, [location.state]);

  // Back button to navigate back to the sample list
  const handleBack = () => {
    navigate(-1); // Adjust the path as needed
  };

  // Send the data to the Analysis page
  const handleSendToAnalysis = () => {
    // Navigate to Analysis page, sending the sampleId
    navigate('/analysis', { state: { sampleId: sample.uuid } });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="pb-5">
        <h1 className="text-3xl font-bold">Sample Detail</h1>
        <h2 className="text-zinc-500">Detailed Preview of the Sample</h2>
      </div>

      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="bg-[#015db2] text-white px-4 py-2 rounded-md hover:bg-[#5fa7c9] transition duration-300"
        >
          Back to Previous
        </button>
      </div>

      {/* Send to Analysis Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSendToAnalysis}
          className="bg-[#4CAF50] text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          Send to Analysis
        </button>
      </div>

      {sample ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Sample Details</h3>

          {/* Grid Layout for displaying the sample details */}
          <div className="grid grid-cols-3 gap-4">
            {/* First Row */}
            <div className="flex flex-col">
              <label className="font-medium">Nama Unit Pemohon</label>
              <p>{sample.namaUnitPemohon}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Tanggal Surat</label>
              <p>{new Date(sample.tanggalSurat).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Nama Bahan</label>
              {/* Fix: Accessing the proper field inside the `namaBahan` object */}
              <p>{sample.namaBahan ? sample.namaBahan.namaBahan : 'No Bahan Available'}</p>
            </div>

            {/* Second Row */}
            <div className="flex flex-col">
              <label className="font-medium">Nomor PO</label>
              <p>{sample.nomorPO}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Nomor Surat</label>
              <p>{sample.nomorSurat}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Status</label>
              <p>{sample.status}</p>
            </div>

            {/* Third Row */}
            <div className="flex flex-col">
              <label className="font-medium">No Kendaraan</label>
              <p>{sample.noKendaraan}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Isi Berat</label>
              <p>{sample.isiBerat}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Jumlah Contoh</label>
              <p>{sample.jumlahContoh}</p>
            </div>

            {/* Fourth Row */}
            <div className="flex flex-col">
              <label className="font-medium">No Kode Contoh</label>
              <p>{sample.noKodeContoh}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">No Surat POK</label>
              <p>{sample.noSuratPOK}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default SampleDetail;
