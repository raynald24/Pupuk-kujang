import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditSample = ({ isEditOpen, handleEditToggle, sample, onSaved }) => {
    const [formData, setFormData] = useState({
        namaUnitPemohon: '',
        tanggalSurat: '',
        namaBahanId: '', // Changed from namaBahan to namaBahanId
        nomorPO: '',
        nomorSurat: '',
        status: 'pending'
    });

    const [namaBahanList, setNamaBahanList] = useState([]); // State untuk namaBahan

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
                tanggalSurat: sample.tanggalSurat,
                namaBahanId: sample.namaBahanId,  // Menggunakan namaBahanId
                nomorPO: sample.nomorPO,
                nomorSurat: sample.nomorSurat,
                status: sample.status
            });
        }
    }, [sample]); // Hook bergantung pada sample

    if (!isEditOpen || !sample) return null; // Menghindari kesalahan jika tidak ada sample atau edit tidak terbuka

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleEditToggle}></div>
            <div className="relative bg-white p-8 rounded-lg w-130 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Edit Sample</h2>

                <form onSubmit={handleSubmit}>
                    {/* Nama Unit Pemohon */}
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

                    {/* Tanggal Surat */}
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

                    {/* Nama Bahan Dropdown */}
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

                    {/* Nomor PO */}
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

                    {/* Nomor Surat */}
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

                    {/* Status */}
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

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#015db2] text-white rounded-md hover:bg-[#5fa7c9] transition duration-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSample;
