import React from 'react';
import { FullPageCart } from './FullPageCart';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ activeTheme, formatPrice, onProceedToCheckout, onBackToStore }) => {
  const { isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans animate-in fade-in duration-200 bg-[#f8fcf9] text-neutral-900">
      <FullPageCart
        onBackToStore={() => {
          setIsCartOpen(false);
          if (onBackToStore) onBackToStore();
        }}
        formatPrice={formatPrice}
        onProceedToCheckout={onProceedToCheckout}
      />
    </div>
  );
};
