import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { calculateDelivery } from '../utils/deliveryCharges';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Delivery destination location for courier calculation (default to Bhopal)
  const [shippingLocation, setShippingLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_shipping_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462036'
    };
  });

  // Listen for admin changes to courier rates
  const [courierSettingsTick, setCourierSettingsTick] = useState(0);
  useEffect(() => {
    const handleSettingsUpdate = () => {
      setCourierSettingsTick(t => t + 1);
    };
    window.addEventListener('krishi_courier_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('krishi_courier_settings_updated', handleSettingsUpdate);
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('krishi_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync shipping location
  const updateShippingLocation = useCallback((newLoc) => {
    setShippingLocation(prev => {
      const updated = { ...prev, ...newLoc };
      try {
        localStorage.setItem('krishi_shipping_location', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setLastAddedItem(product);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Calculate location-based courier delivery fee
  const deliveryInfo = useMemo(() => {
    return calculateDelivery({
      city: shippingLocation.city,
      state: shippingLocation.state,
      pincode: shippingLocation.pincode,
      subtotal
    });
  }, [shippingLocation.city, shippingLocation.state, shippingLocation.pincode, subtotal, courierSettingsTick]);

  const deliveryFee = deliveryInfo.deliveryFee;
  const grandTotal = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItemsCount,
      subtotal,
      deliveryFee,
      deliveryInfo,
      shippingLocation,
      updateShippingLocation,
      setShippingLocation,
      grandTotal,
      lastAddedItem
    }}>
      {children}
    </CartContext.Provider>
  );
};
