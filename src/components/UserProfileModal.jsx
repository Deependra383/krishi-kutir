import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UserProfileModal = ({ isOpen, onClose, onOpenAdmin }) => {
  const { currentUser, userProfile, updateProfileData, logout, isAdmin } = useAuth();

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

  if (!isOpen) return null;

  const isStrictAdmin = Boolean(isAdmin || (currentUser?.email || '').trim().toLowerCase() === 'krishi345@gmail.com');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-neutral-900 w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Light Theme Header */}
        <div className="bg-gradient-to-b from-emerald-50/90 via-neutral-50/40 to-white text-neutral-900 p-5 sm:p-6 border-b border-neutral-200/80 relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl uppercase shadow-xs shrink-0">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'K'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black uppercase text-neutral-900 tracking-tight truncate">
                  {userProfile?.displayName || currentUser?.displayName || 'Krishi Customer'}
                </h2>
                {isStrictAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" /> Admin
                  </span>
                )}
              </div>
              <p className="text-neutral-500 text-xs flex items-center gap-1.5 mt-0.5 font-medium truncate">
                <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="truncate">{currentUser?.email || 'Customer'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isStrictAdmin && (
              <button
                id="open-admin-from-profile"
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAdmin) onOpenAdmin();
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Store Admin</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}

            <button
              id="user-signout-btn"
              type="button"
              onClick={async () => {
                await logout();
                onClose();
              }}
              title="Sign Out"
              className="p-2 rounded-xl bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 border border-neutral-200 transition-all cursor-pointer"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              id="close-profile-modal"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 border border-neutral-200 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {/* Store Administrator Light Portal Banner */}
          {isStrictAdmin && (
            <div className="mb-5 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                      Store Administrator Portal
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 text-[9px] font-extrabold uppercase">
                      Authorized
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800/90 mt-0.5">
                    Manage product catalog, customer orders, training inquiries, homepage media, and brand logo.
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="profile-banner-open-admin-btn"
                onClick={() => {
                  onClose();
                  if (onOpenAdmin) onOpenAdmin();
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Store Admin</span>
              </button>
            </div>
          )}

          <div className="mb-4 pb-3 border-b border-neutral-200 flex items-center gap-2 text-emerald-800">
            <User className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">Customer Profile & Delivery Address</h3>
          </div>

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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder="462001"
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
        </div>
      </div>
    </div>
  );
};
