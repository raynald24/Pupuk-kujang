import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

function SampleDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sample, setSample] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const fetchSampleDetail = async () => {
    if (location.state && location.state.sampleId) {
      try {
        const sampleRes = await axios.get(`http://localhost:5000/samples/${location.state.sampleId}`, {
          withCredentials: true,
        });
        console.log('Sample data fetched:', sampleRes.data);
        setSample(sampleRes.data);

        const analysisRes = await axios.get(`http://localhost:5000/analisis/sample/${location.state.sampleId}`, {
          withCredentials: true,
        });
        console.log('Analysis data fetched:', analysisRes.data);

        const parsedAnalysis = {
          ...analysisRes.data,
          parameters: analysisRes.data.parameters?.map(param => {
            let parsedInputs = {};
            if (typeof param.inputs === 'string') {
              try {
                parsedInputs = JSON.parse(param.inputs);
              } catch (e) {
                console.error(`Failed to parse inputs for parameter ${param.name}:`, e);
                parsedInputs = {};
              }
            } else if (typeof param.inputs === 'object' && param.inputs !== null) {
              parsedInputs = param.inputs;
            }
            return {
              ...param,
              inputs: parsedInputs,
            };
          }) || [],
        };
        setAnalysis(parsedAnalysis);
      } catch (err) {
        console.error('Error fetching sample or analysis details:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSampleDetail();
    setIsMounted(true);
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleExport = async () => {
    try {
      // Pastikan data tersedia
      if (!sample || !analysis || !analysis.parameters || analysis.parameters.length === 0) {
        console.log('Sample:', sample);
        console.log('Analysis:', analysis);
        alert('No data available to export! Check console for details.');
        return;
      }

      // Persiapan data untuk Sample Information
      const sampleData = [
        ['Nama Unit Kerja:', sample.namaUnitPemohon || '-'],
        ['No. Surat POK:', sample.nomorSurat || '-'],
        ['Tanggal Surat POK:', sample.tanggalSurat ? new Date(sample.tanggalSurat).toLocaleDateString('id-ID') : '-'],
        ['Nomor PO:', sample.nomorPO || '-'],
        ['Nama Bahan:', sample.namaBahan?.namaBahan || 'No Bahan Available'],
        ['Jumlah Bahan:', sample.jumlahContoh || '-'],
        ['Isi berat per Bahan:', sample.isiBerat || '-'],
        ['Nomor Kendaraan:', sample.noKendaraan || '-'],
      ];
      console.log('Sample data prepared:', sampleData);

      // Persiapan data untuk Analysis Results
      const analysisData = analysis.parameters.map((param, index) => [
        index + 1,
        param.name || '-',
        '',
        Object.entries(param.inputs || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ') || '',
        '',
        param.result || '',
      ]);
      console.log('Analysis data prepared:', analysisData);

      // Buat workbook baru
      const wb = XLSX.utils.book_new();
      const wsData = [
        ['Sample Informasi'],
        [],
        ...sampleData,
        [],
        [],
        [],
        [],
        ['Administrasi Laboratorium'],
        ['', ''], 
        ['', ''],
        ['', ''],
        ['Luthfi Riadhi'],
        [],
        [],
        [],
        [],
        ['Hasil Analisa'],
        ['Nomor Analisa:', analysis.analysis_number || '-'],
        ['Tanggal Analisa:', analysis.analysis_date ? new Date(analysis.analysis_date).toLocaleDateString('id-ID') : '-'],
        ['Tanggal Penerbitan:', analysis.publish_analisa ? new Date(analysis.publish_analisa).toLocaleDateString('id-ID') : '-'],
        [],
        ['NO', 'Parameter Analisa', '', 'Input', '', 'Hasil Analisa'],
        ...analysisData,
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Tambahkan border untuk seluruh konten
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) ws[cellAddress] = { v: '' };
          ws[cellAddress].s = { border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } };
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, 'Sample Information');

      // Ekspor ke file Excel
      const fileName = `Sample_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      console.log('Export successful:', fileName);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Failed to export file. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-slate-600">Loading sample details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 1.0s ease-out forwards;
          }
        `}
      </style>

      <div className={`bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10 ${isMounted ? 'animate-fadeIn' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="group flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 border border-slate-200 hover:border-slate-300"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-slate-700 font-medium">Back</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Sample Detail
                </h1>
                <p className="text-slate-500 mt-1">Comprehensive sample analysis overview</p>
              </div>
            </div>
            
            <button
              onClick={handleExport}
              className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold">Export Results</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {sample ? (
          <div className={`space-y-8 ${isMounted ? 'animate-fadeInUp' : ''}`}>
            <div className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden ${isMounted ? 'animate-fadeInUp' : ''}`}>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Sample Information</h2>
                    <p className="text-blue-100">Complete sample details and metadata</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Nama Unit Pemohon", value: sample.namaUnitPemohon },
                    { label: "Tanggal Surat", value: sample.tanggalSurat ? new Date(sample.tanggalSurat).toLocaleDateString('id-ID') : null },
                    { label: "Nama Bahan", value: sample.namaBahan?.namaBahan || 'No Bahan Available' },
                    { label: "Nomor PO", value: sample.nomorPO },
                    { label: "Nomor Surat", value: sample.nomorSurat },
                    { label: "Status", value: sample.status },
                    { label: "No Kendaraan", value: sample.noKendaraan },
                    { label: "Isi Berat", value: sample.isiBerat },
                    { label: "Jumlah Contoh", value: sample.jumlahContoh },
                    { label: "No Kode Contoh", value: sample.noKodeContoh },
                    { label: "No Surat POK", value: sample.noSuratPOK }
                  ].map((item, index) => (
                    <div key={index} className="group">
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 h-full border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200 hover:shadow-md">
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                          {item.label}
                        </label>
                        <p className="text-slate-800 font-medium mt-2 text-lg leading-relaxed">
                          {item.value || '-'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden ${isMounted ? 'animate-fadeInUp' : ''}`}>
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                    <p className="text-emerald-100">Detailed laboratory analysis findings</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                {analysis && analysis.parameters && analysis.parameters.length > 0 ? (
                  <div className="space-y-6">
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${isMounted ? 'animate-fadeInUp' : ''}`}>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-blue-800">Analysis Number</h3>
                        </div>
                        <p className="text-blue-700 font-medium text-xl">{analysis.analysis_number || '-'}</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h8m-6 0l-2 9a2 2 0 002 2h4a2 2 0 002-2l-2-9m-8 0V7" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-purple-800">Analysis Date</h3>
                        </div>
                        <p className="text-purple-700 font-medium text-xl">
                          {analysis.analysis_date ? new Date(analysis.analysis_date).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-green-800">Publish Date</h3>
                        </div>
                        <p className="text-green-700 font-medium text-xl">
                          {analysis.publish_analisa ? new Date(analysis.publish_analisa).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
                        <div className="w-6 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"></div>
                        <span>Test Parameters</span>
                      </h3>
                      
                      <div className="grid gap-4">
                        {analysis.parameters.map((param, index) => (
                          <div
                            key={index}
                            className={`group bg-gradient-to-r from-white to-slate-50 rounded-xl p-6 border border-slate-200/50 hover:border-slate-300/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isMounted ? 'animate-fadeInUp' : ''}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center space-x-3">
                                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"></div>
                                  <span>{param.name}</span>
                                </h4>
                                
                                <div className="space-y-3">
                                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/50">
                                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Inputs</span>
                                    <div className="mt-2 text-slate-700">
                                      {param.inputs && Object.keys(param.inputs).length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                          {Object.entries(param.inputs).map(([key, value], i) => (
                                            <span key={i} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                              {key}: {value}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-slate-500 italic">No inputs available</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200/50">
                                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Result</span>
                                    <div className="mt-2">
                                      <span className="text-2xl font-bold text-emerald-800">
                                        {param.result || '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-xl text-slate-500 font-medium">No analysis results available</p>
                    <p className="text-slate-400 mt-2">Analysis data for this sample has not been processed yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-2xl text-slate-600 font-medium">No sample data available</p>
              <p className="text-slate-500 mt-2">The requested sample could not be found or loaded.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SampleDetail;