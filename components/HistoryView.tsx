
import React, { useMemo, useState } from 'react';
import { OrderSession } from '../types';
import { ICONS } from '../constants';
import { formatCurrency, formatDateTime, formatTime, calculateTotal } from '../utils';

interface HistoryViewProps {
  orders: OrderSession[];
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ orders, onClear }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD
  const [filterMonth, setFilterMonth] = useState(''); // MM (1-12)
  const [filterYear, setFilterYear] = useState(''); // YYYY

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.deliveredAt || order.cancelledAt || order.timestamp);

      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerPhone || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = !filterDate || orderDate.toISOString().split('T')[0] === filterDate;
      const matchesMonth = !filterMonth || (orderDate.getMonth() + 1).toString().padStart(2, '0') === filterMonth;
      const matchesYear = !filterYear || orderDate.getFullYear().toString() === filterYear;

      return matchesSearch && matchesDate && matchesMonth && matchesYear;
    });
  }, [orders, searchQuery, filterDate, filterMonth, filterYear]);

  const stats = useMemo(() => {
    const validOrders = filteredOrders.filter(o => o.status === 'DELIVERED');
    const totalSales = validOrders.reduce((acc, order) => {
      return acc + calculateTotal(order.items);
    }, 0);

    const totalItems = validOrders.reduce((acc, order) => {
      return acc + order.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);

    const aov = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;

    return { totalSales, totalOrders: validOrders.length, totalItems, aov };
  }, [filteredOrders]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const years = useMemo(() => {
    const y = orders.map(o => new Date(o.timestamp).getFullYear());
    // Explicitly typing sort parameters as numbers to resolve arithmetic operation errors
    return Array.from(new Set(y)).sort((a: number, b: number) => b - a);
  }, [orders]);

  const months = [
    { label: 'Month', value: '' },
    { label: 'Jan', value: '01' }, { label: 'Feb', value: '02' }, { label: 'Mar', value: '03' },
    { label: 'Apr', value: '04' }, { label: 'May', value: '05' }, { label: 'Jun', value: '06' },
    { label: 'Jul', value: '07' }, { label: 'Aug', value: '08' }, { label: 'Sep', value: '09' },
    { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase">Sales History</h1>
            <p className="text-xs text-gray-500 font-bold">Search and Analysis</p>
          </div>
          <button
            onClick={onClear}
            aria-label="Clear all sales history"
            className="text-gray-400 p-2 hover:text-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
            title="Clear History"
          >
            <ICONS.Trash />
          </button>
        </div>

        {/* Filters Section */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search ID or Customer..."
            aria-label="Search history"
            className="w-full p-2.5 bg-gray-100 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-red-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex space-x-2">
            <input
              type="date"
              className="flex-1 p-2 bg-gray-100 rounded-xl text-xs font-bold border-none"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <select
              className="w-20 p-2 bg-gray-100 rounded-xl text-xs font-bold border-none appearance-none"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select
              className="w-24 p-2 bg-gray-100 rounded-xl text-xs font-bold border-none appearance-none"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            {(filterDate || filterMonth || filterYear || searchQuery) && (
              <button
                onClick={() => { setFilterDate(''); setFilterMonth(''); setFilterYear(''); setSearchQuery(''); }}
                className="p-2 text-red-600 font-black text-[10px] uppercase bg-red-50 rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6 pb-24">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
            <p className="text-2xl font-black text-green-600">{formatCurrency(stats.totalSales)}</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivered</p>
            <p className="text-2xl font-black text-blue-600">{stats.totalOrders}</p>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight flex justify-between">
            <span>Results</span>
            <span className="text-gray-400 font-bold">{filteredOrders.length} matches</span>
          </h2>

          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => {
              const orderTotal = calculateTotal(order.items);
              const isExpanded = expandedId === order.id;
              const isCancelled = order.status === 'CANCELLED';

              return (
                <div key={order.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isCancelled ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                  <button
                    onClick={() => toggleExpand(order.id)}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} order ${order.id}`}
                    className="w-full p-4 flex items-center justify-between text-left focus:outline-none focus:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCancelled ? 'bg-red-50 text-red-300' : 'bg-gray-50 text-gray-400'}`}>
                        <span className="text-xs font-black">{order.id.slice(-2)}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-black text-gray-900 leading-none">{order.customerName}</p>
                          {isCancelled && <span className="text-[8px] bg-red-600 text-white px-1 rounded font-black uppercase">X</span>}
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                          REF: {order.id} • {formatTime(order.deliveredAt || order.cancelledAt || order.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black leading-none mb-1 ${isCancelled ? 'text-gray-400 line-through' : 'text-green-600'}`}>{formatCurrency(orderTotal)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{order.items.length} items</p>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 animate-in slide-in-from-top duration-200">
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600 font-medium">
                              <span className={`font-black ${isCancelled ? 'text-gray-400' : 'text-red-600'}`}>x{item.quantity}</span> {item.name}
                            </span>
                            <span className="font-mono-custom text-gray-400">#{item.code}</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase ${isCancelled ? 'text-red-600' : 'text-green-600'}`}>
                              {order.status}
                            </span>
                            {order.customerPhone && (
                              <span className="text-[9px] font-bold text-gray-400 mt-0.5">{order.customerPhone}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500 font-bold">
                            {formatDateTime(order.deliveredAt || order.cancelledAt || order.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center text-gray-400">
              <p className="text-sm font-bold uppercase tracking-widest italic">No matching records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
