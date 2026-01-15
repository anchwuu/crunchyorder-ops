
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ICONS } from '../constants';

interface ProductManagementProps {
  products: Product[];
  onUpdate: (p: Product) => void;
  onAdd: (p: Product) => void;
  onDelete: (id: string) => boolean;
}

type SearchMode = 'TEXT' | 'PRICE';

const ProductManagement: React.FC<ProductManagementProps> = ({ products, onUpdate, onAdd, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('TEXT');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showEditConfirmDelete, setShowEditConfirmDelete] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (searchMode === 'TEXT') {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return p.price.toString() === searchQuery;
      }
    });
  }, [products, searchQuery, searchMode]);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setIsAdding(false);
    setShowEditConfirmDelete(false);
  };

  const saveEdit = () => {
    if (editForm) {
      if (isAdding) {
        onAdd({ ...editForm, id: Date.now().toString() });
      } else {
        onUpdate(editForm);
      }
      cancelEdit();
    }
  };

  const startAdd = () => {
    const newProduct: Product = {
      id: '',
      name: '',
      code: '',
      price: 0,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
      available: true,
      isCombo: false,
      comboItems: []
    };
    setEditForm(newProduct);
    setIsAdding(true);
    setEditingId('NEW');
  };

  const toggleComboItem = (productId: string) => {
    if (!editForm) return;
    const currentItems = editForm.comboItems || [];
    const newItems = currentItems.includes(productId)
      ? currentItems.filter(id => id !== productId)
      : [...currentItems, productId];

    // Auto-generate name based on items if it's a combo and name is empty/default
    let newName = editForm.name;
    if (newItems.length > 0 && (!newName || newName === 'New Combo')) {
      newName = newItems.map(id => products.find(p => p.id === id)?.name).join(' + ');
    }

    setEditForm({ ...editForm, comboItems: newItems, name: newName });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto scrollbar-hide pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Inventory</h1>
          <button
            onClick={startAdd}
            aria-label="Add new product to inventory"
            className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-1 shadow-md text-sm active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <ICONS.Plus />
            <span>New Item</span>
          </button>
        </div>

        <div className="px-4 pb-4 space-y-2">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type={searchMode === 'TEXT' ? "text" : "number"}
                placeholder={searchMode === 'TEXT' ? "Search by name or code..." : "Search by Price..."}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-red-500 text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button onClick={() => { setSearchMode('TEXT'); setSearchQuery(''); }} className={`px-3 py-1 rounded-lg text-[10px] font-black transition ${searchMode === 'TEXT' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500'}`}>ABC</button>
              <button onClick={() => { setSearchMode('PRICE'); setSearchQuery(''); }} className={`px-3 py-1 rounded-lg text-[10px] font-black transition ${searchMode === 'PRICE' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500'}`}>₹</button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col">
            <div className="flex space-x-4">
              <img src={p.image} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-gray-900 leading-tight flex items-center">
                    {p.name}
                    {p.isCombo && <span className="ml-2 text-[8px] bg-yellow-100 text-yellow-600 px-1 py-0.5 rounded font-black tracking-widest uppercase">Combo</span>}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.available ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <p className="text-sm font-mono-custom text-red-600 font-black mt-1 uppercase tracking-tight">#{p.code}</p>
                <p className="text-lg font-black text-gray-900 mt-1">₹{p.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-50">
              {confirmDeleteId === p.id ? (
                <div className="flex-1 flex items-center space-x-2 animate-in fade-in slide-in-from-right-4 duration-200">
                  <p className="flex-1 text-[10px] font-black text-red-600 uppercase tracking-tighter">Confirm Delete?</p>
                  <button
                    onClick={() => {
                      onDelete(p.id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase shadow-sm active:scale-95 transition-transform"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl font-black text-[10px] uppercase active:scale-95 transition-transform"
                  >
                    No
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => startEdit(p)} aria-label={`Edit ${p.name}`} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-1 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    <ICONS.Edit />
                    <span>Edit</span>
                  </button>
                  <button
                    type='button'
                    onClick={() => setConfirmDeleteId(p.id)}
                    aria-label={`Delete ${p.name}`}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 active:scale-95 transition-all"
                  >
                    <ICONS.Trash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {(editingId || isAdding) && editForm && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 shadow-sm">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                {isAdding ? 'New Item' : 'Edit Item'}
              </h2>
              {!isAdding && (
                <div className="flex items-center space-x-2">
                  {showEditConfirmDelete ? (
                    <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-right-4 duration-200">
                      <button
                        onClick={() => {
                          onDelete(editForm.id);
                          cancelEdit();
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-black text-[10px] uppercase shadow-sm active:scale-95 transition-transform"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setShowEditConfirmDelete(false)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg font-black text-[10px] uppercase active:scale-95 transition-transform"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowEditConfirmDelete(true)}
                      className="p-2 text-red-600 bg-red-50 rounded-xl active:scale-95 transition-transform"
                      aria-label="Delete product"
                    >
                      <ICONS.Trash />
                    </button>
                  )}
                </div>
              )}
            </div>
            <button onClick={cancelEdit} className="text-gray-400 p-2 font-bold text-2xl">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
              <div>
                <h4 className="font-black text-red-900 uppercase text-xs tracking-widest">Combo Offer Mode</h4>
                <p className="text-[10px] text-red-600 font-bold">Groups multiple products into one SKU</p>
              </div>
              <button
                onClick={() => setEditForm({ ...editForm, isCombo: !editForm.isCombo, category: !editForm.isCombo ? 'Combos' : editForm.category })}
                className={`w-14 h-8 rounded-full transition-colors relative ${editForm.isCombo ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${editForm.isCombo ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {editForm.isCombo && (
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Included Products</label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto scrollbar-hide p-2 bg-gray-100 rounded-xl">
                  {products.filter(p => !p.isCombo).map(p => (
                    <button
                      key={p.id}
                      onClick={() => toggleComboItem(p.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition ${editForm.comboItems?.includes(p.id) ? 'bg-white border-red-500 shadow-sm' : 'bg-transparent border-transparent text-gray-500'
                        }`}
                    >
                      <span className="text-sm font-bold">{p.name}</span>
                      <span className="text-xs font-mono-custom">₹{p.price}</span>
                    </button>
                  ))}
                </div>
                {editForm.comboItems && editForm.comboItems.length > 0 && (
                  <p className="text-[10px] text-gray-400 italic">
                    Individual total: ₹{editForm.comboItems.reduce((acc, id) => acc + (products.find(p => p.id === id)?.price || 0), 0)}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Image</label>
              <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-inner bg-gray-200 border-2 border-white">
                    <img
                      src={editForm.image}
                      className="w-full h-full object-cover"
                      alt="Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Upload from Device</p>
                      <label className="cursor-pointer bg-white border-2 border-dashed border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all rounded-xl p-3 flex flex-col items-center justify-center space-y-1 group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-red-500 transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span className="text-[10px] font-black text-gray-500 group-hover:text-red-600 uppercase">Choose File</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditForm({ ...editForm, image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Or use Image URL</p>
                  <input
                    type="text"
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                    value={editForm.image.startsWith('data:') ? '' : editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  />
                  <p className="text-[9px] text-gray-400 italic mt-1">Tip: You can paste a link or upload a local file</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
              <input
                type="text"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-lg"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Item Code</label>
                <input
                  type="text"
                  className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl font-mono-custom text-red-700 font-black uppercase text-lg"
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price (₹)</label>
                <input
                  type="number"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-lg"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-lg appearance-none"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              >
                <option>Burgers</option>
                <option>Chicken</option>
                <option>Sides</option>
                <option>Drinks</option>
                <option>Desserts</option>
                <option>Combos</option>
              </select>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
              <input
                type="checkbox"
                id="available"
                className="w-6 h-6 rounded-lg text-red-600"
                checked={editForm.available}
                onChange={(e) => setEditForm({ ...editForm, available: e.target.checked })}
              />
              <label htmlFor="available" className="text-base font-bold text-gray-700">Available In Stock</label>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-white">
            <button
              onClick={saveEdit}
              disabled={!editForm.name || !editForm.code}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition ${(!editForm.name || !editForm.code) ? 'bg-gray-200 text-gray-400' : 'bg-red-600 text-white active:scale-95'
                }`}
            >
              {isAdding ? 'ADD TO MENU' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
