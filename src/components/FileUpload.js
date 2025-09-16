import React, { useState } from 'react';
import { fileAPI } from '../services/api';

const FileUpload = ({ userPlan = 'free', onUpgradeClick }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (userPlan === 'free') {
      showUpgradePrompt();
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (userPlan === 'free') {
      showUpgradePrompt();
      return;
    }
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setIsUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const res = await fileAPI.upload(file);
          const uploadedFile = res.data.data.file;
          return {
            id: uploadedFile._id,
            name: uploadedFile.originalName,
            size: uploadedFile.size,
            type: uploadedFile.mimeType,
            status: uploadedFile.status,
            analysis: "Processing started. Results will be available soon."
          };
        })
      );
      setUploadedFiles(prev => [...prev, ...uploaded]);
    } catch (error) {
      alert(error.response?.data?.message || "File upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const generateFileAnalysis = (fileName) => {
    const analyses = [
      "File structure validated. No critical errors found. Recommended: Check joinery settings in section 3.",
      "CNC path optimization needed. Found 2 potential collision points. Suggested fixes included.",
      "Material calculations accurate. Consider adjusting cutting depth for better finish quality.",
      "Assembly sequence optimized. Installation notes generated for complex joinery sections."
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const showUpgradePrompt = () => {
    alert("Upgrade to Pro for file parsing and diagnostics. Pro analyzes .cab, .cabx, .mzb, and .xml with a step-by-step fix plan.");
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  if (userPlan === 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                File Upload
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload and analyze your millwork files for professional diagnostics and optimization recommendations.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center shadow-xl">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl flex items-center justify-center mb-8">
                <svg className="h-12 w-12 text-yellow-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">File Upload Requires Pro Plan</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Upgrade to Pro for advanced file parsing and diagnostics. Pro analyzes .cab, .cabx, .mzb, and .xml files with detailed step-by-step optimization recommendations.
              </p>
              <button
                onClick={onUpgradeClick}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">File Analysis</h4>
              <p className="text-gray-600">Deep analysis of your millwork files to identify potential issues and optimization opportunities.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">CNC Optimization</h4>
              <p className="text-gray-600">Get recommendations for CNC path optimization and collision detection to improve efficiency.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Installation Notes</h4>
              <p className="text-gray-600">Receive detailed installation notes and assembly sequences for complex joinery sections.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              File Upload
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload and analyze your millwork files for professional diagnostics and optimization recommendations.
          </p>
        </div>

        <div className="space-y-8">
          {/* Upload Area */}
          <div
            className={`relative bg-white rounded-3xl file-upload-area p-12 text-center shadow-xl border-2 border-dashed transition-all duration-200 ${
              dragActive ? 'drag-active border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept=".cab,.cabx,.mzb,.xml"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="h-12 w-12 text-primary-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Millwork Files</h3>
              <p className="text-lg text-gray-600 mb-4">
                Drag and drop your .cab, .cabx, .mzb, or .xml files here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: .cab, .cabx, .mzb, .xml
              </p>
            </div>
          </div>

          
          {isUploading && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-900">Analyzing Files</h4>
                  <p className="text-blue-800">Processing your millwork files for optimization recommendations...</p>
                </div>
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 text-center">Analyzed Files</h3>
              <div className="grid grid-cols-1 gap-6">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{file.name}</h4>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB • {file.type}
                            </p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                          <h5 className="font-semibold text-gray-900 mb-2">Analysis Results</h5>
                          <p className="text-gray-700 leading-relaxed">{file.analysis}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2"
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
