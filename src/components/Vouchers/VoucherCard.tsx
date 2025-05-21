import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Voucher } from '../../types';

interface VoucherCardProps {
  voucher: Voucher;
  onDelete: (id: string) => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-gray-200 overflow-hidden">
          <img 
            src={voucher.imageUrl} 
            alt="Voucher" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-grow p-4">
          <div className="flex justify-between items-start">
            <div>
              {/* ✅ Judul: nama file hasil scan */}
              <h3 className="font-medium text-gray-900 break-words">
                {voucher.filename || 'Scanned File'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(voucher.uploadDate)}
              </p>
            </div>

            {/* ✅ Tombol delete benar-benar kirim ID string */}
            <button
              onClick={() => onDelete(voucher.id.toString())}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Delete voucher"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Expandable OCR text */}
          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show details
                </>
              )}
            </button>

            {expanded && (
              <div className="mt-3 bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {voucher.ocrText?.trim() || 'No OCR result found for this document.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;
