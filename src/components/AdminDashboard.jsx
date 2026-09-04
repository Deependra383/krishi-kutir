import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db, collection, onSnapshot, doc, updateDoc, serverTimestamp } from '../firebase';
import { supabase, isSupabaseConfigured } from '../supabase';
import { AdminHeader } from './admin/AdminHeader';
import { AdminKpiBar } from './admin/AdminKpiBar';
import { ProductsTab } from './admin/ProductsTab';
import { ProductFormModal } from './admin/ProductFormModal';
import { OrdersTab } from './admin/OrdersTab';
import { PartnerInquiriesTab } from './admin/PartnerInquiriesTab';
import { TrainingInquiriesTab } from './admin/TrainingInquiriesTab';
import { UsersTab } from './admin/UsersTab';
import { StoreSettingsTab } from './admin/StoreSettingsTab';

export const AdminDashboard = ({ onBackToStore, formatPrice }) => {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaultCatalog } = useProducts();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'partners' | 'training' | 'users' | 'settings'

  // Admin Theme Mode: connected to global useTheme
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleToggleDarkMode = () => {
    toggleDarkMode();
  };

  // Search & Filter for Products
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Product Add / Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    price: '',
    category: 'Harvested Microgreens',
    unit: '100 GM',
    moq: '250 GM',
    benefit: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Users State (Supabase / Firestore 'users')
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Partner Inquiries State
  const [partnerInquiries, setPartnerInquiries] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);

  // Training Inquiries State
  const [trainingInquiries, setTrainingInquiries] = useState([]);
  const [loadingTrainings, setLoadingTrainings] = useState(true);

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Razorpay Settings
  const [razorpayKey, setRazorpayKey] = useState(() => localStorage.getItem('krishi_rzp_key') || '');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const categories = [
    'All',
    'Harvested Microgreens',
    'Live Microgreens',
    'Microgreens Seeds',
    'Dairy Alternatives',
    'Fruits and Vegetables',
    'Spices and Seasoning',
    'Professional Grow Trays',
    'Substrates & Growing Mediums'
  ];

  // Subscribe to all orders, users, partner inquiries, training inquiries
  useEffect(() => {
    let unsubscribeOrders = null;
    let unsubscribeUsers = null;
    let unsubscribePartners = null;
    let unsubscribeTraining = null;
    let sbOrdersChan = null;
    let sbPartnersChan = null;
    let sbTrainingsChan = null;
    let sbUsersChan = null;

    if (isSupabaseConfigured && supabase) {
      // 1. Fetch Orders from Supabase
      const fetchSupabaseData = async () => {
        try {
          const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
          if (orderData) {
            const formatted = orderData.map(o => ({
              id: o.id,
              userId: o.user_id,
              customerName: o.customer_name,
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
            }));
            setOrders(formatted);
          }
        } catch (e) {
          console.warn('Supabase orders fetch error:', e);
        } finally {
          setLoadingOrders(false);
        }

        try {
          const { data: partnerData } = await supabase.from('partner_inquiries').select('*').order('created_at', { ascending: false });
          if (partnerData) {
            const formatted = partnerData.map(p => ({
              id: p.id,
              businessName: p.company_name,
              fullName: p.contact_person,
              email: p.email,
              phone: p.phone,
              partnerType: p.business_type,
              estimatedVolume: p.estimated_volume,
              cityLocation: p.city,
              message: p.notes,
              status: p.status || 'New Lead',
              createdAt: p.created_at
            }));
            setPartnerInquiries(formatted);
          }
        } catch (e) {
          console.warn('Supabase partners fetch error:', e);
        } finally {
          setLoadingPartners(false);
        }

        try {
          const { data: trainData } = await supabase.from('training_inquiries').select('*').order('created_at', { ascending: false });
          if (trainData) {
            const formatted = trainData.map(t => ({
              id: t.id,
              fullName: t.applicant_name,
              email: t.email,
              phone: t.phone,
              trainingMode: t.workshop_type,
              experienceLevel: t.batch_preference,
              message: t.questions,
              status: t.status || 'New Inquiry',
              createdAt: t.created_at
            }));
            setTrainingInquiries(formatted);
          }
        } catch (e) {
          console.warn('Supabase training fetch error:', e);
        } finally {
          setLoadingTrainings(false);
        }

        try {
          const { data: userData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
          if (userData) {
            const formatted = userData.map(u => ({
              uid: u.id,
              id: u.id,
              email: u.email,
              displayName: u.display_name,
              phone: u.phone,
              role: u.role,
              createdAt: u.created_at
            }));
            setRegisteredUsers(formatted);
          }
        } catch (e) {
          console.warn('Supabase users fetch error:', e);
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchSupabaseData();

      // Realtime listeners for Supabase
      try {
        sbOrdersChan = supabase.channel('sb-admin-orders')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchSupabaseData)
          .subscribe();
        sbPartnersChan = supabase.channel('sb-admin-partners')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'partner_inquiries' }, fetchSupabaseData)
          .subscribe();
        sbTrainingsChan = supabase.channel('sb-admin-trainings')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'training_inquiries' }, fetchSupabaseData)
          .subscribe();
        sbUsersChan = supabase.channel('sb-admin-users')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchSupabaseData)
          .subscribe();
      } catch (err) {
        console.warn('Supabase realtime channel notice:', err);
      }

    } else {
      // 2. Firestore fallback listeners
      if (!db) {
        const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
        setOrders(local);
        setLoadingOrders(false);
        return;
      }

      const ordersRef = collection(db, 'orders');
      unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
        const list = [];
        snapshot.forEach(docSnap => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        list.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.orderDate ? new Date(a.orderDate).getTime() : 0);
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.orderDate ? new Date(b.orderDate).getTime() : 0);
          return timeB - timeA;
        });
        setOrders(list);
        setLoadingOrders(false);
      }, (err) => {
        console.warn('Orders realtime listener notice:', err);
        try {
          const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
          setOrders(local);
        } catch {
          setOrders([]);
        }
        setLoadingOrders(false);
      });

      const usersRef = collection(db, 'users');
      unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
        const uList = [];
        snapshot.forEach(docSnap => {
          uList.push({ id: docSnap.id, ...docSnap.data() });
        });
        setRegisteredUsers(uList);
        setLoadingUsers(false);
      }, () => {
        setRegisteredUsers([]);
        setLoadingUsers(false);
      });

      const partnersRef = collection(db, 'partner_inquiries');
      unsubscribePartners = onSnapshot(partnersRef, (snapshot) => {
        const pList = [];
        snapshot.forEach(docSnap => {
          pList.push({ id: docSnap.id, ...docSnap.data() });
        });
        pList.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return timeB - timeA;
        });
        setPartnerInquiries(pList);
        setLoadingPartners(false);
      }, () => {
        try {
          const local = JSON.parse(localStorage.getItem('kk_partner_inquiries') || '[]');
          setPartnerInquiries(local);
        } catch {
          setPartnerInquiries([]);
        }
        setLoadingPartners(false);
      });

      const trainingRef = collection(db, 'training_inquiries');
      unsubscribeTraining = onSnapshot(trainingRef, (snapshot) => {
        const tList = [];
        snapshot.forEach(docSnap => {
          tList.push({ id: docSnap.id, ...docSnap.data() });
        });
        tList.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return timeB - timeA;
        });
        setTrainingInquiries(tList);
        setLoadingTrainings(false);
      }, () => {
        try {
          const local = JSON.parse(localStorage.getItem('kk_training_inquiries') || '[]');
          setTrainingInquiries(local);
        } catch {
          setTrainingInquiries([]);
        }
        setLoadingTrainings(false);
      });
    }

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribePartners) unsubscribePartners();
      if (unsubscribeTraining) unsubscribeTraining();
      if (sbOrdersChan && supabase) supabase.removeChannel(sbOrdersChan);
      if (sbPartnersChan && supabase) supabase.removeChannel(sbPartnersChan);
      if (sbTrainingsChan && supabase) supabase.removeChannel(sbTrainingsChan);
      if (sbUsersChan && supabase) supabase.removeChannel(sbUsersChan);
    };
  }, []);

  // Filtered Products
  const filteredProducts = (products || []).filter(p => {
    const name = p.name || '';
    const benefit = p.benefit || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          benefit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    const currentStatus = (o.status || 'Pending Verification').toLowerCase();
    const filterLower = orderStatusFilter.toLowerCase();
    
    if (filterLower === 'pending verification' || filterLower === 'pending') {
      return currentStatus === 'pending verification' || currentStatus === 'placed';
    }
    return currentStatus === filterLower;
  });

  // Count pending verification orders
  const pendingOrdersCount = orders.filter(
    o => (o.status || 'Pending Verification') === 'Pending Verification' || o.status === 'Placed'
  ).length;

  // Calculate gross sales
  const grossRevenue = orders.reduce((sum, o) => {
    if (o.status === 'Cancelled') return sum;
    return sum + (Number(o.totalAmount) || 0);
  }, 0);

  // New Inquiries counts
  const newPartnerCount = partnerInquiries.filter(p => !p.status || p.status === 'New Lead' || p.status === 'New Partner Inquiry').length;
  const newTrainingCount = trainingInquiries.filter(t => !t.status || t.status === 'New Inquiry').length;

  // Handlers for Add / Edit Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormState({
      name: '',
      price: '',
      category: 'Harvested Microgreens',
      unit: '100 GM',
      moq: '250 GM',
      benefit: '',
      image: ''
    });
    setImagePreview('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormState({
      name: prod.name || '',
      price: prod.price || '',
      category: prod.category || 'Harvested Microgreens',
      unit: prod.unit || '100 GM',
      moq: prod.moq || '250 GM',
      benefit: prod.benefit || '',
      image: prod.image || ''
    });
    setImagePreview(prod.image || '');
    setIsFormOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setImagePreview(dataUrl);
        setFormState(prev => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.price) return;
    setSavingProduct(true);

    try {
      const productPayload = {
        name: formState.name.trim(),
        price: Number(formState.price),
        category: formState.category,
        unit: formState.unit || '100 GM',
        moq: formState.moq || '1 Pack',
        benefit: formState.benefit.trim(),
        image: formState.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productPayload);
        setProductSuccessMsg(`Updated "${formState.name}" successfully!`);
      } else {
        await addProduct(productPayload);
        setProductSuccessMsg(`Added new product "${formState.name}" successfully!`);
      }

      setIsFormOpen(false);
      setTimeout(() => setProductSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Please verify connectivity.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeletingId(productToDelete.id);
    try {
      await deleteProduct(productToDelete.id);
      setProductSuccessMsg(`Deleted "${productToDelete.name}" from catalog.`);
      setProductToDelete(null);
      setTimeout(() => setProductSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    // Update in Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      } catch (sbErr) {
        console.warn('Supabase status update error:', sbErr);
      }
    }

    // Update in Firestore
    try {
      if (db) {
        const orderDocRef = doc(db, 'orders', orderId);
        await updateDoc(orderDocRef, {
          status: newStatus,
          updatedAt: serverTimestamp()
        });
      } else {
        const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
        const updated = local.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        localStorage.setItem('krishi_local_orders', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error updating order status in Firestore:', err);
    }
  };

  const handleSaveRazorpayKey = (e) => {
    e.preventDefault();
    localStorage.setItem('krishi_rzp_key', razorpayKey);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleResetCatalog = async () => {
    if (window.confirm('Reset all catalog items to factory original Krishi Kutir list?')) {
      await resetToDefaultCatalog();
      setProductSuccessMsg('Catalog reset to initial factory products.');
      setTimeout(() => setProductSuccessMsg(''), 4000);
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-200 ${
      isDarkMode 
        ? 'admin-dark-mode bg-neutral-900 text-neutral-100' 
        : 'admin-light-mode bg-slate-100 text-slate-800'
    }`}>
      
      {/* 1. Modular Admin Header */}
      <AdminHeader
        onBackToStore={onBackToStore}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productsCount={products?.length || 0}
        ordersCount={orders.length}
        pendingOrdersCount={pendingOrdersCount}
        partnerInquiriesCount={partnerInquiries.length}
        newPartnerCount={newPartnerCount}
        trainingInquiriesCount={trainingInquiries.length}
        newTrainingCount={newTrainingCount}
        registeredUsersCount={registeredUsers.length}
        currentUser={currentUser}
        logout={logout}
        onOpenAdd={handleOpenAdd}
        onResetCatalog={handleResetCatalog}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* 2. Modular KPI Metric Counters Bar */}
      <AdminKpiBar
        productsCount={products?.length || 0}
        ordersCount={orders.length}
        grossRevenue={grossRevenue}
        formatPrice={formatPrice}
        partnerInquiriesCount={partnerInquiries.length}
        trainingInquiriesCount={trainingInquiries.length}
        registeredUsersCount={registeredUsers.length}
      />

      {/* Global Success Notification */}
      {productSuccessMsg && (
        <div className="bg-emerald-950/90 text-emerald-200 border-b border-emerald-800 px-6 py-3 text-xs font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{productSuccessMsg}</span>
        </div>
      )}

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            formatPrice={formatPrice}
            onOpenEdit={handleOpenEdit}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {/* TAB 2: LIVE ORDERS */}
        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            filteredOrders={filteredOrders}
            loadingOrders={loadingOrders}
            orderStatusFilter={orderStatusFilter}
            setOrderStatusFilter={setOrderStatusFilter}
            formatPrice={formatPrice}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* TAB 3: B2B PARTNER INQUIRIES */}
        {activeTab === 'partners' && (
          <PartnerInquiriesTab 
            inquiries={partnerInquiries} 
            loading={loadingPartners} 
          />
        )}

        {/* TAB 4: TRAINING & WORKSHOP INQUIRIES */}
        {activeTab === 'training' && (
          <TrainingInquiriesTab 
            inquiries={trainingInquiries} 
            loading={loadingTrainings} 
          />
        )}

        {/* TAB 5: REGISTERED USERS & DATABASE */}
        {activeTab === 'users' && (
          <UsersTab
            registeredUsers={registeredUsers}
            loadingUsers={loadingUsers}
            userSearchTerm={userSearchTerm}
            setUserSearchTerm={setUserSearchTerm}
          />
        )}

        {/* TAB 6: STORE, SUPABASE & RAZORPAY SETTINGS */}
        {activeTab === 'settings' && (
          <StoreSettingsTab
            razorpayKey={razorpayKey}
            setRazorpayKey={setRazorpayKey}
            handleSaveRazorpayKey={handleSaveRazorpayKey}
            settingsSaved={settingsSaved}
          />
        )}

      </main>

      {/* Product Add / Edit Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingProduct={editingProduct}
        formState={formState}
        setFormState={setFormState}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        handleImageFileUpload={handleImageFileUpload}
        handleSaveProduct={handleSaveProduct}
        savingProduct={savingProduct}
        categories={categories}
        isDarkMode={isDarkMode}
      />

      {/* Product Delete Confirmation Modal */}
      {productToDelete && (
        <div className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 ${!isDarkMode ? 'admin-light-mode' : 'admin-dark-mode'}`}>
          <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-950 text-red-400 border border-red-800/40 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black uppercase">Remove from Catalog?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-white font-bold">"{productToDelete.name}"</strong>? This will remove it from all store visitors immediately.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 rounded-xl border border-neutral-800 text-neutral-300 text-xs font-bold uppercase hover:bg-neutral-900 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={Boolean(deletingId)}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
