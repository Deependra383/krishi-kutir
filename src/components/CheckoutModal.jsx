import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  Copy, 
  Building2, 
  Smartphone, 
  Banknote,
  Clock,
  Printer,
  Lock,
  ExternalLink,
  Check,
  Zap,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db, doc, setDoc, serverTimestamp } from '../firebase';
import { supabase, isSupabaseConfigured } from '../supabase';
import { openRazorpayCheckout, getRazorpayKeyId, isLiveMode, isCustomKeyConfigured } from '../utils/razorpay';
import { getMerchantUpiId, getMerchantName, generateUpiUri, generateUpiQrUrl } from '../utils/upi';
import { RazorpayTestModal } from './RazorpayTestModal';

export const CheckoutModal = ({ isOpen, onClose, formatPrice, onOpenAuth }) => {
  const { currentUser, userProfile, updateProfileData } = useAuth();
  const { cartItems, subtotal, deliveryFee, grandTotal, clearCart } = useCart();

  // Form State
  const [shippingInfo, setShippingInfo] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Options: 'direct_upi' | 'razorpay_gateway' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('direct_upi');
  const [upiUtrNumber, setUpiUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(null);
  const [error, setError] = useState('');
  const [showTestGateway, setShowTestGateway] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState('');

  const merchantUpi = getMerchantUpiId();
  const merchantName = getMerchantName();

  // Prepopulate with user profile
  useEffect(() => {
    if (userProfile || currentUser) {
      setShippingInfo({
        customerName: userProfile?.displayName || currentUser?.displayName || '',
        email: userProfile?.email || currentUser?.email || '',
        phone: userProfile?.phone || '',
        address: userProfile?.address || '',
        city: userProfile?.city || 'Pune',
        state: userProfile?.state || 'Maharashtra',
        pincode: userProfile?.pincode || '411001'
      });
    }
  }, [userProfile, currentUser]);

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

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const saveFinalOrder = async ({ orderId, paymentId, paymentMethodName, signature }) => {
    setProcessing(true);
    try {
      const finalEmail = (shippingInfo.email || currentUser?.email || 'guest@krishikutir.com').trim();
      const finalUid = currentUser?.uid || currentUser?.id || 'guest';

      const orderData = {
        id: orderId,
        userId: finalUid,
        user_id: finalUid,
        userEmail: finalEmail,
        customerEmail: finalEmail,
        customerName: shippingInfo.customerName,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        pincode: shippingInfo.pincode,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category || '',
          unit: item.unit || item.moq || ''
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        totalAmount: grandTotal,
        paymentMethod: paymentMethodName,
        paymentId: paymentId,
        signature: signature || null,
        status: 'Pending Verification',
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      // 1. Save to Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('orders').insert([{
            id: orderId,
            user_id: finalUid,
            customer_name: shippingInfo.customerName,
            customer_email: finalEmail,
            customer_phone: shippingInfo.phone,
            shipping_address: {
              address: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              pincode: shippingInfo.pincode
            },
            items: orderData.items,
            total_amount: grandTotal,
            currency: 'INR',
            payment_method: orderData.paymentMethod,
            payment_id: paymentId,
            status: 'Pending Verification',
            order_date: orderData.orderDate
          }]);
        } catch (sbOrderErr) {
          console.warn('Supabase order insert notice:', sbOrderErr);
        }
      }

      // 2. Save to Firestore
      try {
        if (db) {
          const orderRef = doc(db, 'orders', orderId);
          await setDoc(orderRef, {
            ...orderData,
            createdAt: serverTimestamp()
          });
        }
      } catch (firestoreErr) {
        console.warn('Firestore write notice, saving locally:', firestoreErr);
      }

      // 3. Save to local storage history
      try {
        const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
        local.unshift(orderData);
        localStorage.setItem('krishi_local_orders', JSON.stringify(local));
      } catch (storageErr) {
        console.warn('LocalStorage save error:', storageErr);
      }

      // 3b. If placed as guest, track in session guest list
      if (!currentUser) {
        try {
          const guestList = JSON.parse(sessionStorage.getItem('krishi_guest_order_ids') || '[]');
          if (!guestList.includes(orderId)) {
            guestList.unshift(orderId);
            sessionStorage.setItem('krishi_guest_order_ids', JSON.stringify(guestList));
          }
        } catch {}
      }

      // 4. Update user profile address for future 1-click checkout
      if (currentUser && updateProfileData) {
        updateProfileData({
          displayName: shippingInfo.customerName,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode
        }).catch(() => {});
      }

      // 5. Complete order
      clearCart();
      setOrderCompleted(orderData);
      triggerConfetti();
    } catch (err) {
      console.error('Order finalization error:', err);
      setError(err.message || 'Payment confirmation error. Please check your order history.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!shippingInfo.customerName || !shippingInfo.phone || !shippingInfo.address) {
      setError('Please provide full recipient name, contact phone, and delivery address.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    const orderId = `KK-${Math.floor(100000 + Math.random() * 900000)}`;
    setActiveOrderId(orderId);

    // Direct UPI Flow
    if (paymentMethod === 'direct_upi') {
      const paymentRef = upiUtrNumber.trim() 
        ? `UPI-UTR-${upiUtrNumber.trim()}` 
        : `UPI-APP-${Date.now().toString().slice(-6)}`;

      await saveFinalOrder({
        orderId,
        paymentId: paymentRef,
        paymentMethodName: `Direct UPI (${merchantUpi})`
      });
      return;
    }

    // Cash on Delivery Flow
    if (paymentMethod === 'cod') {
      const paymentId = `COD-${Date.now().toString().slice(-6)}`;
      await saveFinalOrder({
        orderId,
        paymentId,
        paymentMethodName: 'Cash on Delivery'
      });
      return;
    }

    // Razorpay Online Gateway Flow
    setProcessing(true);

    try {
      const openedOfficial = await openRazorpayCheckout({
        amountInRupees: grandTotal,
        orderId: orderId,
        customerName: shippingInfo.customerName,
        email: shippingInfo.email || currentUser?.email || 'customer@krishikutir.com',
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        pincode: shippingInfo.pincode,
        paymentMethodPrefill: 'upi',
        onSuccess: (res) => {
          saveFinalOrder({
            orderId: orderId,
            paymentId: res.paymentId,
            paymentMethodName: 'Razorpay Payment Gateway',
            signature: res.signature
          });
        },
        onFailure: (errMsg) => {
          setProcessing(false);
          setError(errMsg || 'Razorpay payment was not completed.');
        },
        onDismiss: () => {
          setProcessing(false);
        }
      });

      if (!openedOfficial) {
        // Fallback test sandbox modal
        setProcessing(false);
        setShowTestGateway(true);
      }
    } catch (err) {
      console.warn('Razorpay checkout launcher note:', err);
      setProcessing(false);
      setShowTestGateway(true);
    }
  };

  const currentUpiUri = generateUpiUri({
    upiId: merchantUpi,
    merchantName: merchantName,
    amountInRupees: grandTotal,
    orderId: activeOrderId || 'KK-CHECKOUT'
  });

  const currentQrUrl = generateUpiQrUrl({
    upiId: merchantUpi,
    merchantName: merchantName,
    amountInRupees: grandTotal,
    orderId: activeOrderId || 'KK-CHECKOUT',
    size: 240
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="bg-white text-neutral-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden relative my-8">
        
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 relative flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Instant Direct Payments
                </span>
                <span className="text-[9px] uppercase font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                  0% Gateway Fee
                </span>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white mt-1">
                {orderCompleted ? 'Order Submitted' : 'Complete Your Purchase'}
              </h2>
            </div>
          </div>

          <button
            id="close-checkout-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {orderCompleted ? (
          /* Order Submitted / Awaiting Admin Verification View */
          <div className="p-6 md:p-8 space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 border border-amber-300 mx-auto flex items-center justify-center">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-black uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                Awaiting Admin Confirmation
              </div>
              <h3 className="text-2xl font-black uppercase text-neutral-900">Order Placed Successfully!</h3>
              <p className="text-neutral-600 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
                Your order has been recorded. The admin will verify the payment received and confirm your order from the <strong>Admin Dashboard</strong>, after which it will be packed and dispatched.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2.5">
                <span className="text-neutral-500">Order Reference:</span>
                <span className="font-bold text-neutral-900 text-sm">{orderCompleted.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Order Status:</span>
                <span className="font-sans px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                  {orderCompleted.status || 'Pending Verification'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Payment Reference / UTR:</span>
                <span className="font-bold text-emerald-700">{orderCompleted.paymentId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Payment Mode:</span>
                <span className="font-bold text-neutral-800">{orderCompleted.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Delivery Recipient:</span>
                <span className="font-bold text-neutral-800">{orderCompleted.customerName} ({orderCompleted.phone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Shipping Address:</span>
                <span className="font-bold text-neutral-800 text-right truncate max-w-[240px]">
                  {orderCompleted.address}, {orderCompleted.city}, {orderCompleted.pincode}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-neutral-200 pt-2.5 font-sans">
                <span className="font-bold text-neutral-800 text-sm">Total Payable:</span>
                <span className="font-black text-emerald-800 text-base">{formatPrice(orderCompleted.totalAmount)}</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 text-left flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Next Step:</strong> You can check real-time confirmation status in <strong>My Profile &rarr; My Orders</strong>. Store admins can verify payments directly in the Admin Panel.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 font-sans">
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    const el = document.getElementById('my-orders-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Package className="w-4 h-4" /> Track in My Orders
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Summary
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
            
            {/* Guest vs User notice */}
            {!currentUser && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Already have an account with saved addresses?</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer uppercase text-[11px]"
                >
                  Sign In
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* 1. Shipping Address Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">1. Delivery Address</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={shippingInfo.customerName}
                    onChange={(e) => setShippingInfo(p => ({ ...p, customerName: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Street Address / House No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat / Floor, Building Name, Street"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo(p => ({ ...p, address: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Pune, Delhi"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="411001"
                    value={shippingInfo.pincode}
                    onChange={(e) => setShippingInfo(p => ({ ...p, pincode: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">2. Select Payment Method</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* 1. Direct UPI / QR Code */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('direct_upi')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'direct_upi'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Instant 0% Fee
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-black uppercase text-neutral-900 block">Direct UPI & QR</span>
                    <span className="text-[10px] text-neutral-500">Scan QR or Launch GPay / PhonePe</span>
                  </div>
                </button>

                {/* 2. Razorpay Gateway */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay_gateway')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'razorpay_gateway'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                      Cards / NetBanking
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-black uppercase text-neutral-900 block">Razorpay Gateway</span>
                    <span className="text-[10px] text-neutral-500">Visa, MasterCard, RuPay & Banks</span>
                  </div>
                </button>

                {/* 3. Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      Pay on Arrival
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-black uppercase text-neutral-900 block">Cash on Delivery</span>
                    <span className="text-[10px] text-neutral-500">Cash / UPI to delivery agent</span>
                  </div>
                </button>
              </div>

              {/* Direct UPI Scan & Pay Interactive Box */}
              {paymentMethod === 'direct_upi' && (
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                    
                    {/* Dynamic QR Code */}
                    <div className="shrink-0 p-2 bg-white rounded-xl border border-neutral-200 shadow-xs text-center">
                      <img
                        src={currentQrUrl}
                        alt="Dynamic UPI Payment QR"
                        className="w-32 h-32 rounded-lg"
                      />
                      <span className="text-[9px] font-bold text-neutral-400 uppercase mt-1 block">Scan With Any App</span>
                    </div>

                    {/* App Links & Instructions */}
                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                          Scan to Pay {formatPrice(grandTotal)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
                        <span className="text-[11px] font-mono text-neutral-700 font-bold">{merchantUpi}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2 py-0.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                        >
                          {copiedUpi ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* 1-Click Launch on Mobile */}
                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                          Or tap to open on your phone:
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                          <a
                            href={currentUpiUri}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Pay in UPI App</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction UTR Reference Input */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase text-neutral-700">
                      Enter 12-Digit UPI Reference Number / UTR (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="e.g. 429108392182 (Found in GPay/PhonePe receipt)"
                      value={upiUtrNumber}
                      onChange={(e) => setUpiUtrNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                    <span className="text-[10px] text-neutral-500 block">
                      Once paid, entering your reference number helps our team dispatch your order faster.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary & Submit Button */}
            <div className="p-4 bg-neutral-900 text-white rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs text-neutral-300">
                <span>{cartItems.length} items in bag</span>
                <span>Subtotal: {formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-neutral-300">
                <span>Shipping Fee</span>
                <span className="text-emerald-400 font-bold">{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-black text-white pt-2 border-t border-neutral-800">
                <span>Total Payable</span>
                <span className="text-emerald-400 text-lg">{formatPrice(grandTotal)}</span>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {processing ? 'Submitting Order for Verification...' : (
                  <>
                    <span>
                      {paymentMethod === 'direct_upi' 
                        ? `Submit Order & Verify Payment (${formatPrice(grandTotal)})` 
                        : paymentMethod === 'cod'
                        ? `Place Order (Pending Confirmation) (${formatPrice(grandTotal)})`
                        : `Pay & Submit Order (${formatPrice(grandTotal)})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Secure Checkout & Krishi Kutir Organic Quality Guarantee</span>
              </div>
            </div>

          </form>
        )}

      </div>

      {/* Razorpay Test Modal Sandbox */}
      <RazorpayTestModal
        isOpen={showTestGateway}
        onClose={() => setShowTestGateway(false)}
        amountInRupees={grandTotal}
        orderId={activeOrderId}
        customerName={shippingInfo.customerName}
        phone={shippingInfo.phone}
        email={shippingInfo.email || currentUser?.email || 'customer@krishikutir.com'}
        selectedMethod="upi"
        onSuccess={(res) => {
          saveFinalOrder({
            orderId: res.orderId || activeOrderId,
            paymentId: res.paymentId,
            paymentMethodName: 'Razorpay Payment Gateway',
            signature: res.signature
          });
        }}
        onFailure={(errMsg) => {
          setError(errMsg || 'Payment was unsuccessful.');
        }}
      />
    </div>
  );
};
