import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditSample = ({ isEditOpen, handleEditToggle, sample, onSaved }) => {
    const [formData, setFormData] = useState({
        namaUnitPemohon: '',
        tanggalSurat: '',
        namaBahan: '',
        nomorPO: '',
        nomorSurat: '',
        status: 'pending'
    });

    useEffect(() => {
        if (sample) {
            setFormData({
                namaUnitPemohon: sample.namaUnitPemohon,
                tanggalSurat: sample.tanggalSurat,
                namaBahan: sample.namaBahan,
                nomorPO: sample.nomorPO,
                nomorSurat: sample.nomorSurat,
                status: sample.status
            });
        }
    }, [sample]);

    if (!isEditOpen || !sample) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.patch(`http://localhost:5000/samples/${sample.uuid}`, formData, { withCredentials: true });
            onSaved(); // Refresh the sample list after editing
            handleEditToggle(); // Close the modal after saving
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleEditToggle}></div>
            <div className="relative bg-white p-8 rounded-lg w-130 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Edit Sample</h2>

                <form onSubmit={handleSubmit}>
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
                        <input
                            type="text"
                            name="namaBahan"
                            value={formData.namaBahan}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter Nama Bahan"
                        />
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
