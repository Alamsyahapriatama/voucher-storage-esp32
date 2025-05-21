import { useState, useEffect } from 'react';
import { Voucher } from '../types.ts';

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load vouchers from localStorage on initial render
  useEffect(() => {
    try {
      const savedVouchers = localStorage.getItem('vouchers');
      if (savedVouchers) {
        const parsedVouchers = JSON.parse(savedVouchers);
        
        // Convert string dates back to Date objects
        const vouchersWithDates = parsedVouchers.map((v: any) => ({
          ...v,
          uploadDate: new Date(v.uploadDate)
        }));
        
        setVouchers(vouchersWithDates);
      }
    } catch (err) {
      console.error('Error loading vouchers from storage', err);
      setError('Failed to load your vouchers. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save vouchers to localStorage whenever the list changes
  useEffect(() => {
    if (vouchers.length > 0) {
      localStorage.setItem('vouchers', JSON.stringify(vouchers));
    }
  }, [vouchers]);

  const addVoucher = (newVoucher: Voucher) => {
    setVouchers(prevVouchers => [newVoucher, ...prevVouchers]);
  };

  const deleteVoucher = async (id: string) => {
    const response = await fetch('http://localhost/esp32-api/index.php', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  };

  return {
    vouchers,
    loading,
    error,
    addVoucher,
    deleteVoucher
  };
};