
import React from 'react';
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Zinger Burger',
    code: '1066708',
    price: 149,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '2',
    name: 'Hot & Crispy Chicken (2pc)',
    code: '2044511',
    price: 219,
    category: 'Chicken',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '3',
    name: 'French Fries (Large)',
    code: '3399002',
    price: 99,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '4',
    name: 'Pepsi (Medium)',
    code: '4455009',
    price: 60,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1629203851022-39c642378c42?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '5',
    name: 'Veggie Delite Burger',
    code: '1066709',
    price: 129,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '6',
    name: 'Super Saver Combo',
    code: 'CB-5001',
    price: 249,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=300&q=80',
    available: true,
    isCombo: true,
    comboItems: ['1', '3', '4']
  },
  {
    id: '7',
    name: 'Popcorn Chicken (L)',
    code: '2044512',
    price: 189,
    category: 'Chicken',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '8',
    name: 'Cheese Garlic Bread',
    code: '3399003',
    price: 119,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1573140401552-39d7448f71bb?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '9',
    name: 'Lemon Ice Tea',
    code: '4455010',
    price: 75,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '10',
    name: 'BBQ Wings (6pc)',
    code: '2044513',
    price: 249,
    category: 'Chicken',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '11',
    name: 'Double Cheese Burger',
    code: '1066710',
    price: 179,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '12',
    name: 'Onion Rings',
    code: '3399004',
    price: 89,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '13',
    name: 'Cold Coffee',
    code: '4455011',
    price: 95,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '14',
    name: 'Chicken Strips (4pc)',
    code: '2044514',
    price: 159,
    category: 'Chicken',
    image: 'https://images.unsplash.com/photo-1562967914-6c82cbad3c11?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '15',
    name: 'Spicy Paneer Burger',
    code: '1066711',
    price: 159,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1619096279114-426004bb8464?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '16',
    name: 'Family Bucket Combo',
    code: 'CB-5002',
    price: 599,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=300&q=80',
    available: true,
    isCombo: true,
    comboItems: ['2', '7', '14', '4', '4']
  },
  {
    id: '17',
    name: 'Potato Wedges',
    code: '3399005',
    price: 109,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1592119747782-d8c12c2ea267?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '18',
    name: 'Orange Juice',
    code: '4455012',
    price: 80,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '19',
    name: 'Fish Fillet Burger',
    code: '1066712',
    price: 189,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '20',
    name: 'Nuggets (9pc)',
    code: '3399006',
    price: 169,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '21',
    name: 'Chocolate Shake',
    code: '4455013',
    price: 120,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '22',
    name: 'Grilled Chicken Burger',
    code: '1066713',
    price: 169,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '23',
    name: 'Coleslaw',
    code: '3399007',
    price: 59,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '24',
    name: 'Mineral Water',
    code: '4455014',
    price: 30,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '25',
    name: 'Chicken Rice Bowl',
    code: '2044515',
    price: 229,
    category: 'Meals',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '26',
    name: 'Paneer Rice Bowl',
    code: '2044516',
    price: 199,
    category: 'Meals',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '27',
    name: 'Veggie Saver Meal',
    code: 'CB-5003',
    price: 199,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1610614819513-e8e35263d000?auto=format&fit=crop&w=300&q=80',
    available: true,
    isCombo: true,
    comboItems: ['5', '3', '4']
  },
  {
    id: '28',
    name: 'Hot Wings (10pc)',
    code: '2044517',
    price: 389,
    category: 'Chicken',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '29',
    name: 'Periperi Fries',
    code: '3399008',
    price: 119,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80',
    available: true
  },
  {
    id: '30',
    name: 'Strawberry Shake',
    code: '4455015',
    price: 120,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=300&q=80',
    available: true
  }
];

export const ICONS = {
  Plus: ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  ),
  Minus: ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  ),
  Trash: ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
  ),
  Edit: ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  ),
  Check: ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  Copy: ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  ),
  Box: ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
  ),
  History: ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  ),
  Menu: ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} pointer-events-none`}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
  )
};
