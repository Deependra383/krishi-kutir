import React from 'react';
import { 
  ArrowLeft, 
  Store, 
  ShieldCheck, 
  LogOut, 
  Package, 
  ShoppingBag, 
  Handshake, 
  GraduationCap, 
  Users, 
  Sliders, 
  Plus, 
  RotateCcw,
  Moon,
  Sun
} from 'lucide-react';
import { AnimatedLogo } from '../AnimatedLogo';

export const AdminHeader = ({
  onBackToStore,
  activeTab,
  setActiveTab,
  productsCount = 0,
  ordersCount = 0,
  pendingOrdersCount = 0,
  partnerInquiriesCount = 0,
  newPartnerCount = 0,
  trainingInquiriesCount = 0,
  newTrainingCount = 0,
  registeredUsersCount = 0,
  currentUser,
  logout,
  onOpenAdd,
  onResetCatalog,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  return (
    <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar: Brand, Live indicator, User & Exit */}
        <div className="flex items-center justify-between h-18">
          
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 shadow-xs">
                <AnimatedLogo size={28} showText={false} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-1.5">
                    Krishi Kutir
                  </h1>
                  <span className="bg-amber-400 text-neutral-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">
                    Admin
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono">Live Operations & Inventory</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-[11px] truncate max-w-[150px]">
                {currentUser?.email || 'admin@krishikutir.com'}
              </span>
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              id="admin-theme-toggle-btn"
              type="button"
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Activate Dark Mode'}
              className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-white"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={onBackToStore}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
            </button>

            <button
              onClick={logout}
              title="Logout from Admin"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-800 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center justify-between overflow-x-auto border-t border-neutral-900 py-2 gap-2 scrollbar-none">
          <div className="flex items-center gap-1.5">
            
            <button
              id="page-tab-products"
              onClick={() => setActiveTab('products')}
              className={`py-2.5 px-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Package className="w-4 h-4" />
              Products ({productsCount})
            </button>

            <button
              id="page-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`py-2.5 px-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap relative ${
                activeTab === 'orders'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders ({ordersCount})
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 font-black text-[9px] border border-amber-300 animate-pulse">
                  {pendingOrdersCount} new
                </span>
              )}
            </button>

            <button
              id="page-tab-partners"
              onClick={() => setActiveTab('partners')}
              className={`py-2.5 px-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer relative whitespace-nowrap ${
                activeTab === 'partners'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Handshake className="w-4 h-4" />
              Partner Leads ({partnerInquiriesCount})
              {newPartnerCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            <button
              id="page-tab-training"
              onClick={() => setActiveTab('training')}
              className={`py-2.5 px-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer relative whitespace-nowrap ${
                activeTab === 'training'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Training ({trainingInquiriesCount})
              {newTrainingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            <button
              id="page-tab-users"
              onClick={() => setActiveTab('users')}
              className={`py-2.5 px-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Users & DB ({registeredUsersCount})
            </button>

            <button
              id="page-tab-settings"
              onClick={() => setActiveTab('settings')}
              className={`py-2.5 px-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Quick Action Buttons for Products tab */}
          {activeTab === 'products' && (
            <div className="flex items-center gap-2">
              <button
                id="btn-page-add-product"
                onClick={onOpenAdd}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </button>

              {onResetCatalog && (
                <button
                  onClick={onResetCatalog}
                  title="Reset to factory catalog"
                  className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
