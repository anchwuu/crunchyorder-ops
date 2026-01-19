
import React, { useState, useEffect } from 'react';
import { AppView, Product, OrderItem, OrderSession } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { generateOrderId } from './utils';
import OrderScreen from './components/OrderScreen';
import ProductManagement from './components/ProductManagement';
import BillingView from './components/BillingView';
import Navigation from './components/Navigation';
import QueueView from './components/QueueView';
import HistoryView from './components/HistoryView';
import SuccessView from './components/SuccessView';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ORDER);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('crunchy_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [drafts, setDrafts] = useState<OrderSession[]>(() => {
    const saved = localStorage.getItem('crunchy_drafts');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  const [activeOrder, setActiveOrder] = useState<OrderSession | null>(null);
  const [pendingOrders, setPendingOrders] = useState<OrderSession[]>(() => {
    const saved = localStorage.getItem('crunchy_pending_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedOrders, setCompletedOrders] = useState<OrderSession[]>(() => {
    const saved = localStorage.getItem('crunchy_order_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<OrderSession | null>(null);

  useEffect(() => {
    localStorage.setItem('crunchy_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('crunchy_drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem('crunchy_pending_orders', JSON.stringify(pendingOrders));
  }, [pendingOrders]);

  useEffect(() => {
    localStorage.setItem('crunchy_order_history', JSON.stringify(completedOrders));
  }, [completedOrders]);

  const getActiveOrderData = () => {
    return drafts.find(d => d.id === activeDraftId) || pendingOrders.find(p => p.id === activeDraftId) || null;
  };

  const updateDraftName = (id: string, name: string) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, customerName: name } : d));
  };

  const deleteDraft = (id: string) => {
    if (window.confirm('Are you sure you want to discard this draft? All selected items will be lost.')) {
      setDrafts(prev => prev.filter(d => d.id !== id));
      if (activeDraftId === id) setActiveDraftId(null);
    }
  };

  const addToCart = (product: Product) => {
    const currentId = activeDraftId;

    if (!currentId) {
      const newId = generateOrderId();
      const newDraft: OrderSession = {
        id: newId,
        customerName: '',
        items: [{ ...product, quantity: 1 }],
        timestamp: Date.now(),
        status: 'DRAFT'
      };
      setDrafts(prev => [...prev, newDraft]);
      setActiveDraftId(newId);
      return;
    }

    setDrafts(prev => prev.map(d => {
      if (d.id === currentId) {
        const existing = d.items.find(item => item.id === product.id);
        const newItems = existing
          ? d.items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...d.items, { ...product, quantity: 1 }];
        return { ...d, items: newItems };
      }
      return d;
    }));

    setPendingOrders(prev => prev.map(order => {
      if (order.id === currentId) {
        const existing = order.items.find(item => item.id === product.id);
        const newItems = existing
          ? order.items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...order.items, { ...product, quantity: 1 }];
        return { ...order, items: newItems };
      }
      return order;
    }));
  };

  const updateQuantity = (id: string, delta: number) => {
    const currentId = activeDraftId;
    if (!currentId) return;

    setDrafts(prev => prev.map(draft => {
      if (draft.id === currentId) {
        const newItems = draft.items.map(item =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        ).filter(item => item.quantity > 0);
        return { ...draft, items: newItems };
      }
      return draft;
    }));

    setPendingOrders(prev => prev.map(order => {
      if (order.id === currentId) {
        const newItems = order.items.map(item =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        ).filter(item => item.quantity > 0);
        return { ...order, items: newItems };
      }
      return order;
    }));
  };

  const removeItem = (productId: string) => {
    const currentId = activeDraftId;
    if (!currentId) return;

    setDrafts(prev => prev.map(draft => {
      if (draft.id === currentId) {
        return { ...draft, items: draft.items.filter(item => item.id !== productId) };
      }
      return draft;
    }));

    setPendingOrders(prev => prev.map(order => {
      if (order.id === currentId) {
        return { ...order, items: order.items.filter(item => item.id !== productId) };
      }
      return order;
    }));
  };

  const confirmOrder = () => {
    const current = getActiveOrderData();
    if (!current || current.items.length === 0) return;

    setActiveOrder({ ...current, status: 'PENDING' });
    if (drafts.some(d => d.id === current.id)) {
      setDrafts(prev => prev.filter(d => d.id !== current.id));
    }
    setActiveDraftId(null);
    setView(AppView.BILLING);
  };

  const holdOrder = () => {
    const current = getActiveOrderData();
    if (!current || current.items.length === 0) return;

    const heldOrder: OrderSession = {
      ...current,
      status: 'HOLD',
      timestamp: Date.now()
    };

    setPendingOrders(prev => {
      const exists = prev.some(o => o.id === heldOrder.id);
      if (exists) {
        return prev.map(o => o.id === heldOrder.id ? heldOrder : o);
      }
      return [heldOrder, ...prev];
    });
    setDrafts(prev => prev.filter(d => d.id !== current.id));
    setActiveDraftId(null);
  };

  const resumeOrder = (orderId: string) => {
    const orderToResume = pendingOrders.find(o => o.id === orderId);
    if (orderToResume) {
      const draft: OrderSession = {
        ...orderToResume,
        status: 'DRAFT'
      };
      setDrafts(prev => [draft, ...prev]);
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      setActiveDraftId(orderId);
      setView(AppView.ORDER);
    }
  };

  const holdFromBilling = (updatedName: string, updatedPhone: string) => {
    if (!activeOrder) return;
    const heldOrder: OrderSession = {
      ...activeOrder,
      customerName: updatedName.trim() || activeOrder.customerName,
      customerPhone: updatedPhone.trim() || activeOrder.customerPhone,
      status: 'HOLD',
      timestamp: Date.now()
    };

    setPendingOrders(prev => {
      const exists = prev.some(o => o.id === heldOrder.id);
      if (exists) {
        return prev.map(o => o.id === heldOrder.id ? heldOrder : o);
      }
      return [heldOrder, ...prev];
    });
    setActiveOrder(null);
    setView(AppView.ORDER);
  };

  const sendToQueue = (updatedName: string, updatedPhone: string) => {
    if (!activeOrder) return;
    const orderWithFinalInfo: OrderSession = {
      ...activeOrder,
      customerName: updatedName.trim() || activeOrder.customerName,
      customerPhone: updatedPhone.trim() || activeOrder.customerPhone
    };

    setPendingOrders(prev => {
      const exists = prev.some(o => o.id === orderWithFinalInfo.id);
      if (exists) {
        return prev.map(o => o.id === orderWithFinalInfo.id ? orderWithFinalInfo : o);
      }
      return [orderWithFinalInfo, ...prev];
    });

    setLastConfirmedOrder(orderWithFinalInfo);
    setActiveOrder(null);
    setView(AppView.SUCCESS);
  };

  const deliverOrder = (orderId: string) => {
    const orderToDeliver = pendingOrders.find(o => o.id === orderId);
    if (orderToDeliver) {
      const completed: OrderSession = {
        ...orderToDeliver,
        status: 'DELIVERED',
        deliveredAt: Date.now()
      };
      setCompletedOrders(prev => [completed, ...prev]);
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      if (activeDraftId === orderId) setActiveDraftId(null);
    }
  };

  const cancelOrder = (orderId: string) => {
    const orderToCancel = pendingOrders.find(o => o.id === orderId);
    if (orderToCancel && window.confirm('Permanently cancel this order? This cannot be undone.')) {
      const cancelled: OrderSession = {
        ...orderToCancel,
        status: 'CANCELLED',
        cancelledAt: Date.now()
      };
      setCompletedOrders(prev => [cancelled, ...prev]);
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      if (activeDraftId === orderId) setActiveDraftId(null);
    }
  };

  const clearHistory = () => {
    if (window.confirm('DANGER: Clear all sales history and analysis data permanently?')) {
      setCompletedOrders([]);
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <Navigation currentView={view} setView={setView} pendingCount={pendingOrders.length} />

      <main className="flex-1 flex flex-col overflow-hidden relative" role="main">
        {view === AppView.ORDER && (
          <OrderScreen
            products={products}
            drafts={drafts}
            pendingOrders={pendingOrders}
            activeDraftId={activeDraftId}
            setActiveDraftId={setActiveDraftId}
            updateDraftName={updateDraftName}
            deleteDraft={deleteDraft}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            confirmOrder={confirmOrder}
            holdOrder={holdOrder}
          />
        )}

        {view === AppView.MANAGEMENT && (
          <ProductManagement
            products={products}
            onUpdate={updateProduct}
            onAdd={addProduct}
            onDelete={deleteProduct}
          />
        )}

        {view === AppView.BILLING && activeOrder && (
          <BillingView
            order={activeOrder}
            onConfirm={(name, phone) => sendToQueue(name, phone)}
            onHold={(name, phone) => holdFromBilling(name, phone)}
          />
        )}

        {view === AppView.QUEUE && (
          <QueueView
            orders={pendingOrders}
            onDeliver={deliverOrder}
            onCancel={cancelOrder}
            onResume={resumeOrder}
            onNewOrder={() => setView(AppView.ORDER)}
          />
        )}

        {view === AppView.SUCCESS && lastConfirmedOrder && (
          <SuccessView
            order={lastConfirmedOrder}
            onNewOrder={() => {
              setLastConfirmedOrder(null);
              setView(AppView.ORDER);
            }}
          />
        )}

        {view === AppView.HISTORY && (
          <HistoryView
            orders={completedOrders}
            onClear={clearHistory}
          />
        )}
      </main>
    </div>
  );
};

export default App;
