
import React, { useState, useMemo } from 'react';
import { Product, OrderItem, OrderSession } from '../types';
import { ICONS } from '../constants';
import { formatQuantity, calculateTotal } from '../utils';

interface OrderScreenProps {
  products: Product[];
  drafts: OrderSession[];
  pendingOrders: OrderSession[];
  activeDraftId: string | null;
  setActiveDraftId: (id: string | null) => void;
  updateDraftName: (id: string, name: string) => void;
  deleteDraft: (id: string) => void;
  addToCart: (p: Product) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  confirmOrder: () => void;
  holdOrder: () => void;
}

type OrderTab = 'MENU' | 'CART' | 'CODES';
type SearchMode = 'TEXT' | 'PRICE';

const OrderScreen: React.FC<OrderScreenProps> = ({
  products, drafts, pendingOrders, activeDraftId, setActiveDraftId, updateDraftName, deleteDraft,
  addToCart, updateQuantity, removeItem, confirmOrder, holdOrder
}) => {
  const [activeTab, setActiveTab] = useState<OrderTab>('MENU');
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('TEXT');
  const [category, setCategory] = useState('All');
  const [codeSearch, setCodeSearch] = useState('');

  const activeDraft = useMemo(() =>
    drafts.find(d => d.id === activeDraftId) ||
    pendingOrders.find(p => p.id === activeDraftId) ||
    null,
    [drafts, pendingOrders, activeDraftId]
  );

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(p => {
      let matchesSearch = true;
      if (search) {
        matchesSearch = searchMode === 'TEXT'
          ? (p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()))
          : (p.price.toString().startsWith(search));
      }

      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory && p.available;
    });

    // Sort: if in PRICE mode, sort by price. Else, items in activeDraft come first.
    return [...filtered].sort((a, b) => {
      if (searchMode === 'PRICE') {
        return a.price - b.price;
      }

      const qtyA = activeDraft?.items.find(i => i.id === a.id)?.quantity || 0;
      const qtyB = activeDraft?.items.find(i => i.id === b.id)?.quantity || 0;

      if (qtyA > 0 && qtyB === 0) return -1;
      if (qtyA === 0 && qtyB > 0) return 1;
      return 0;
    });
  }, [products, search, searchMode, category, activeDraft]);

  const totalPrice = activeDraft ? calculateTotal(activeDraft.items) : 0;

  const getItemQuantity = (productId: string) => {
    if (!activeDraft) return 0;
    const item = activeDraft.items.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  const isPendingInQueue = (id: string) => pendingOrders.some(p => p.id === id);

  const formatQty = formatQuantity;

  const renderOrderCard = (order: OrderSession, isDraft: boolean) => {
    const isActive = activeDraftId === order.id;
    return (
      <div
        key={order.id}
        onClick={() => { setActiveDraftId(order.id); setActiveTab('MENU'); }}
        className={`bg-white rounded-3xl shadow-sm border transition-all cursor-pointer overflow-hidden ${isActive ? 'border-red-500 ring-4 ring-red-50' : 'border-gray-100 hover:border-gray-300'}`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${!isDraft ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-400'}`}>
              {order.customerName?.charAt(0) || '?'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-black text-gray-900 text-base truncate max-w-[150px]">{order.customerName || 'Guest'}</p>
                {isActive && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">ACTIVE</span>}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{order.items.length} items • ₹{calculateTotal(order.items)}</p>
            </div>
          </div>
          {isDraft && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                deleteDraft(order.id);
              }}
              className="p-3 text-gray-300 hover:text-red-500 transition-colors bg-gray-50 rounded-2xl"
            >
              <ICONS.Trash />
            </button>
          )}
        </div>

        {order.items.length > 0 && (
          <div className="px-5 py-4 bg-gray-50/30 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm group">
                <div className="flex-1 mr-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-[11px] font-mono-custom text-red-500 font-black">#{item.code}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-bold">₹{item.price} each</p>
                </div>

                {isActive ? (
                  <div className="flex flex-col items-end" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); updateQuantity(item.id, -1); }}
                        className="w-7 h-7 bg-gray-900 text-white flex items-center justify-center rounded-full hover:bg-black transition-colors"
                      >
                        <ICONS.Minus size={14} />
                      </button>
                      <span className="font-black text-gray-900 text-sm min-w-[20px] text-center">{formatQty(item.quantity)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); addToCart(item); }}
                        className="w-7 h-7 bg-gray-900 text-white flex items-center justify-center rounded-full hover:bg-black transition-colors"
                      >
                        <ICONS.Plus size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeItem(item.id); }}
                        className="w-7 h-7 bg-red-50 text-red-400 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-colors ml-1"
                        title="Remove Item"
                      >
                        <ICONS.Trash size={12} />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-1">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="font-black text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">x{formatQty(item.quantity)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Navigation Tabs */}
      <div className="p-3 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab('MENU')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${activeTab === 'MENU' ? 'bg-white text-red-600 shadow-md scale-[1.02]' : 'text-gray-500'}`}
          >
            MENU
          </button>
          <button
            onClick={() => setActiveTab('CART')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center space-x-2 ${activeTab === 'CART' ? 'bg-white text-red-600 shadow-md scale-[1.02]' : 'text-gray-500'}`}
          >
            <span>CART</span>
            {(drafts.length + pendingOrders.length) > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px]">
                {drafts.length + pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('CODES')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${activeTab === 'CODES' ? 'bg-white text-red-600 shadow-md scale-[1.02]' : 'text-gray-500'}`}
          >
            CODES
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'MENU' && (
          <div className="h-full flex flex-col bg-gray-50">
            {/* Header: Search & Category Filter */}
            <div className="bg-white shadow-sm border-b border-gray-100 flex-shrink-0 z-20">
              <div className="p-4 pb-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative flex-1 group">
                    <input
                      type={searchMode === 'TEXT' ? "text" : "number"}
                      placeholder={searchMode === 'TEXT' ? "Search items..." : "Filter price..."}
                      className="w-full p-4 pl-12 rounded-3xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none text-sm font-bold transition-all shadow-inner"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute left-4 top-4 text-gray-300 group-focus-within:text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                  </div>
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                    <button onClick={() => { setSearchMode('TEXT'); setSearch(''); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${searchMode === 'TEXT' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}>ABC</button>
                    <button onClick={() => { setSearchMode('PRICE'); setSearch(''); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${searchMode === 'PRICE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}>₹</button>
                  </div>
                </div>

                <div className="flex space-x-2 overflow-x-auto no-scrollbar py-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${category === cat ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product List - EXACT MATCH TO IMAGE DESIGN */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3 pb-40">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => {
                  const qty = getItemQuantity(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => qty === 0 && addToCart(p)}
                      className={`flex items-center bg-white rounded-[2rem] p-4 shadow-sm border transition-all active:scale-[0.99] ${qty > 0 ? 'border-green-500 ring-2 ring-green-50' : 'border-gray-50'
                        }`}
                    >
                      {/* Round Image on Left */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <img
                          src={p.image}
                          className={`w-full h-full object-cover rounded-full shadow-md border-2 ${qty > 0 ? 'border-green-500' : 'border-white'}`}
                          alt={p.name}
                        />
                        {qty > 0 && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white p-1.5 rounded-full shadow-lg animate-in zoom-in duration-300">
                            <ICONS.Check size={12} />
                          </div>
                        )}
                      </div>

                      {/* Title & Price in Middle */}
                      <div className="flex-1 px-5 min-w-0">
                        <h3 className="text-base font-bold text-gray-800 leading-tight truncate">{p.name}</h3>
                        <p className="text-sm font-black text-gray-900 mt-1">₹{p.price.toFixed(2)}</p>
                        {/* Secondary identifier for operators */}
                        <p className="text-[10px] font-mono-custom text-red-500 font-black mt-0.5 opacity-50 uppercase tracking-tighter">SKU: #{p.code}</p>
                      </div>

                      {/* Quantity Controls on Right */}
                      <div className="flex flex-col items-end" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(p.id, -1); }}
                            className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center rounded-full active:bg-black shadow-sm"
                          >
                            <ICONS.Minus size={16} />
                          </button>

                          <span className="font-black text-gray-900 text-base min-w-[24px] text-center">
                            {formatQty(qty)}
                          </span>

                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                            className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center rounded-full active:bg-black shadow-sm"
                          >
                            <ICONS.Plus size={16} />
                          </button>
                        </div>
                        {/* Item total matches image design */}
                        <span className="text-xs text-gray-400 font-bold mt-1">
                          ₹{(p.price * qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                  <p className="text-sm font-black uppercase tracking-widest">No Products Found</p>
                </div>
              )}
            </div>

            {/* Sticky Order Bar */}
            {activeDraft && activeTab === 'MENU' && activeDraft.items.length > 0 && (
              <div className="fixed bottom-6 left-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl p-5 flex items-center justify-between border border-white/5 backdrop-blur-sm">
                  <div onClick={() => setActiveTab('CART')} className="cursor-pointer flex items-center space-x-4">
                    <div className="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="font-black text-lg">{activeDraft.items.length}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">TOTAL BILL</p>
                      <p className="text-xl font-black text-white">₹{totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={holdOrder}
                      className="bg-slate-800 text-white px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-tight shadow-xl active:scale-95 transition-all border border-white/10 hover:bg-slate-700"
                    >
                      Hold
                    </button>
                    <button
                      onClick={confirmOrder}
                      className="bg-white text-slate-900 px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-tight shadow-xl active:scale-95 transition-all"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CART and CODES tabs remain functional */}
        {activeTab === 'CART' && (
          <div className="h-full flex flex-col p-5 bg-gray-50 overflow-y-auto scrollbar-hide pb-24">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Active Sessions</h2>
            <div className="space-y-4">
              {drafts.length === 0 && pendingOrders.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-gray-300">
                  <p className="font-black uppercase tracking-widest text-xs">Queue is Empty</p>
                </div>
              ) : (
                <>
                  {drafts.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Current Drafts</p>
                      {drafts.map(d => renderOrderCard(d, true))}
                    </div>
                  )}
                  {pendingOrders.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest ml-2">Live Orders</p>
                      {pendingOrders.map(p => renderOrderCard(p, false))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'CODES' && (
          <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
            <div className="p-5 pb-2">
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">SKU Lookup</h2>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search products or codes..."
                  className="w-full p-4 pl-12 rounded-3xl border border-white/10 bg-white/5 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none text-sm font-bold text-white transition-all shadow-inner"
                  value={codeSearch}
                  onChange={(e) => setCodeSearch(e.target.value)}
                />
                <div className="absolute left-4 top-4 text-gray-500 group-focus-within:text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide p-5 pt-2 pb-24">
              <div className="grid grid-cols-1 gap-3">
                {products
                  .filter(p =>
                    p.name.toLowerCase().includes(codeSearch.toLowerCase()) ||
                    p.code.toLowerCase().includes(codeSearch.toLowerCase())
                  )
                  .map(p => (
                    <div key={p.id} className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300">{p.name}</span>
                      <span className="text-base font-mono-custom font-black text-yellow-400">#{p.code}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderScreen;
