import { Voucher, ApiVoucher } from '../types';

const API_URL = 'http://localhost/esp32-api/index.php';
const UPLOADS_URL = 'http://localhost/esp32-api/uploads/';

// Transform API data to frontend model
const transformVoucher = (item: ApiVoucher): Voucher => ({
  id: String(item.id),
  filename: item.filename,
  imageUrl: `${UPLOADS_URL}${item.filename}`,
  ocrText: item.ocr_text || '',
  uploadDate: new Date(item.uploaded_at || Date.now()),
  title: item.title || 'Voucher',
});

// Fetch all vouchers
export async function fetchVouchers(): Promise<Voucher[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiVoucher[] = await response.json();
    return data.map(transformVoucher);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    throw error;
  }
}

// Upload a new voucher
export async function uploadVoucher(imageFile: File): Promise<Voucher> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload voucher');
    }

    const result = await response.json();
    
    // Fetch the newly created voucher to get its complete data
    const vouchersResponse = await fetch(API_URL);
    const vouchers: ApiVoucher[] = await vouchersResponse.json();
    const newVoucher = vouchers.find(v => v.filename === result.filename);
    
    if (!newVoucher) {
      throw new Error('Could not find the newly created voucher');
    }
    
    return transformVoucher(newVoucher);
  } catch (error) {
    console.error('Error uploading voucher:', error);
    throw error;
  }
}

// Delete a voucher
export async function deleteVoucher(id: string): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete voucher');
    }
  } catch (error) {
    console.error('Error deleting voucher:', error);
    throw error;
  }
}

// Update a voucher title
export async function updateVoucher(id: string, newFilename: string): Promise<Voucher> {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, new_filename: newFilename }),
    });

    if (!response.ok) {
      throw new Error('Failed to update voucher');
    }

    const result = await response.json();
    
    // Get the updated voucher
    const voucherResponse = await fetch(`${API_URL}?id=${id}`);
    const updatedVoucher: ApiVoucher = await voucherResponse.json();
    
    return transformVoucher(updatedVoucher);
  } catch (error) {
    console.error('Error updating voucher:', error);
    throw error;
  }
}