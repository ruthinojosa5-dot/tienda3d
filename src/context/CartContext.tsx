import React, { createContext, useContext, useState, useEffect } from 'react';
import { Producto, CartItem, CustomerOrderInfo } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (producto: Producto, cantidad?: number, color?: string, notas?: string) => void;
  removeFromCart: (productoId: string | number) => void;
  updateQuantity: (productoId: string | number, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  freeShippingThreshold: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  customerInfo: CustomerOrderInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerOrderInfo>>;
}

const CART_STORAGE_KEY = 'universo3d_cart_v1';
const FREE_SHIPPING_THRESHOLD = 35000;
const STANDARD_SHIPPING_COST = 3800;

const defaultCustomerInfo: CustomerOrderInfo = {
  nombre: '',
  telefono: '',
  metodoEntrega: 'retiro',
  direccion: '',
  ciudad: 'San Salvador de Jujuy',
  notas: '',
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse cart from localStorage', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerOrderInfo>(() => {
    try {
      const saved = localStorage.getItem('universo3d_customer_info');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultCustomerInfo;
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  // Persist customer info to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('universo3d_customer_info', JSON.stringify(customerInfo));
    } catch {
      // fallback
    }
  }, [customerInfo]);

  const addToCart = (producto: Producto, cantidad = 1, color?: string, notas?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.producto.id === producto.id && i.colorSeleccionado === color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const currentQty = next[existingIndex].cantidad;
        const maxStock = producto.stock > 0 ? producto.stock : 99;
        const newQty = Math.min(currentQty + cantidad, maxStock);
        next[existingIndex] = {
          ...next[existingIndex],
          cantidad: newQty,
          notasPersonalizadas: notas || next[existingIndex].notasPersonalizadas,
        };
        return next;
      }

      return [
        ...prev,
        {
          producto,
          cantidad: Math.min(cantidad, producto.stock > 0 ? producto.stock : 99),
          colorSeleccionado: color || producto.colores_disponibles?.[0],
          notasPersonalizadas: notas,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productoId: string | number) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  };

  const updateQuantity = (productoId: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productoId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.producto.id === productoId) {
          const maxStock = item.producto.stock > 0 ? item.producto.stock : 99;
          return {
            ...item,
            cantidad: Math.min(newQuantity, maxStock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.cantidad, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.producto.precio * curr.cantidad, 0);
  
  const shippingCost = customerInfo.metodoEntrega === 'envio'
    ? (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_COST)
    : 0;

  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingCost,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        total,
        isCartOpen,
        setIsCartOpen,
        customerInfo,
        setCustomerInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
