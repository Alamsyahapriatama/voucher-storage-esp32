import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Voucher } from '../../types';
import { fetchVouchers, deleteVoucher, updateVoucher } from '../../api/voucherApi';
import VoucherCard from './VoucherCard';

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    setLoading(true);
    try {
      const data = await fetchVouchers();
      setVouchers(data);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data voucher.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus voucher ini?')) {
      await deleteVoucher(id);
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
  };

  const handleUpdate = async () => {
    if (!editingVoucher) return;

    await updateVoucher(editingVoucher.id, {
      title: editingVoucher.title,
      ocrText: editingVoucher.ocrText,
    });

    setEditingVoucher(null);
    loadVouchers();
  };

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.ocrText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (voucher.title && voucher.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Error / Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}
      {error && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {/* No Results */}
      {!loading && filteredVouchers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No vouchers found for "{searchTerm}".</p>
        </div>
      )}

      {/* Voucher List */}
      <div className="space-y-4">
        {filteredVouchers.map((voucher) => (
          <VoucherCard
            key={voucher.id}
            voucher={voucher}
            onDelete={() => handleDelete(voucher.id)}
            onEdit={() => handleEdit(voucher)}
          />
        ))}
      </div>

      {/* Modal Edit */}
      {editingVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Voucher</h3>
            <input
              type="text"
              className="border p-2 mb-2 w-full"
              placeholder="Judul"
              value={editingVoucher.title}
              onChange={(e) => setEditingVoucher({ ...editingVoucher, title: e.target.value })}
            />
            <textarea
              className="border p-2 mb-4 w-full"
              rows={4}
              placeholder="OCR Text"
              value={editingVoucher.ocrText}
              onChange={(e) => setEditingVoucher({ ...editingVoucher, ocrText: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setEditingVoucher(null)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={handleUpdate}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherList;
