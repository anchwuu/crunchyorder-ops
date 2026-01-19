
import React from 'react';
import { OrderSession } from '../types';
import { ICONS } from '../constants';
import { calculateTotal, formatCurrency, formatDateTime } from '../utils';

interface SuccessViewProps {
    order: OrderSession;
    onNewOrder: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ order, onNewOrder }) => {
    const total = calculateTotal(order.items);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-y-auto scrollbar-hide">
            {/* Non-printable UI */}
            <div className="print:hidden p-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                    <ICONS.Check size={40} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Order Successful!</h1>
                    <p className="text-gray-500 font-bold mt-2">Order REF: <span className="text-red-600">#{order.id}</span></p>
                </div>

                <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <span>Customer</span>
                        <span className="text-gray-900">{order.customerName || 'Guest'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-4">
                        <span>Total Bill</span>
                        <span className="text-2xl font-black text-green-600">{formatCurrency(total)}</span>
                    </div>
                </div>

                <div className="flex flex-col w-full max-w-sm space-y-3 pt-4">
                    <button
                        onClick={handlePrint}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all hover:bg-black"
                    >
                        <ICONS.History size={20} />
                        <span className="uppercase tracking-tight">Print Bill / Receipt</span>
                    </button>
                    <button
                        onClick={onNewOrder}
                        className="w-full py-5 bg-white text-red-600 border-2 border-red-50 font-black rounded-3xl shadow-sm flex items-center justify-center space-x-3 active:scale-95 transition-all hover:bg-gray-50"
                    >
                        <ICONS.Plus size={20} />
                        <span className="uppercase tracking-tight">Continue to NEW Order</span>
                    </button>
                </div>
            </div>

            {/* Printable Receipt (visible only during print) */}
            <div className="hidden print:block p-8 font-mono text-sm text-black bg-white">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold uppercase">POPIAH KITCHEN</h1>
                    <p className="text-xs">Order Management System v2.0</p>
                    <div className="border-t border-dashed border-black my-4"></div>
                </div>

                <div className="space-y-1 mb-6">
                    <div className="flex justify-between">
                        <span>REF:</span>
                        <span>{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>DATE:</span>
                        <span>{formatDateTime(order.timestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>CUSTOMER:</span>
                        <span>{order.customerName || 'GUEST'}</span>
                    </div>
                    {order.customerPhone && (
                        <div className="flex justify-between">
                            <span>PHONE:</span>
                            <span>{order.customerPhone}</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-dashed border-black my-4"></div>

                <div className="space-y-2 mb-6">
                    <div className="flex justify-between font-bold text-xs uppercase underline">
                        <span>Item</span>
                        <span>Qty</span>
                        <span>Price</span>
                    </div>
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                            <span className="flex-1 pr-2">{item.name}</span>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <span className="w-16 text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-dashed border-black my-4"></div>

                <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(total)}</span>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-xs">Thank you for ordering!</p>
                    <p className="text-[10px] mt-1 italic">Visit again soon</p>
                </div>
            </div>
        </div>
    );
};

export default SuccessView;
