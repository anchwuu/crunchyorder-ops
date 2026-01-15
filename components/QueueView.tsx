
import React from 'react';
import { OrderSession } from '../types';
import { ICONS } from '../constants';
import { getTimeAgo, formatTime, calculateTotal } from '../utils';

interface QueueViewProps {
  orders: OrderSession[];
  onDeliver: (id: string) => void;
  onCancel: (id: string) => void;
  onResume: (id: string) => void;
  onNewOrder: () => void;
}

const QueueView: React.FC<QueueViewProps> = ({ orders, onDeliver, onCancel, onResume, onNewOrder }) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-black text-gray-900 uppercase">Delivery Queue</h1>
          <p className="text-xs text-gray-500 font-bold" role="status" aria-live="polite">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} pending
          </p>
        </div>
        <button
          onClick={onNewOrder}
          aria-label="Create new order"
          className="bg-red-600 text-white p-2.5 rounded-xl shadow-md active:scale-90 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <ICONS.Plus />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 pb-20">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center space-x-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${order.status === 'HOLD' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {order.id.slice(-2)}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">REF: {order.id}</p>
                      {order.status === 'HOLD' && (
                        <span className="text-[8px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">PENDING CONFIRMATION</span>
                      )}
                    </div>
                    <p className="text-sm font-black text-gray-900">{order.customerName || 'No Name'}</p>
                    {order.customerPhone && (
                      <p className="text-[9px] font-bold text-red-500 mt-0.5">{order.customerPhone}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">AGE</p>
                  <p className="text-xs font-bold text-gray-600">
                    {getTimeAgo(order.timestamp)}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium">
                    {formatTime(order.timestamp)}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-red-600">x{item.quantity}</span>
                      <span className="text-sm font-bold text-gray-700 truncate max-w-[180px]">{item.name}</span>
                    </div>
                    <span className="text-xs font-mono-custom font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      #{item.code}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-center justify-between mb-4 mt-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Grand Total</span>
                  <span className="text-lg font-black text-gray-900">
                    ₹{calculateTotal(order.items)}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onCancel(order.id); }}
                    aria-label="Cancel order"
                    className="p-3.5 bg-gray-100 text-gray-400 font-black rounded-2xl active:bg-red-50 active:text-red-600 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                    title="Cancel Order"
                  >
                    <ICONS.Trash />
                  </button>
                  {order.status === 'HOLD' ? (
                    <button
                      onClick={() => onResume(order.id)}
                      className="flex-1 py-3.5 bg-amber-500 text-white font-black rounded-2xl shadow-lg shadow-amber-50 flex items-center justify-center space-x-2 active:scale-[0.98] transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                      <ICONS.Plus size={16} />
                      <span className="uppercase text-sm tracking-tight">Resume Order</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onDeliver(order.id)}
                      aria-label="Mark order as delivered"
                      className="flex-1 py-3.5 bg-green-600 text-white font-black rounded-2xl shadow-lg shadow-green-50 flex items-center justify-center space-x-2 active:scale-[0.98] transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <ICONS.Check />
                      <span className="uppercase text-sm tracking-tight">Deliver & Close</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ICONS.Box />
            </div>
            <p className="font-black uppercase tracking-widest text-sm">All Clear</p>
            <p className="text-xs font-medium italic mt-1">No pending orders in queue</p>
            <button
              onClick={onNewOrder}
              className="mt-6 text-red-600 font-black text-sm uppercase underline decoration-2 underline-offset-4"
            >
              Take an Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueView;
