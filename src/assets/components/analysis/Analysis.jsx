import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Analysis = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [analysisNumber, setAnalysisNumber] = useState(`AN${Date.now()}`);
  const [analysisDate, setAnalysisDate] = useState(new Date().toISOString().split('T')[0]);
  const [publishAnalisa, setPublishAnalisa] = useState(new Date().toISOString().split('T')[0]);
  const [sample, setSample] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // State untuk animasi
  const navigate = useNavigate();
  const location = useLocation();

  const sampleId = location.state?.sampleId;

  useEffect(() => {
    const fetchSample = async () => {
      if (!sampleId) {
        setError('Sample ID tidak ditemukan');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/samples/${sampleId}`, { withCredentials: true });
        setSample(res.data);
      } catch (err) {
        setError('Gagal memuat data sample');
        setLoading(false);
      }
    };

    fetchSample();
  }, [sampleId]);

  useEffect(() => {
    const fetchParameters = async () => {
      if (!sample) return;
      try {
        const namaBahanId = sample?.namaBahanId || sample?.namaBahan?.id;
        if (!namaBahanId) {
          throw new Error('namaBahanId tidak ditemukan');
        }
        const res = await axios.get(`http://localhost:5000/analisis/parameters/${namaBahanId}`, { withCredentials: true });
        setMaterials(res.data);
      } catch (err) {
        setError('Gagal memuat data parameter');
      } finally {
        setLoading(false);
      }
    };

    fetchParameters();
  }, [sample]);

  const fetchAnalysis = async () => {
    if (!sampleId) return;
    try {
      const res = await axios.get(`http://localhost:5000/analisis/sample/${sampleId}`, { withCredentials: true });
      console.log('Fetched analysis data:', res.data);
      if (res.data.parameters && res.data.parameters.length > 0) {
        setAnalysisNumber(res.data.analysis_number || `AN${Date.now()}`);
        setAnalysisDate(
          res.data.analysis_date
            ? new Date(res.data.analysis_date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        );
        setPublishAnalisa(
          res.data.publish_analisa
            ? new Date(res.data.publish_analisa).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        );
        const loadedInputs = {};
        const loadedResults = {};
        res.data.parameters.forEach(param => {
          let validInputs = {};
          if (typeof param.inputs === 'object' && param.inputs !== null) {
            validInputs = { ...param.inputs };
          } else if (typeof param.inputs === 'string') {
            try {
              validInputs = JSON.parse(param.inputs || '{}');
            } catch (e) {
              validInputs = {};
            }
          }
          loadedInputs[param.name] = validInputs;
          loadedResults[param.name] = param.result != null && param.result !== 'NaN' ? param.result : null;
        });
        setInputs(loadedInputs);
        setResults(loadedResults);
      } else {
        setInputs({});
        setResults({});
      }
    } catch (err) {
      console.error('Error fetching analysis:', err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sampleId) fetchAnalysis();
    // Set isMounted ke true setelah komponen dimount
    setIsMounted(true);
  }, [sampleId]);

  const material = materials?.materials?.[0] || null;
  const parameters = material
    ? material.parameters
        .filter(param => param && param.name)
        .map(param => ({
          ...param,
          inputs: Array.isArray(param.inputs) ? param.inputs : (typeof param.inputs === 'string' ? JSON.parse(param.inputs || '{}') : []),
        }))
    : [];

  const calculateResult = (parameter) => {
    if (!parameter || !parameter.name) return;
    if (parameter.type === 'manual' || parameter.type === 'enum') {
      const value = inputs[parameter.name]?.[parameter.inputs[0]?.name] || '';
      if (value && value !== '') {
        setResults(prev => ({
          ...prev,
          [parameter.name]: value,
        }));
      } else {
        setResults(prev => ({
          ...prev,
          [parameter.name]: null,
        }));
      }
      return;
    }

    let formula = parameter.formula || '';
    const inputValues = inputs[parameter.name] || {};

    const missingInputs = parameter.inputs.filter(input => !inputValues[input.name] || inputValues[input.name] === '');
    if (missingInputs.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Tidak Lengkap',
        text: `Silakan isi semua input: ${missingInputs.map(i => i.label).join(', ')}`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const bsKeys = ['BS', 'BS1'];
    for (const key of bsKeys) {
      if (inputValues[key] && Number(inputValues[key]) === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Input Tidak Valid',
          text: `${key} tidak boleh nol`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });
        return;
      }
    }

    for (const input of parameter.inputs) {
      if (input.type === 'number' && isNaN(Number(inputValues[input.name]))) {
        Swal.fire({
          icon: 'error',
          title: 'Input Tidak Valid',
          text: `Input ${input.label} harus berupa angka`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });
        return;
      }
    }

    parameter.inputs.forEach(input => {
      if (input.derived) {
        let derivedFormula = input.derived;
        parameter.inputs.forEach(inp => {
          derivedFormula = derivedFormula.replace(`[${inp.name}]`, inputValues[inp.name] || 0);
        });
        try {
          inputValues[input.name] = eval(derivedFormula);
        } catch (e) {
          inputValues[input.name] = 0;
        }
      }
    });

    parameter.inputs.forEach(input => {
      formula = formula.replace(`[${input.name}]`, Number(inputValues[input.name]) || 0);
    });

    try {
      const result = eval(formula);
      if (!isFinite(result)) {
        throw new Error('Hasil tidak valid (mungkin pembagian oleh nol)');
      }
      setResults(prev => ({ ...prev, [parameter.name]: result }));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghitung',
        text: 'Formula tidak valid atau input salah: ' + error.message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
    if (!isEditing) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Silakan klik tombol Edit terlebih dahulu!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const handleInputChange = (parameterName, inputName, value) => {
    if (!isEditing) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Silakan klik tombol Edit terlebih dahulu!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    // Perbarui inputs
    setInputs(prev => {
      const updatedInputs = {
        ...prev,
        [parameterName]: {
          ...prev[parameterName],
          [inputName]: value,
        },
      };

      // Hanya hitung ulang untuk parameter tipe 'manual' atau 'enum'
      const parameter = parameters.find(param => param.name === parameterName);
      if (parameter && (parameter.type === 'manual' || parameter.type === 'enum')) {
        const inputValue = updatedInputs[parameter.name]?.[parameter.inputs[0]?.name] || '';
        setResults(prevResults => ({
          ...prevResults,
          [parameter.name]: inputValue && inputValue !== '' ? inputValue : null,
        }));
      }
      // Untuk tipe 'calculated', perhitungan hanya dilakukan saat tombol "Hitung" diklik

      return updatedInputs;
    });
  };

  const handleEdit = async () => {
    console.log('Edit button clicked');
    const result = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi Edit',
      text: 'Apakah Anda yakin ingin mengedit data analisis?',
      showCancelButton: true,
      confirmButtonText: 'Ya, Edit',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Simpan Data',
      text: 'Apakah Anda yakin ingin menyimpan data analisis?',
      showCancelButton: true,
      confirmButtonText: 'Ya, Simpan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      if (!analysisDate || !publishAnalisa) {
        Swal.fire({
          icon: 'error',
          title: 'Input Tidak Lengkap',
          text: 'Tanggal analisis dan tanggal publikasi harus diisi',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });
        return;
      }

      const filteredParameters = parameters.map(param => {
        const paramInputs = inputs[param.name] || {};
        const validInputs = Object.fromEntries(
          Object.entries(paramInputs).filter(([_, value]) => value !== '' && value !== null)
        );
        let resultValue;
        if (param.type === 'manual' || param.type === 'enum') {
          resultValue = validInputs[param.inputs[0]?.name] || results[param.name] || null;
        } else {
          resultValue = results[param.name] || null;
        }
        if (resultValue === undefined || resultValue === 'NaN' || Number.isNaN(resultValue)) {
          resultValue = validInputs[param.inputs[0]?.name] || null;
        }
        return {
          name: param.name,
          inputs: validInputs,
          result: resultValue,
        };
      });

      const parametersToSend = filteredParameters.filter(param => Object.keys(param.inputs).length > 0);

      if (parametersToSend.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Ada Data Parameter',
          text: 'Silakan isi setidaknya satu parameter sebelum menyimpan.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });
        return;
      }

      const analysisData = {
        sample_id: sample?.uuid,
        analysis_number: analysisNumber,
        analysis_date: analysisDate,
        publish_analisa: publishAnalisa,
        parameters: parametersToSend,
      };

      try {
        console.log('Saving inputs:', JSON.stringify(analysisData, null, 2));
        const response = await axios.post('http://localhost:5000/analisis', analysisData, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data analisis berhasil disimpan!',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });
        setIsEditing(false);
        await fetchAnalysis();
      } catch (err) {
        console.error('Error saving analysis:', err.response?.data || err.message);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat menyimpan data: ' + (err.response?.data?.message || err.message),
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });
      }
    }
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi Batal',
      text: 'Apakah Anda yakin ingin membatalkan pengeditan?',
      showCancelButton: true,
      confirmButtonText: 'Ya, Batal',
      cancelButtonText: 'Kembali',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#2563eb',
    });

    if (result.isConfirmed) {
      setIsEditing(false);
      setInputs({});
      setResults({});
      await fetchAnalysis();
    }
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 animate-pulse"></div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-blue-100 rounded animate-pulse"></div>
              <div className="h-4 bg-blue-100 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <div className="h-40 bg-blue-50 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-8 bg-blue-50 rounded animate-pulse"></div>
              <div className="h-8 bg-blue-50 rounded animate-pulse"></div>
              <div className="h-8 bg-blue-50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleNavigateBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards; /* Durasi diubah ke 0.8s */
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 1.0s ease-out forwards; /* Durasi diubah ke 1.0s */
          }
        `}
      </style>

      <div className={`bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-8 overflow-hidden transition-all duration-300 hover:shadow-xl ${isMounted ? 'animate-fadeIn' : ''}`}>
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-16 -mr-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -mb-8 -ml-8"></div>
          
          <div className="p-8">
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 ${isMounted ? 'animate-fadeInUp' : ''}`}>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Informasi Analisis
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={handleNavigateBack}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali
                </button>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm hover:shadow z-10"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm hover:shadow"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Batal
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isMounted ? 'animate-fadeInUp' : ''}`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Nomor Analisis</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={analysisNumber}
                        onChange={(e) => setAnalysisNumber(e.target.value)}
                        className="w-full px-3 py-2 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    ) : (
                      <p className="font-semibold text-white text-lg">{analysisNumber}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Tanggal Analisis</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={analysisDate}
                        onChange={(e) => setAnalysisDate(e.target.value)}
                        className="w-full px-3 py-2 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    ) : (
                      <p className="font-semibold text-white text-lg">{analysisDate}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Tanggal Publikasi</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={publishAnalisa}
                        onChange={(e) => setPublishAnalisa(e.target.value)}
                        className="w-full px-3 py-2 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    ) : (
                      <p className="font-semibold text-white text-lg">{publishAnalisa}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sample && materials ? (
        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${isMounted ? 'animate-fadeInUp' : ''}`}>
          <div className="border-b border-gray-100">
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016" />
                  </svg>
                </span>
                Parameter Analisis: <span className="text-blue-600">{sample.namaBahan?.namaBahan || 'Tidak Diketahui'}</span>
              </h2>
            </div>
          </div>

          {parameters.length > 0 ? (
            <div className="p-6">
              <div className="mb-6 overflow-x-auto">
                <div className="flex space-x-1 border-b border-gray-200">
                  {parameters.map((param, index) => (
                    <button
                      key={param.name}
                      className={`px-4 py-3 font-medium text-sm transition-all duration-200 ${
                        activeTab === index
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {param.name}
                    </button>
                  ))}
                </div>
              </div>

              {parameters[activeTab] && (
                <div>
                  <div className={`bg-blue-50 p-4 rounded-xl mb-6 ${isMounted ? 'animate-fadeInUp' : ''}`}>
                    <h3 className="text-lg font-semibold text-blue-800 mb-1 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-600 p-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      {parameters[activeTab].name}
                    </h3>
                    <p className="text-blue-600 text-sm">Masukkan nilai parameter untuk perhitungan</p>
                  </div>

                  {parameters[activeTab].inputs && Array.isArray(parameters[activeTab].inputs) ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isMounted ? 'animate-fadeInUp' : ''}`}>
                      {parameters[activeTab].inputs.map((input) => (
                        <div key={input.name} className="transition-all duration-300 transform hover:shadow">
                          <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 mb-1">
                            {input.label}
                          </label>
                          <div className="relative w-full">
                            {input.type === 'number' ? (
                              <div className={isEditing ? 'group' : ''}>
                                <input
                                  type="number"
                                  id={input.name}
                                  disabled={!isEditing}
                                  value={inputs[parameters[activeTab].name]?.[input.name] || ''}
                                  onChange={(e) => handleInputChange(parameters[activeTab].name, input.name, e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                    isEditing 
                                      ? 'bg-white border-gray-300 group-hover:border-blue-300' 
                                      : 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed'
                                  }`}
                                  placeholder={isEditing ? `Masukkan ${input.label}` : 'Tidak dapat diedit'}
                                />
                                {!isEditing && <div onClick={handleInputClick} className="absolute inset-0 cursor-pointer" />}
                              </div>
                            ) : input.type === 'enum' ? (
                              <div className={isEditing ? 'group' : ''}>
                                <select
                                  id={input.name}
                                  disabled={!isEditing}
                                  value={inputs[parameters[activeTab].name]?.[input.name] || ''}
                                  onChange={(e) => handleInputChange(parameters[activeTab].name, input.name, e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 ${
                                    isEditing 
                                      ? 'bg-white border-gray-300 group-hover:border-blue-300' 
                                      : 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed'
                                  }`}
                                >
                                  <option value="">Pilih {input.label}</option>
                                  {input.options?.map(option => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                                {!isEditing && <div onClick={handleInputClick} className="absolute inset-0 cursor-pointer" />}
                              </div>
                            ) : (
                              <p className="text-red-500 text-sm">Tipe input tidak didukung: {input.type}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Tidak ada input valid untuk parameter ini.
                      </p>
                    </div>
                  )}

                  {isEditing && parameters[activeTab].type === 'calculated' && (
                    <div className="mt-8 flex justify-center">
                      <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        onClick={() => calculateResult(parameters[activeTab])}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Hitung
                      </button>
                    </div>
                  )}

                  {results[parameters[activeTab].name] != null && (
                    <div className="mt-8 bg-green-50 p-6 rounded-xl border border-green-100 animate-fadeInUp">
                      <div className="flex items-center justify-between">
                        <h4 className="text-green-800 font-medium">Hasil Perhitungan</h4>
                        <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-2xl font-bold text-gray-800">{results[parameters[activeTab].name]}</p>
                        <p className="text-sm text-gray-500">Nilai parameter {parameters[activeTab].name}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 flex justify-center">
              <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 p-4 rounded-lg max-w-md w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="font-medium">Tidak ada parameter valid tersedia untuk bahan ini.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Memuat data parameter...</p>
            <div className="w-32 h-2 bg-blue-100 rounded mt-2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;