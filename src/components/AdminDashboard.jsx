import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase, isSupabaseConfigured, uploadProductImage } from '../supabase';
import { AdminHeader } from './admin/AdminHeader';
import { AdminKpiBar } from './admin/AdminKpiBar';
import { ProductsTab } from './admin/ProductsTab';
import { ProductFormModal } from './admin/ProductFormModal';
import { PartnerInquiriesTab } from './admin/PartnerInquiriesTab';
import { TrainingInquiriesTab } from './admin/TrainingInquiriesTab';
import { UsersTab } from './admin/UsersTab';
import { StoreSettingsTab } from './admin/StoreSettingsTab';
import { LogoCustomizerCard } from './admin/LogoCustomizerCard';
import { HomepageImagesCard } from './admin/HomepageImagesCard';
import { FoundersCustomizerCard } from './admin/FoundersCustomizerCard';
import { EventsWorkshopsCard } from './admin/EventsWorkshopsCard';
import { InfrastructureCustomizerCard } from './admin/InfrastructureCustomizerCard';
import { ProductDivisionsCustomizerCard } from './admin/ProductDivisionsCustomizerCard';

export const AdminDashboard = ({ onBackToStore, formatPrice }) => {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaultCatalog } = useProducts();
  const { currentUser, logout, isAdmin } = useAuth();
  const isStrictAdmin = isAdmin && (currentUser?.email || '').trim().toLowerCase() === 'krishi345@gmail.com';

  useEffect(() => {
    if (!isStrictAdmin) {
      onBackToStore();
    }
  }, [isStrictAdmin, onBackToStore]);

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState(null);
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

  const categories = [
    'All',
    'Harvested Microgreens',
    'Live Microgreens',
    'Microgreens Seeds',
    'Dairy Alternatives',
    'Fruits and Vegetables',
    'Spices and Seasoning',
    'Professional Grow Trays',
    'Substrates & Growing Mediums',
    'Eco Packaging'
  ];

  // Subscribe to all orders, users, partner inquiries, training inquiries
  useEffect(() => {
    if (!isStrictAdmin) return;
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
      // 2. Local storage fallback
      try {
        const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
        setOrders(local);
      } catch {
        setOrders([]);
      }
      setLoadingOrders(false);

      try {
        const localUsers = JSON.parse(localStorage.getItem('krishi_registered_users') || '[]');
        setRegisteredUsers(localUsers);
      } catch {
        setRegisteredUsers([]);
      }
      setLoadingUsers(false);

      try {
        const localPartners = JSON.parse(localStorage.getItem('kk_partner_inquiries') || '[]');
        setPartnerInquiries(localPartners);
      } catch {
        setPartnerInquiries([]);
      }
      setLoadingPartners(false);

      try {
        const localTraining = JSON.parse(localStorage.getItem('kk_training_inquiries') || '[]');
        setTrainingInquiries(localTraining);
      } catch {
        setTrainingInquiries([]);
      }
      setLoadingTrainings(false);
    }

    return () => {
      if (sbOrdersChan && supabase) supabase.removeChannel(sbOrdersChan);
      if (sbPartnersChan && supabase) supabase.removeChannel(sbPartnersChan);
      if (sbTrainingsChan && supabase) supabase.removeChannel(sbTrainingsChan);
      if (sbUsersChan && supabase) supabase.removeChannel(sbUsersChan);
    };
  }, [isStrictAdmin]);

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
    setImageUploadStatus(null);
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
    setImageUploadStatus(null);
    setIsFormOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please select a smaller image file.');
      return;
    }

    // 1. Show immediate preview
    const tempUrl = URL.createObjectURL(file);
    setImagePreview(tempUrl);

    // 2. Upload to Supabase Storage Bucket
    setIsUploadingImage(true);
    setImageUploadStatus({ type: 'uploading', message: 'Uploading to Supabase Storage bucket...' });

    try {
      const uploadResult = await uploadProductImage(file);
      if (uploadResult?.url) {
        setImagePreview(uploadResult.url);
        setFormState(prev => ({ ...prev, image: uploadResult.url }));
        setImageUploadStatus({
          type: 'success',
          message: `Saved to Supabase bucket "${uploadResult.bucket}"`,
          url: uploadResult.url
        });
      }
    } catch (err) {
      console.warn('Supabase storage upload error, using local fallback:', err);
      // Fallback to Base64 so the admin can still save the product seamlessly
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setImagePreview(dataUrl);
        setFormState(prev => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);

      setImageUploadStatus({
        type: 'warning',
        message: 'Loaded locally. To store directly in cloud bucket, create a public bucket named "products" in Supabase.'
      });
    } finally {
      setIsUploadingImage(false);
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

    try {
      const local = JSON.parse(localStorage.getItem('krishi_local_orders') || '[]');
      const updated = local.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('krishi_local_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleResetCatalog = async () => {
    if (window.confirm('Reset all catalog items to factory original Krishi Kutir list?')) {
      await resetToDefaultCatalog();
      setProductSuccessMsg('Catalog reset to initial factory products.');
      setTimeout(() => setProductSuccessMsg(''), 4000);
    }
  };

  if (!isStrictAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900 p-6">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-200 mx-auto flex items-center justify-center font-bold">
            !
          </div>
          <h2 className="text-lg font-bold">Access Restricted</h2>
          <p className="text-xs text-neutral-500">
            Only the authorized administrator account (<span className="text-emerald-700 font-mono font-bold">krishi345@gmail.com</span>) can access the store management console.
          </p>
          <button
            onClick={onBackToStore}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="admin-dashboard-root"
      style={{ fontFamily: "'Cereal', 'Airbnb Cereal App', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
      className="min-h-screen admin-dashboard flex flex-col antialiased admin-light-mode bg-neutral-100 text-neutral-900"
    >
      
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
      />

      {/* 2. Modular KPI Metric Counters Bar */}
      <AdminKpiBar
        productsCount={products?.length || 0}
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
            onOpenAdd={handleOpenAdd}
            isDarkMode={isDarkMode}
          />
        )}

        {/* TAB 2: B2B PARTNER INQUIRIES */}
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

        {/* TAB 6: HOMEPAGE, FOUNDERS & EVENTS MEDIA CUSTOMIZER */}
        {activeTab === 'media' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <LogoCustomizerCard />
            <HomepageImagesCard />
            <ProductDivisionsCustomizerCard />
            <InfrastructureCustomizerCard />
            <EventsWorkshopsCard />
            <FoundersCustomizerCard />
          </div>
        )}

        {/* TAB 7: STORE & SUPABASE SETTINGS */}
        {activeTab === 'settings' && (
          <StoreSettingsTab />
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
        isUploadingImage={isUploadingImage}
        imageUploadStatus={imageUploadStatus}
        categories={categories}
        isDarkMode={isDarkMode}
      />

      {/* Product Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 admin-light-mode">
          <div className="bg-white text-neutral-900 border border-neutral-200 rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-red-50 text-red-600 border border-red-200">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black uppercase text-neutral-900">Remove from Catalog?</h3>
              <p className="text-xs leading-relaxed text-neutral-600">
                Are you sure you want to permanently delete <strong className="font-bold text-neutral-900">"{productToDelete.name}"</strong>? This will remove it from all store visitors immediately.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-bold uppercase transition-all cursor-pointer"
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
