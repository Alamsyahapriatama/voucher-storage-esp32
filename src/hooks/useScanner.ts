import { useState } from 'react';
import { Voucher } from '../types.ts';
import { toast } from 'react-toastify';

export const useScanner = (
  onScanComplete: (voucher: Voucher) => void
) => {
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  // Process the captured or uploaded image
  const processImage = async (file: File): Promise<void> => {
    setScanning(true);
    
    try {
      // Create FormData to send to API
      const formData = new FormData();
      formData.append('image', file);
      
      // Simulate API call and response with mock data
      // In a real app, this would be a fetch call to your OCR API endpoint
      await simulateApiCall(formData);
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process the image. Please try again.');
    } finally {
      setScanning(false);
      setCameraActive(false);
    }
  };
  
  // Simulate OCR API call with mock data
  const simulateApiCall = async (formData: FormData): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a unique ID
    const id = Math.random().toString(36).substring(2, 9);
    
    // Create a file reader to get a data URL for the image
    const reader = new FileReader();
    const file = formData.get('image') as File;
    
    if (!file) {
      throw new Error('No image file found');
    }
    
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        try {
          const imageUrl = reader.result as string;
          
          // Generate mock OCR text based on the file name
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          const mockOcrText = generateMockOcrText(fileName);
          
          // Create a new voucher object
          const newVoucher: Voucher = {
            id,
            imageUrl,
            ocrText: mockOcrText,
            uploadDate: new Date(),
            title: fileName
          };
          
          // Notify the parent component
          onScanComplete(newVoucher);
          
          // Show success toast
          toast.success('Document scanned successfully!');
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  // Toggle camera on/off
  const toggleCamera = () => {
    setCameraActive(prev => !prev);
  };
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    
    // Process the image
    await processImage(file);
    
    // Reset the input to allow the same file to be selected again
    event.target.value = '';
  };
  
  // Function to handle camera capture
  const handleCapture = async (imageBlob: Blob) => {
    // Create a File object from the Blob
    const file = new File([imageBlob], `scan-${new Date().toISOString()}.jpg`, {
      type: 'image/jpeg'
    });
    
    // Process the image
    await processImage(file);
  };
  
  return {
    scanning,
    cameraActive,
    toggleCamera,
    handleFileUpload,
    handleCapture
  };
};

// Helper function to generate mock OCR text based on filename
function generateMockOcrText(fileName: string): string {
  const today = new Date().toLocaleDateString();
  const amount = (Math.random() * 1000).toFixed(2);
  
  return `INVOICE #INV-${Math.floor(Math.random() * 10000)}
Date: ${today}
--------------------------
${fileName.toUpperCase()} SERVICES
--------------------------
Item 1: $${(Math.random() * 100).toFixed(2)}
Item 2: $${(Math.random() * 200).toFixed(2)}
--------------------------
Subtotal: $${amount}
Tax (10%): $${(parseFloat(amount) * 0.1).toFixed(2)}
Total: $${(parseFloat(amount) * 1.1).toFixed(2)}
--------------------------
Payment method: CREDIT CARD
Status: PAID`;
}