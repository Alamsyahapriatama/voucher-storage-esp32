import React, { useRef, useState, useEffect } from 'react';
import { Camera, Image, X, Settings } from 'lucide-react';

interface ScannerProps {
  onCapture: (imageBlob: Blob) => void;
  onClose: () => void;
  active: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onCapture, onClose, active }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);

  // Start camera when component mounts
  useEffect(() => {
    if (active) {
      startCamera();
    }
    
    // Clean up when component unmounts
    return () => {
      stopCamera();
    };
  }, [active]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setError(null);
      setShowPermissionHelp(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      // Handle permission denied error
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Camera access was denied');
        setShowPermissionHelp(true);
      } else {
        setError('Unable to access camera. Please check your device settings and try again.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        } else {
          setError('Failed to capture image');
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const getBrowserSpecificInstructions = () => {
    const browser = navigator.userAgent;
    if (browser.includes('Chrome')) {
      return 'Click the camera icon in the address bar → "Allow" → Refresh the page';
    } else if (browser.includes('Firefox')) {
      return 'Click the camera icon in the address bar → "Allow" → Refresh the page';
    } else if (browser.includes('Safari')) {
      return 'Go to Safari Preferences → Websites → Camera → Allow for this website';
    }
    return 'Check your browser settings to allow camera access for this website';
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center">
      <div className="relative w-full max-w-md">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
        >
          <X className="h-6 w-6 text-gray-200" />
        </button>
        
        <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          {error ? (
            <div className="p-8 text-center">
              <Image className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg mb-4">{error}</p>
              
              {showPermissionHelp && (
                <div className="mb-6 text-left">
                  <div className="flex items-center mb-3">
                    <Settings className="h-5 w-5 text-blue-400 mr-2" />
                    <h3 className="text-blue-400 font-medium">How to enable camera access:</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {getBrowserSpecificInstructions()}
                  </p>
                </div>
              )}
              
              <div className="space-x-3">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 border-2 border-blue-400 border-opacity-50 pointer-events-none"></div>
              
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  onClick={captureImage}
                  className="bg-blue-600 rounded-full p-4 shadow-lg transform transition-all hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;