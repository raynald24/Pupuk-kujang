import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, ArrowLeft } from 'lucide-react';

const AnalysisHeader = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [analysisNumber, setAnalysisNumber] = useState('1234');  // Default value
  const [analysisDate, setAnalysisDate] = useState('2025-05-06'); // Default value
  const [publishAnalysis, setPublishAnalysis] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    setIsEditing(true);  // Switch to editing mode
  };

  const handleSave = () => {
    // Save the updated data logic
    console.log('Data saved:', { analysisNumber, analysisDate, publishAnalysis });
    setIsEditing(false);  // Switch back to view mode
  };

  const handleCancel = () => {
    setIsEditing(false);  // Switch back to view mode without saving
  };

  const handleNavigateBack = () => {
    navigate(-1);  // Go back to previous page (Analysis List)
  };

  return (
    <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-8 m-8 rounded-xl shadow-lg mb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Analysis Information</h1>
        <div className="flex gap-2">
          <button
            onClick={handleNavigateBack}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Analysis Number */}
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Edit2 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-blue-600 text-sm font-medium">Analysis Number</p>
            {isEditing ? (
              <input
                type="text"
                value={analysisNumber}
                onChange={(e) => setAnalysisNumber(e.target.value)}
                className="w-full px-2 py-1 rounded border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="font-semibold text-slate-800">{analysisNumber}</p>
            )}
          </div>
        </div>

        {/* Analysis Date */}
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Edit2 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-blue-600 text-sm font-medium">Analysis Date</p>
            {isEditing ? (
              <input
                type="date"
                value={analysisDate}
                onChange={(e) => setAnalysisDate(e.target.value)}
                className="w-full px-2 py-1 rounded border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="font-semibold text-slate-800">{analysisDate}</p>
            )}
          </div>
        </div>

        {/* Publish Analysis */}
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Edit2 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-blue-600 text-sm font-medium">Publish Analysis</p>
            {isEditing ? (
              <input
                type="checkbox"
                checked={publishAnalysis}
                onChange={(e) => setPublishAnalysis(e.target.checked)}
                className="w-full px-2 py-1 rounded border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="font-semibold text-slate-800">{publishAnalysis ? 'Published' : 'Not Published'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeader;
