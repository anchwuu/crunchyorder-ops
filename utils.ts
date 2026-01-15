
export const formatCurrency = (amount: number): string => {
    return `₹${amount.toFixed(2)}`;
};

export const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatDateTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const generateOrderId = (): string => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export const formatQuantity = (qty: number): string => {
    return qty.toString().padStart(2, '0');
};

export const validateCustomerName = (name: string): boolean => {
    return name.trim().length > 0;
};

export const calculateTotal = (items: Array<{ price: number; quantity: number }>): number => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};
