import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, ArrowLeft, Wifi } from 'lucide-react';
import { toast } from 'react-toastify';
import { useScanner } from '../hooks/useScanner';
import { useVouchers } from '../hooks/useVouchers';
import Scanner from '../components/Camera/Scanner';
import { Voucher } from '../types.ts';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addVoucher } = useVouchers();
  const [uploading, setUploading] = useState(false);
  
  const onScanComplete = (voucher: Voucher) => {
    addVoucher(voucher);
    navigate('/');
  };
  
  const { scanning, cameraActive, toggleCamera, handleFileUpload, handleCapture } = useScanner(onScanComplete);
  const handleESP32Scan = async () => {
    try {
      const response = await fetch('http://localhost/esp32-api/run_react.php', {
        method: 'POST',
      });
  
      if (!response.ok) throw new Error('Gagal trigger ESP32');

      const data = await response.json();
      toast.success(data.status);

     
    } catch (error) {
      console.error('ESP32 scan error:', error);
      toast.error('Gagal scan dari ESP32-CAM');
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan Document</h1>
        <p className="text-gray-500 mb-8">
          Capture an invoice or voucher using your camera, ESP32-CAM, or upload from your device.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={toggleCamera}
            disabled={scanning || uploading}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors ${
              (scanning || uploading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Camera className="h-12 w-12 text-indigo-500 mb-4" />
            <span className="text-lg font-medium text-gray-900">Use Camera</span>
            <span className="text-sm text-gray-500 mt-1">
              Take a photo of your document
            </span>
          </button>
          
          <button
            onClick={handleESP32Scan}
            disabled={scanning || uploading}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors ${
              (scanning || uploading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Wifi className="h-12 w-12 text-indigo-500 mb-4" />
            <span className="text-lg font-medium text-gray-900">ESP32-CAM</span>
            <span className="text-sm text-gray-500 mt-1">
              Scan using ESP32-CAM
            </span>
          </button>
          
          <div
            onClick={triggerFileUpload}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors ${
              (scanning || uploading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Upload className="h-12 w-12 text-indigo-500 mb-4" />
            <span className="text-lg font-medium text-gray-900">Upload File</span>
            <span className="text-sm text-gray-500 mt-1">
              Select a file from your device
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={scanning || uploading}
              className="hidden"
            />
          </div>
        </div>
      </div>
      
      {/* Camera component */}
      <Scanner
        active={cameraActive}
        onCapture={handleCapture}
        onClose={toggleCamera}
      />
      
      {/* Best Practices Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-800 mb-3">Tips for best results:</h2>
        <ul className="text-blue-700 space-y-2">
          <li className="flex items-start">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 mr-2"></span>
            Ensure good lighting for clear images
          </li>
          <li className="flex items-start">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 mr-2"></span>
            Position the document to fill the frame
          </li>
          <li className="flex items-start">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 mr-2"></span>
            Keep the camera steady to avoid blur
          </li>
          <li className="flex items-start">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 mr-2"></span>
            Make sure all text is visible and readable
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ScanPage;