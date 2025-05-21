import React from 'react';
import { Scan, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVouchers } from '../hooks/useVouchers';
import VoucherList from '../components/Vouchers/VoucherList';

const Dashboard: React.FC = () => {
  const { vouchers, loading, error, deleteVoucher } = useVouchers();
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voucher Invoice PT Jababeka Morotai</h1>
          <p className="mt-1 text-gray-500">Manage your invoices and receipts</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/scan')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Scan className="h-5 w-5 mr-1.5" />
            Scan Document
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <VoucherList 
        vouchers={vouchers} 
        onDelete={deleteVoucher} 
        loading={loading} 
      />
    </div>
  );
};

export default Dashboard;