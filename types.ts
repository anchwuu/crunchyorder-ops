
export interface Product {
  id: string;
  name: string;
  code: string; // Alphanumeric unique code
  price: number;
  category: string;
  image: string;
  available: boolean;
  isCombo?: boolean;
  comboItems?: string[]; // IDs of products included in the combo
}

export interface OrderItem extends Product {
  quantity: number;
}

export enum AppView {
  ORDER = 'ORDER',
  QUEUE = 'QUEUE',
  BILLING = 'BILLING',
  MANAGEMENT = 'MANAGEMENT',
  HISTORY = 'HISTORY'
}

export interface OrderSession {
  id: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  timestamp: number;
  status: 'DRAFT' | 'PENDING' | 'HOLD' | 'DELIVERED' | 'CANCELLED';
  deliveredAt?: number;
  cancelledAt?: number;
}
