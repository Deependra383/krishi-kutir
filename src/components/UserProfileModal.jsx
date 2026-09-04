import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../supabase';
import { db, collection, query, where, getDocs, onSnapshot } from '../firebase';

export const UserProfileModal = ({ isOpen, onClose, onOpenAdmin, formatPrice }) => {
  const { currentUser, userProfile, updateProfileData, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit profile state
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.display_name || userProfile.displayName || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        pincode: userProfile.pincode || ''
      });
    }
  }, [userProfile]);

  // Listen to user orders from Supabase, Firestore, and strictly scoped local storage
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    const uid = String(currentUser.id || currentUser.uid || '').trim();
    const email = String(currentUser.email || '').trim().toLowerCase();

    const doesOrderBelongToUser = (order) => {
      if (!order) return false;
      const orderUid = String(order.userId || order.user_id || '').trim();
      if (uid && orderUid && orderUid !== 'guest' && orderUid === uid) return true;
      const orderEmail = String(
        order.userEmail || order.customerEmail || order.customer_email || order.email || ''
      ).trim().toLowerCase();
      if (email && orderEmail && orderEmail === email) return true;
      return false;
    };

    const fetchOrders = async () => {
      let combined = [];

      // 1. Check local storage, filtered strictly to this user
      try {
        const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
        if (Array.isArray(local)) {
          combined = local.filter(doesOrderBelongToUser);
        }
      } catch {
        combined = [];
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
                  totalAmount: o.total_amount,
                  paymentMethod: o.payment_method,
                  paymentId: o.payment_id,
                  status: o.status,
                  orderDate: o.order_date || o.created_at
                }))
                .filter(doesOrderBelongToUser);

              const existingIds = new Set(combined.map(o => o.id));
              formatted.forEach(item => {
                if (!existingIds.has(item.id)) {
                  combined.unshift(item);
                  existingIds.add(item.id);
                } else {
                  const idx = combined.findIndex(c => c.id === item.id);
                  if (idx !== -1) combined[idx] = item;
                }
              });
            }
          }
        } catch (err) {
          console.warn('Supabase user orders fetch notice:', err);
        }
      }

      // 3. Fetch from Firestore for user orders
      if (db) {
        try {
          const firestoreOrders = [];
          if (uid) {
            try {
              const qUid = query(collection(db, 'orders'), where('userId', '==', uid));
              const snap = await getDocs(qUid);
              snap.forEach(docSnap => firestoreOrders.push({ id: docSnap.id, ...docSnap.data() }));
            } catch (e) {
              console.warn('Firestore query by uid:', e);
            }
          }

          if (currentUser.email) {
            try {
              const qEmail = query(collection(db, 'orders'), where('userEmail', '==', currentUser.email));
              const snap = await getDocs(qEmail);
              snap.forEach(docSnap => firestoreOrders.push({ id: docSnap.id, ...docSnap.data() }));
            } catch (e) {
              console.warn('Firestore query by userEmail:', e);
            }
          }

          firestoreOrders.forEach(orderObj => {
            if (doesOrderBelongToUser(orderObj)) {
              const idx = combined.findIndex(c => c.id === orderObj.id);
              if (idx !== -1) {
                combined[idx] = { ...combined[idx], ...orderObj };
              } else {
                combined.unshift(orderObj);
              }
            }
          });
        } catch (fsErr) {
          console.warn('Firestore user orders fetch notice:', fsErr);
        }
      }

      // Strict final filter
      combined = combined.filter(doesOrderBelongToUser);

      // Sort by recent date
      combined.sort((a, b) => {
        const timeA = new Date(a.orderDate || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt) || 0).getTime();
        const timeB = new Date(b.orderDate || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt) || 0).getTime();
        return timeB - timeA;
      });

      setOrders(combined);
      setLoadingOrders(false);
    };

    fetchOrders();

    // Supabase realtime channel for user orders
    let channel = null;
    try {
      if (isSupabaseConfigured && supabase) {
        channel = supabase
          .channel(`user-orders-${uid}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
          .subscribe();
      }
    } catch {
      // ignore
    }

    return () => {
      if (channel && supabase) supabase.removeChannel(channel);
    };
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfileData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Verification':
      case 'Placed':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
      case 'Processing':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      case 'Dispatched':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
      case 'Delivered':
        return 'bg-teal-100 text-teal-900 border-teal-300 font-bold';
      case 'Cancelled':
        return 'bg-red-100 text-red-900 border-red-300 font-bold';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-neutral-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 relative flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl uppercase">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'K'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black uppercase text-white tracking-wide">
                  {userProfile?.displayName || currentUser?.displayName || 'Krishi Customer'}
                </h2>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-neutral-400 text-xs flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3 h-3 text-neutral-500" />
                {currentUser?.email || 'Guest User'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                id="open-admin-from-profile"
                onClick={() => {
                  onClose();
                  if (onOpenAdmin) onOpenAdmin();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm hidden sm:inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Store Admin
              </button>
            )}

            <button
              id="user-signout-btn"
              onClick={async () => {
                await logout();
                onClose();
              }}
              title="Sign Out"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              id="close-profile-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-2">
          <button
            id="tab-view-orders"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Package className="w-4 h-4" />
            My Orders ({orders.length})
          </button>
          <button
            id="tab-view-profile"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <User className="w-4 h-4" />
            Delivery Profile & Address
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {activeTab === 'orders' ? (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="py-12 text-center text-neutral-400 text-xs font-semibold">
                  Loading your orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <Package className="w-8 h-8 opacity-70" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-800">No Orders Placed Yet</h3>
                  <p className="text-neutral-500 text-xs max-w-sm mx-auto">
                    Explore our catalogue of live microgreens, organic seeds, and superfood powders to place your first order.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div 
                    key={order.id}
                    className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-emerald-300 transition-all shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-neutral-900">Order #{order.id}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status || 'Placed'}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          {order.createdAt?.seconds 
                            ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                            : (order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Recent Order')}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-400 uppercase font-bold block">Total Amount</span>
                        <span className="text-sm font-black text-emerald-800">
                          {formatPrice ? formatPrice(order.totalAmount || 0) : `₹${order.totalAmount}`}
                        </span>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="space-y-1.5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-neutral-700">
                          <span className="font-medium">{item.name} <span className="text-neutral-400 font-bold">× {item.quantity}</span></span>
                          <span className="font-bold">{formatPrice ? formatPrice((item.price || 0) * (item.quantity || 1)) : `₹${(item.price || 0) * (item.quantity || 1)}`}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Details */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dashed border-neutral-200 text-[11px] text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Paid via: <strong className="text-neutral-800 uppercase">{order.paymentMethod || 'Razorpay'}</strong></span>
                        {order.paymentId && <span className="font-mono text-[10px] text-neutral-400">({order.paymentId})</span>}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="truncate max-w-[200px]">{order.city || order.address || 'Standard Delivery'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Your profile and delivery address have been updated!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(p => ({ ...p, displayName: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    placeholder="Customer Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Delivery Street Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  placeholder="Flat / House No., Street, Landmark"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    placeholder="e.g. Pune"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(p => ({ ...p, state: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    placeholder="e.g. Maharashtra"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData(p => ({ ...p, pincode: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    placeholder="411001"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving Changes...' : 'Update Delivery Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
