import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Printer, 
  Package, 
  Truck, 
  Info,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase, isSupabaseConfigured } from '../supabase';
import { calculateDelivery } from '../utils/deliveryCharges';

export const CheckoutModal = ({ isOpen, onClose, formatPrice, onOpenAuth }) => {
  const { currentUser, userProfile, updateProfileData } = useAuth();
  const { cartItems, subtotal, clearCart, shippingLocation, updateShippingLocation } = useCart();

  // Form State
  const [shippingInfo, setShippingInfo] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462036',
    notes: ''
  });

  // Calculate live courier charges based on customer delivery location
  const activeDeliveryInfo = useMemo(() => {
    return calculateDelivery({
      city: shippingInfo.city,
      state: shippingInfo.state,
      pincode: shippingInfo.pincode,
      subtotal
    });
  }, [shippingInfo.city, shippingInfo.state, shippingInfo.pincode, subtotal]);

  const activeDeliveryFee = activeDeliveryInfo.deliveryFee;
  const activeGrandTotal = subtotal + activeDeliveryFee;

  const [processing, setProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(null);
  const [error, setError] = useState('');

  // Prepopulate with user profile or default to Bhopal
  useEffect(() => {
    if (userProfile || currentUser) {
      setShippingInfo(prev => ({
        ...prev,
        customerName: userProfile?.displayName || currentUser?.displayName || prev.customerName || '',
        email: userProfile?.email || currentUser?.email || prev.email || '',
        phone: userProfile?.phone || prev.phone || '',
        address: userProfile?.address || prev.address || '',
        city: userProfile?.city || shippingLocation?.city || prev.city || 'Bhopal',
        state: userProfile?.state || shippingLocation?.state || prev.state || 'Madhya Pradesh',
        pincode: userProfile?.pincode || shippingLocation?.pincode || prev.pincode || '462036'
      }));
    } else if (shippingLocation) {
      setShippingInfo(prev => ({
        ...prev,
        city: prev.city || shippingLocation.city || 'Bhopal',
        state: prev.state || shippingLocation.state || 'Madhya Pradesh',
        pincode: prev.pincode || shippingLocation.pincode || '462036'
      }));
    }
  }, [userProfile, currentUser, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setOrderCompleted(null);
      setError('');
      setProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    } catch (e) {
      console.warn('Confetti animation error:', e);
    }
  };

  const handlePlaceOrder = async (e) => {
    e?.preventDefault();
    setError('');

    if (!shippingInfo.customerName.trim() || !shippingInfo.phone.trim() || !shippingInfo.address.trim()) {
      setError('Please provide your recipient name, phone number, and delivery street address.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setProcessing(true);

    try {
      const finalEmail = (shippingInfo.email || currentUser?.email || 'guest@krishikutir.com').trim();
      const finalUid = currentUser?.uid || currentUser?.id || 'guest';
      const orderId = `KK-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData = {
        id: orderId,
        userId: finalUid,
        user_id: finalUid,
        userEmail: finalEmail,
        customerEmail: finalEmail,
        customerName: shippingInfo.customerName.trim(),
        customer_name: shippingInfo.customerName.trim(),
        customerPhone: shippingInfo.phone.trim(),
        customer_phone: shippingInfo.phone.trim(),
        shippingAddress: shippingInfo.address.trim(),
        shippingCity: shippingInfo.city.trim(),
        shippingState: shippingInfo.state.trim(),
        shippingPincode: shippingInfo.pincode.trim(),
        notes: shippingInfo.notes?.trim() || '',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit || '100 GM',
          image: item.image || ''
        })),
        subtotalAmount: subtotal,
        deliveryFee: activeDeliveryFee,
        delivery_fee: activeDeliveryFee,
        totalAmount: activeGrandTotal,
        total_amount: activeGrandTotal,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      // 1. Sync Shipping Location to Cart Context
      updateShippingLocation({
        city: shippingInfo.city,
        state: shippingInfo.state,
        pincode: shippingInfo.pincode
      });

      // 2. Persist updated address to user profile if signed in
      if (currentUser && updateProfileData) {
        try {
          await updateProfileData({
            displayName: shippingInfo.customerName,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            pincode: shippingInfo.pincode
          });
        } catch (profErr) {
          console.warn('Silent profile sync notice:', profErr);
        }
      }

      // 3. Save to Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          const { error: sbError } = await supabase.from('orders').insert([{
            id: orderId,
            user_id: finalUid,
            customer_name: shippingInfo.customerName.trim(),
            customer_phone: shippingInfo.phone.trim(),
            customer_email: finalEmail,
            shipping_address: `${shippingInfo.address.trim()}, ${shippingInfo.city.trim()}, ${shippingInfo.state.trim()} - ${shippingInfo.pincode.trim()}`,
            items: orderData.items,
            total_amount: activeGrandTotal,
            delivery_fee: activeDeliveryFee,
            status: 'Confirmed',
            notes: shippingInfo.notes?.trim() || ''
          }]);

          if (sbError) {
            console.warn('Supabase order insert notice:', sbError.message);
          }
        } catch (sbErr) {
          console.warn('Supabase order error:', sbErr);
        }
      }

      // 4. Local Storage backup
      try {
        const localOrders = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
        localOrders.unshift(orderData);
        localStorage.setItem('krishi_local_orders', JSON.stringify(localOrders));
      } catch (storageErr) {
        console.warn('LocalStorage orders backup error:', storageErr);
      }

      // 5. Success state
      setOrderCompleted(orderData);
      clearCart();
      triggerConfetti();
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.message || 'Error processing order. Please check details and retry.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="bg-white text-neutral-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-neutral-900">
                {orderCompleted ? 'Order Confirmed!' : 'Express Checkout & Delivery'}
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                {orderCompleted ? 'Your order has been recorded successfully.' : 'Direct dispatch from Krishi Kutir Bhopal facility'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {orderCompleted ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Order #{orderCompleted.id} Placed!
              </span>
              <h3 className="text-2xl font-black uppercase text-neutral-900">
                Thank You, {orderCompleted.customerName}!
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                Your order has been recorded. Our team will pack and dispatch your order from the Bhopal facility.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">Order ID:</span>
                <span className="font-mono font-bold text-neutral-900">{orderCompleted.id}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">Recipient Phone:</span>
                <span className="font-bold text-neutral-800">{orderCompleted.customerPhone}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">Delivery Location:</span>
                <span className="font-bold text-neutral-800">{orderCompleted.shippingCity}, {orderCompleted.shippingState}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-neutral-900 pt-1">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-700">{formatPrice(orderCompleted.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const ordersElem = document.getElementById('my-orders-section');
                  if (ordersElem) {
                    ordersElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-700/20"
              >
                Track My Order
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
            
            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Delivery Details Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>1. Delivery & Contact Details</span>
                </h3>
                {!currentUser && (
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Have an account? Sign in
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={shippingInfo.customerName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="For order tracking updates"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Flat No, Building, Street, Landmark"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.pincode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block mb-1">
                    Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ring doorbell, morning dispatch"
                    value={shippingInfo.notes}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Courier Fee & Live Zone Card */}
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-700 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Shipping Zone: <strong className="text-neutral-900">{activeDeliveryInfo.zoneLabel}</strong></span>
              </div>
              <span className="font-mono font-bold text-neutral-900">
                {activeDeliveryFee === 0 ? (
                  <span className="text-emerald-700 uppercase font-black text-[11px]">Free Shipping</span>
                ) : (
                  formatPrice(activeDeliveryFee)
                )}
              </span>
            </div>

            {/* Order Cost Breakdown */}
            <div className="p-4 bg-neutral-50/70 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                <span className="font-mono font-bold text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Courier / Delivery:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {activeDeliveryFee === 0 ? '₹0.00 (Free)' : formatPrice(activeDeliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Grand Total:</span>
                <span className="font-mono text-emerald-700 text-base">{formatPrice(activeGrandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Recording Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Place Order ({formatPrice(activeGrandTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Direct Farm Dispatch
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Express Safe Packing
              </span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
