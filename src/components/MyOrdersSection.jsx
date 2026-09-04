import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  RefreshCw, 
  MapPin, 
  Phone, 
  CreditCard, 
  Printer, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShoppingBag,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, doc, getDoc, collection, query, where, getDocs, onSnapshot } from '../firebase';
import { supabase, isSupabaseConfigured } from '../supabase';

export const MyOrdersSection = ({ activeTheme, formatPrice, onOpenAuth, onOpenCart }) => {
  const { currentUser } = useAuth();

  // Search / Lookup input
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Orders list for current user / local storage
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Status Filter
  const [filterStatus, setFilterStatus] = useState('All');

  // Helper to strictly verify if an order belongs to the current logged-in user
  const doesOrderBelongToCurrentUser = (order) => {
    if (!currentUser || !order) return false;
    const currentUid = String(currentUser.uid || currentUser.id || '').trim();
    const currentEmail = String(currentUser.email || '').trim().toLowerCase();

    // Check by user ID (must match and not be empty or placeholder 'guest')
    const orderUid = String(order.userId || order.user_id || '').trim();
    if (currentUid && orderUid && orderUid !== 'guest' && orderUid === currentUid) {
      return true;
    }

    // Check by email (case-insensitive, exclude default/generic guest emails)
    const orderEmail = String(
      order.userEmail || order.customerEmail || order.customer_email || order.email || ''
    ).trim().toLowerCase();

    if (
      currentEmail &&
      orderEmail &&
      orderEmail !== 'guest@krishikutir.com' &&
      currentEmail !== 'guest@krishikutir.com' &&
      orderEmail === currentEmail
    ) {
      return true;
    }

    return false;
  };

  // Load orders strictly for the current user ID / email
  const fetchUserOrders = async () => {
    setLoading(true);
    let combined = [];

    // GUEST FLOW: If user is not logged in, only show orders placed in the current guest session
    if (!currentUser) {
      try {
        const guestOrderIds = JSON.parse(sessionStorage.getItem('krishi_guest_order_ids') || '[]');
        const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
        if (Array.isArray(local) && Array.isArray(guestOrderIds) && guestOrderIds.length > 0) {
          combined = local.filter(o => guestOrderIds.includes(o.id));
        } else {
          combined = [];
        }
      } catch (e) {
        console.warn('Local storage orders error:', e);
        combined = [];
      }

      setOrders(combined);
      if (combined.length > 0 && !expandedOrderId) {
        setExpandedOrderId(combined[0].id);
      }
      setLoading(false);
      return;
    }

    // LOGGED-IN FLOW: Current user is authenticated
    const uid = String(currentUser.uid || currentUser.id || '').trim();
    const email = String(currentUser.email || '').trim().toLowerCase();

    // 1. Get from Local Storage, strictly filtering ONLY this user's orders
    try {
      const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
      if (Array.isArray(local)) {
        combined = local.filter(doesOrderBelongToCurrentUser);
      }
    } catch (e) {
      console.warn('Local storage orders filter error:', e);
    }

    // 2. Fetch from Supabase (if configured)
    if (isSupabaseConfigured && supabase) {
      try {
        const conditions = [];
        if (uid) conditions.push(`user_id.eq.${uid}`);
        if (email) conditions.push(`customer_email.eq.${email}`);
        if (currentUser.email && currentUser.email !== email) {
          conditions.push(`customer_email.eq.${currentUser.email}`);
        }

        if (conditions.length > 0) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .or(conditions.join(','))
            .order('created_at', { ascending: false });

          if (!error && data) {
            const formatted = data
              .map(o => ({
                id: o.id,
                userId: o.user_id,
                customerName: o.customer_name,
                customerEmail: o.customer_email,
                userEmail: o.customer_email,
                phone: o.customer_phone,
                address: o.shipping_address?.address || '',
                city: o.shipping_address?.city || '',
                state: o.shipping_address?.state || '',
                pincode: o.shipping_address?.pincode || '',
                items: o.items || [],
                subtotal: o.subtotal || o.total_amount,
                deliveryFee: o.delivery_fee || 0,
                totalAmount: o.total_amount,
                paymentMethod: o.payment_method,
                paymentId: o.payment_id,
                status: o.status,
                orderDate: o.order_date || o.created_at
              }))
              .filter(doesOrderBelongToCurrentUser);

            const existingIds = new Set(combined.map(o => o.id));
            formatted.forEach(item => {
              if (!existingIds.has(item.id)) {
                combined.unshift(item);
                existingIds.add(item.id);
              } else {
                const index = combined.findIndex(c => c.id === item.id);
                if (index !== -1) combined[index] = item;
              }
            });
          }
        }
      } catch (sbErr) {
        console.warn('Supabase fetch error:', sbErr);
      }
    }

    // 3. Check Firestore for user orders (by userId and by userEmail)
    if (db) {
      try {
        const firestoreOrdersMap = new Map();

        // 3a. Query by userId
        if (uid) {
          try {
            const qUid = query(
              collection(db, 'orders'),
              where('userId', '==', uid)
            );
            const snapUid = await getDocs(qUid);
            snapUid.forEach(docSnap => {
              firestoreOrdersMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
            });
          } catch (e1) {
            console.warn('Firestore query by userId notice:', e1);
          }
        }

        // 3b. Query by userEmail (exact match)
        if (currentUser.email) {
          try {
            const qEmail1 = query(
              collection(db, 'orders'),
              where('userEmail', '==', currentUser.email)
            );
            const snapEmail1 = await getDocs(qEmail1);
            snapEmail1.forEach(docSnap => {
              firestoreOrdersMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
            });
          } catch (e2) {
            console.warn('Firestore query by userEmail notice:', e2);
          }

          // Also check lowercase email if different
          if (email !== currentUser.email) {
            try {
              const qEmail2 = query(
                collection(db, 'orders'),
                where('userEmail', '==', email)
              );
              const snapEmail2 = await getDocs(qEmail2);
              snapEmail2.forEach(docSnap => {
                firestoreOrdersMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
              });
            } catch (e3) {
              console.warn('Firestore query by lowercase email notice:', e3);
            }
          }
        }

        // 3c. Query by customerEmail
        if (currentUser.email) {
          try {
            const qCust = query(
              collection(db, 'orders'),
              where('customerEmail', '==', currentUser.email)
            );
            const snapCust = await getDocs(qCust);
            snapCust.forEach(docSnap => {
              firestoreOrdersMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
            });
          } catch (e4) {
            // customerEmail might not be indexed, safe to ignore
          }
        }

        // Merge Firestore orders with strict ownership verification
        firestoreOrdersMap.forEach((orderObj) => {
          if (doesOrderBelongToCurrentUser(orderObj)) {
            const index = combined.findIndex(c => c.id === orderObj.id);
            if (index !== -1) {
              combined[index] = { ...combined[index], ...orderObj };
            } else {
              combined.unshift(orderObj);
            }
          }
        });
      } catch (fsErr) {
        console.warn('Firestore user orders notice:', fsErr);
      }
    }

    // FINAL STRICT FILTER: Never allow any foreign order from previous accounts or guests to remain
    combined = combined.filter(doesOrderBelongToCurrentUser);

    // Sort by most recent
    combined.sort((a, b) => {
      const timeA = new Date(a.orderDate || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt) || 0).getTime();
      const timeB = new Date(b.orderDate || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt) || 0).getTime();
      return timeB - timeA;
    });

    setOrders(combined);
    if (combined.length > 0 && !expandedOrderId) {
      setExpandedOrderId(combined[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserOrders();
  }, [currentUser]);

  // Handle direct Order Tracking Search (by Order ID, Phone, or Email)
  const handleSearchOrder = async (e) => {
    e.preventDefault();
    const queryTerm = searchQuery.trim();
    if (!queryTerm) return;

    setSearching(true);
    setSearchError('');
    setSearchedOrder(null);

    // 1. Search in memory / local list first
    const matchedLocal = orders.find(
      o => o.id?.toLowerCase() === queryTerm.toLowerCase() ||
           o.phone?.includes(queryTerm) ||
           o.customerEmail?.toLowerCase() === queryTerm.toLowerCase() ||
           o.userEmail?.toLowerCase() === queryTerm.toLowerCase()
    );

    if (matchedLocal) {
      setSearchedOrder(matchedLocal);
      setExpandedOrderId(matchedLocal.id);
      setSearching(false);
      return;
    }

    // 2. Search Firestore by Document ID
    try {
      if (db) {
        const docRef = doc(db, 'orders', queryTerm.toUpperCase());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const found = { id: docSnap.id, ...docSnap.data() };
          setSearchedOrder(found);
          setExpandedOrderId(found.id);
          setSearching(false);
          return;
        }
      }
    } catch (fsErr) {
      console.warn('Firestore search notice:', fsErr);
    }

    // 3. Search Supabase by ID, phone or email
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`id.ilike.%${queryTerm}%,customer_phone.ilike.%${queryTerm}%,customer_email.ilike.%${queryTerm}%`)
          .limit(1);

        if (!error && data && data.length > 0) {
          const o = data[0];
          const found = {
            id: o.id,
            userId: o.user_id,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            phone: o.customer_phone,
            address: o.shipping_address?.address || '',
            city: o.shipping_address?.city || '',
            state: o.shipping_address?.state || '',
            pincode: o.shipping_address?.pincode || '',
            items: o.items || [],
            totalAmount: o.total_amount,
            paymentMethod: o.payment_method,
            paymentId: o.payment_id,
            status: o.status,
            orderDate: o.order_date || o.created_at
          };
          setSearchedOrder(found);
          setExpandedOrderId(found.id);
          setSearching(false);
          return;
        }
      } catch (sbErr) {
        console.warn('Supabase search notice:', sbErr);
      }
    }

    setSearchError(`No order found matching "${queryTerm}". Please verify your Order ID (e.g. KK-123456) or phone number.`);
    setSearching(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Verification':
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Awaiting Admin Confirmation
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Payment Verified & Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            Harvesting & Packing
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            Dispatched (In Transit)
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-900 border border-teal-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-900 border border-red-300">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-300">
            {status || 'Recorded'}
          </span>
        );
    }
  };

  const renderProgressStepper = (status) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', desc: 'Received in system' },
      { key: 'confirmed', label: 'Payment Verified', desc: 'Confirmed by Admin' },
      { key: 'processing', label: 'Harvest & Pack', desc: 'Freshly prepped' },
      { key: 'dispatched', label: 'Dispatched', desc: 'Cold chain transit' },
      { key: 'delivered', label: 'Delivered', desc: 'At your doorstep' }
    ];

    let currentStepIdx = 0;
    if (status === 'Confirmed') currentStepIdx = 1;
    else if (status === 'Processing') currentStepIdx = 2;
    else if (status === 'Dispatched') currentStepIdx = 3;
    else if (status === 'Delivered') currentStepIdx = 4;
    else if (status === 'Cancelled') currentStepIdx = -1;

    if (currentStepIdx === -1) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>This order was cancelled. If you have already transferred funds, our support team will initiate an instant refund.</span>
        </div>
      );
    }

    return (
      <div className="py-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div 
                key={step.key}
                className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isCurrent 
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs' 
                    : isCompleted 
                    ? 'bg-neutral-50 border-emerald-200 text-emerald-900' 
                    : 'bg-white border-neutral-200 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-tight block text-neutral-900">
                    {step.label}
                  </span>
                  <span className="text-[10px] text-neutral-500 leading-tight block mt-0.5">
                    {step.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const filteredOrdersList = orders.filter(o => {
    if (filterStatus === 'All') return true;
    const s = o.status || 'Pending Verification';
    if (filterStatus === 'Pending') return s === 'Pending Verification' || s === 'Placed';
    if (filterStatus === 'Confirmed') return s === 'Confirmed';
    if (filterStatus === 'Dispatched') return s === 'Dispatched' || s === 'Processing';
    if (filterStatus === 'Delivered') return s === 'Delivered';
    return true;
  });

  return (
    <section id="my-orders-section" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto font-sans scroll-mt-20">
      
      {/* Section Header - Clean Light Theme */}
      <div className="bg-white text-neutral-900 p-6 sm:p-10 rounded-3xl shadow-sm border border-neutral-200/90 relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#2d6a4f] border border-emerald-200 text-xs font-black uppercase tracking-widest">
              <Package className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Real-Time Order Tracking & History</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
              My Orders & Live Harvest Tracking
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm max-w-xl leading-relaxed">
              Track the live verification and packing status of your microgreens, herbal superfoods, and seed orders.
            </p>

            {/* Account scope indicator */}
            <div className="pt-2 flex items-center gap-2">
              {currentUser ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[#2d6a4f] text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
                  <span>Logged in as: <strong className="text-neutral-900 font-bold">{currentUser.email || currentUser.displayName || 'User'}</strong> (Only your orders are displayed)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Browsing as Guest • Sign in to access your personal order history</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!currentUser && (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Sign In For Saved Orders
              </button>
            )}
          </div>
        </div>

        {/* Quick Order Lookup Search Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Track by Order ID (e.g. KK-892143), Phone Number, or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-[#2d6a4f] font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchedOrder(null); setSearchError(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={searching || !searchQuery.trim()}
              className="px-6 py-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {searching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {searchError && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Orders Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All Orders', value: 'All', count: orders.length },
            { label: 'Pending Verification', value: 'Pending', count: orders.filter(o => (o.status || 'Pending Verification') === 'Pending Verification' || o.status === 'Placed').length },
            { label: 'Confirmed', value: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length },
            { label: 'In Transit', value: 'Dispatched', count: orders.filter(o => o.status === 'Dispatched' || o.status === 'Processing').length },
            { label: 'Delivered', value: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === tab.value
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterStatus === tab.value ? 'bg-neutral-800 text-amber-400' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-neutral-500 font-bold px-2">
          {filteredOrdersList.length} order{filteredOrdersList.length === 1 ? '' : 's'} found
        </span>
      </div>

      {/* Orders Stream / Empty State */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Loading your order history...</p>
        </div>
      ) : filteredOrdersList.length === 0 ? (
        <div className="py-16 px-6 text-center bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-neutral-900">
              {currentUser 
                ? (orders.length === 0 ? 'No Orders Found For Your Account' : `No Orders in "${filterStatus}"`)
                : 'Sign In To View Your Orders'
              }
            </h3>
            <p className="text-neutral-500 text-xs mt-1 max-w-md mx-auto leading-relaxed">
              {currentUser ? (
                orders.length === 0 
                  ? `You haven't placed any orders with ${currentUser.email || 'your account'} yet. Only orders placed under your account ID are shown here.`
                  : `You have ${orders.length} order(s) under this account, but none match the "${filterStatus}" status filter.`
              ) : (
                'You are currently browsing as a guest. Sign in with your account to access your personal order history, or search your Order ID above.'
              )}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap gap-3 justify-center">
            <a
              href="#microgreens-section"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Explore Fresh Harvests
            </a>
            {!currentUser ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Sign In To View Orders
              </button>
            ) : orders.length > 0 && filterStatus !== 'All' ? (
              <button
                onClick={() => setFilterStatus('All')}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                View All {orders.length} Orders
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrdersList.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const isPending = (order.status || 'Pending Verification') === 'Pending Verification' || order.status === 'Placed';

            return (
              <div 
                key={order.id}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md ${
                  isPending ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-neutral-200'
                }`}
              >
                {/* Order Summary Header Bar */}
                <div 
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-5 sm:p-6 cursor-pointer hover:bg-neutral-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 select-none border-b border-neutral-100"
                >
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-base font-black font-mono text-neutral-900">
                          #{order.id}
                        </span>
                        {getStatusBadge(order.status || 'Pending Verification')}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span>
                          📅 {order.orderDate 
                              ? new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                              : 'Recent Order'}
                        </span>
                        <span>•</span>
                        <span>{order.items?.length || 0} item{(order.items?.length || 0) === 1 ? '' : 's'}</span>
                        <span>•</span>
                        <span className="font-bold text-neutral-700">{order.customerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block">Total Amount</span>
                      <span className="text-lg font-black text-emerald-700 font-sans">
                        {formatPrice ? formatPrice(order.totalAmount || 0) : `₹${order.totalAmount}`}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-6 sm:p-8 bg-neutral-50/50 space-y-6 animate-fadeIn">
                    
                    {/* Live Progress Flow */}
                    <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                          Live Order Progression
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          Updated in real-time
                        </span>
                      </div>
                      {renderProgressStepper(order.status || 'Pending Verification')}
                    </div>

                    {/* Pending Verification Notice */}
                    {isPending && (
                      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-black uppercase text-amber-900">Payment Verification in Progress</h4>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Our team is matching your payment reference / UTR with our bank deposit. Once confirmed by the admin dashboard, your order status will automatically update to <strong>Confirmed</strong>.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Line Items Breakdown */}
                    <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">
                        Ordered Items
                      </span>
                      <div className="divide-y divide-neutral-100">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="py-3 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-neutral-900 text-sm block">{item.name}</span>
                              <span className="text-neutral-500 text-[11px]">
                                Quantity: <strong className="text-emerald-700">{item.quantity}</strong> {item.unit ? `(${item.unit})` : ''}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-neutral-900 text-sm">
                              {formatPrice ? formatPrice((item.price || 0) * (item.quantity || 1)) : `₹${(item.price || 0) * (item.quantity || 1)}`}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Financial Totals */}
                      <div className="pt-3 border-t border-neutral-200 space-y-1.5 text-xs">
                        <div className="flex justify-between text-neutral-600">
                          <span>Subtotal</span>
                          <span className="font-mono font-bold">{formatPrice ? formatPrice(order.subtotal || order.totalAmount) : `₹${order.subtotal || order.totalAmount}`}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Shipping & Cold-Chain Delivery</span>
                          <span className="text-emerald-700 font-bold">FREE (₹0)</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-dashed border-neutral-200">
                          <span>Grand Total</span>
                          <span className="text-emerald-700 text-base">{formatPrice ? formatPrice(order.totalAmount) : `₹${order.totalAmount}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping & Payment Meta Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Shipping Address */}
                      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-100 pb-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span>Delivery Address</span>
                        </div>
                        <p className="font-bold text-neutral-800 text-sm">{order.customerName}</p>
                        <p className="text-neutral-600">{order.address}</p>
                        <p className="text-neutral-600">{order.city}, {order.state || 'India'} - {order.pincode}</p>
                        {order.phone && (
                          <p className="text-emerald-700 font-mono font-bold pt-1 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> {order.phone}
                          </p>
                        )}
                      </div>

                      {/* Payment Information */}
                      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-100 pb-2">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span>Payment Information</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-neutral-500">Mode:</span>
                          <span className="font-bold text-neutral-900">{order.paymentMethod}</span>
                        </div>
                        {order.paymentId && (
                          <div className="flex justify-between py-1">
                            <span className="text-neutral-500">Reference / UTR:</span>
                            <span className="font-mono font-bold text-emerald-700">{order.paymentId}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-1">
                          <span className="text-neutral-500">Status:</span>
                          <span className="font-bold text-neutral-900">{order.status || 'Pending Verification'}</span>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Actions: Print Receipt & Support */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>FSSAI Certified Organic Supply • Contact us for shipment assistance</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print Receipt
                        </button>
                        
                        <a
                          href="https://wa.me/919009166101"
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Help on WhatsApp
                        </a>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
