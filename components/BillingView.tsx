
import React, { useState } from 'react';
import { OrderSession } from '../types';
import { ICONS } from '../constants';
import { validateCustomerName, calculateTotal } from '../utils';

interface BillingViewProps {
  order: OrderSession;
  onConfirm: (finalName: string, finalPhone: string) => void;
  onHold: (finalName: string, finalPhone: string) => void;
}

const BillingView: React.FC<BillingViewProps> = ({ order, onConfirm, onHold }) => {
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState(order.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone || '');

  const codeString = order.items.map(i => `${i.code} x${i.quantity}`).join('\n');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const total = calculateTotal(order.items);
  const isValidName = validateCustomerName(customerName);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="bg-green-600 p-4 text-white text-center flex-shrink-0">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1 border border-white/40">
          <ICONS.Check size={16} />
        </div>
        <h1 className="text-lg font-black uppercase tracking-tight">Billing Entry</h1>
        <p className="opacity-70 font-mono-custom text-[8px]">ORDER REF: {order.id}</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {/* Customer Info Section */}
        <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              aria-label="Customer name"
              aria-required="true"
              aria-invalid={!isValidName}
              className={`w-full p-3 bg-gray-50 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:outline-none font-black text-lg text-gray-800 transition ${!isValidName && customerName.length > 0 ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              aria-label="Customer phone number"
              className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:outline-none font-bold text-lg text-gray-800 transition"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-5 shadow-xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Entry Sequence</h3>
            <button
              onClick={copyToClipboard}
              aria-label={copied ? 'Codes copied' : 'Copy order codes to clipboard'}
              className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase transition-all ${copied ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {copied ? 'Copied' : 'Copy Codes'}
            </button>
          </div>

          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div className="flex-1">
                  <p className="text-[9px] text-gray-500 font-bold mb-1 uppercase truncate max-w-[150px]">{item.name}</p>
                  <p className="text-2xl font-mono-custom font-black text-yellow-400 tracking-tighter leading-none">{item.code}</p>
                </div>
                <div className="bg-gray-800 px-3 py-1.5 rounded-xl text-center min-w-[50px]">
                  <p className="text-[8px] text-gray-500 font-bold uppercase">Qty</p>
                  <p className="text-xl font-black text-white leading-none">{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center bg-gray-800/50 p-3 rounded-2xl border border-gray-800">
            <span className="text-gray-500 font-bold text-xs uppercase">Total Bill</span>
            <span className="text-xl font-black text-white">₹{total}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-8">
          <p className="text-xs text-blue-700 font-bold leading-snug">
            ⚠️ Type these codes into the official register. Once paid, click "Confirm" to move to the kitchen/delivery queue.
          </p>
        </div>
      </div>

      {/* Action Bar - Fixed Footer Style */}
      <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0 flex space-x-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] mb-2 relative z-50">
        <button
          onClick={() => onHold(customerName, customerPhone)}
          className="flex-1 py-4 bg-gray-100 text-gray-500 font-extrabold rounded-3xl shadow-sm text-[10px] uppercase tracking-tight transition active:scale-95 hover:bg-gray-200"
        >
          Hold Later
        </button>
        <button
          onClick={() => onConfirm(customerName, customerPhone)}
          disabled={!isValidName}
          aria-label="Confirm order and move to queue"
          className={`flex-[2] py-4 font-black rounded-3xl shadow-lg text-[12px] uppercase tracking-tight transition ${isValidName
            ? 'bg-red-600 text-white active:scale-95 hover:bg-red-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          Confirm & Queue
        </button>
      </div>
    </div>
  );
};

export default BillingView;
