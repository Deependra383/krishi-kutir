import React from 'react';
import { X, Package, Upload, Image as ImageIcon, Save, Loader2, CheckCircle2, AlertCircle, Cloud } from 'lucide-react';

export const ProductFormModal = ({
  isOpen,
  onClose,
  editingProduct,
  formState,
  setFormState,
  imagePreview,
  setImagePreview,
  handleImageFileUpload,
  handleSaveProduct,
  savingProduct,
  isUploadingImage = false,
  imageUploadStatus = null,
  categories = [],
  isDarkMode = false
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans animate-in fade-in duration-200 ${!isDarkMode ? 'admin-light-mode' : 'admin-dark-mode'}`}>
      <div className={`${
        isDarkMode 
          ? 'bg-neutral-950 text-white border-neutral-800' 
          : 'bg-white text-neutral-900 border-neutral-200 shadow-2xl'
      } w-full max-w-xl rounded-3xl border overflow-hidden relative max-h-[92vh] flex flex-col`}>
        
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'border-neutral-800' : 'border-neutral-200 bg-neutral-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isDarkMode 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-black uppercase ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Save title, pricing, category, and photo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDarkMode 
                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white' 
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Moringa Leaf Powder"
              value={formState.name}
              onChange={(e) => setFormState(p => ({ ...p, name: e.target.value }))}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
              }`}
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Category *
              </label>
              <select
                value={formState.category}
                onChange={(e) => setFormState(p => ({ ...p, category: e.target.value }))}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none cursor-pointer transition-all ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Price in INR (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 350"
                value={formState.price}
                onChange={(e) => setFormState(p => ({ ...p, price: e.target.value }))}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold transition-all ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>
          </div>

          {/* Unit & MOQ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Unit (e.g. 100 GM, Tray)
              </label>
              <input
                type="text"
                placeholder="100 GM"
                value={formState.unit}
                onChange={(e) => setFormState(p => ({ ...p, unit: e.target.value }))}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Minimum Order (MOQ)
              </label>
              <input
                type="text"
                placeholder="250 GM"
                value={formState.moq}
                onChange={(e) => setFormState(p => ({ ...p, moq: e.target.value }))}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>
          </div>

          {/* Benefits Description */}
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Health Benefits & Description
            </label>
            <textarea
              rows={2}
              placeholder="Nutritional value, vitamin density, culinary uses..."
              value={formState.benefit}
              onChange={(e) => setFormState(p => ({ ...p, benefit: e.target.value }))}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-white' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900'
              }`}
            />
          </div>

          {/* Image Upload / URL */}
          <div className={`space-y-3 pt-2 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <div className="flex items-center justify-between">
              <label className={`block text-[10px] font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Product Image (Supabase Storage Bucket or Web Link)
              </label>
              {imageUploadStatus && (
                <div className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  imageUploadStatus.type === 'success' 
                    ? (isDarkMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-emerald-50 text-emerald-700 border border-emerald-200') 
                    : imageUploadStatus.type === 'uploading'
                    ? (isDarkMode ? 'bg-blue-950 text-blue-300 border border-blue-800/60' : 'bg-blue-50 text-blue-700 border border-blue-200')
                    : (isDarkMode ? 'bg-amber-950 text-amber-300 border border-amber-800/60' : 'bg-amber-50 text-amber-700 border border-amber-200')
                }`}>
                  {imageUploadStatus.type === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                  {imageUploadStatus.type === 'uploading' && <Loader2 className="w-3 h-3 text-blue-500 animate-spin shrink-0" />}
                  {imageUploadStatus.type === 'warning' && <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />}
                  <span className="truncate max-w-[240px]">{imageUploadStatus.message}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <label 
                htmlFor="page-file-upload"
                className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all text-center relative ${
                  isUploadingImage 
                    ? (isDarkMode ? 'border-blue-500/50 bg-blue-950/20' : 'border-blue-400 bg-blue-50/50') 
                    : (isDarkMode ? 'border-neutral-800 hover:border-emerald-500 bg-neutral-900/70 hover:bg-neutral-900' : 'border-neutral-300 hover:border-emerald-500 bg-neutral-50 hover:bg-neutral-100')
                }`}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin mb-1" />
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>Uploading to Bucket...</span>
                    <span className={`text-[10px] ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Storing in Supabase cloud</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-5 h-5 text-emerald-500 mb-1" />
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>Upload to Supabase Bucket</span>
                    <span className={`text-[10px] ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>JPG, PNG, WebP up to 8MB</span>
                  </>
                )}
                <input
                  id="page-file-upload"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>

              <div className={`h-28 rounded-2xl overflow-hidden border flex items-center justify-center relative ${
                isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
              }`}>
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`text-center text-[10px] ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                    No Image Selected
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className={`text-[10px] font-bold block mb-1 ${
                isDarkMode ? 'text-neutral-500' : 'text-neutral-500'
              }`}>Or paste online image URL:</span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formState.image}
                onChange={(e) => {
                  setFormState(p => ({ ...p, image: e.target.value }));
                  setImagePreview(e.target.value);
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={savingProduct}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {savingProduct ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
