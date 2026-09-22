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
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm font-sans animate-in fade-in duration-200 ${!isDarkMode ? 'admin-light-mode' : 'admin-dark-mode'}`}>
      <div className={`${
        isDarkMode 
          ? 'bg-neutral-950 text-white border-neutral-800' 
          : 'bg-white text-neutral-900 border-neutral-200 shadow-2xl'
      } w-full max-w-xl rounded-3xl border overflow-hidden relative max-h-[90vh] flex flex-col`}>
        
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b shrink-0 flex items-center justify-between ${
          isDarkMode ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-200 bg-neutral-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
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
            type="button"
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

        {/* Form Body - Scrollable Area */}
        <form id="product-modal-form" onSubmit={handleSaveProduct} className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4 text-xs">
          
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
              placeholder=""
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
                placeholder=""
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
                Unit
              </label>
              <input
                type="text"
                placeholder=""
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
                placeholder=""
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
              placeholder=""
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
              <span className={`text-[10px] flex items-center gap-1 ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-600 font-bold'
              }`}>
                <Cloud className="w-3 h-3" /> Storage Integrated
              </span>
            </div>

            {/* Storage status notice */}
            {imageUploadStatus && (
              <div className={`p-3 rounded-xl border text-[11px] flex items-start gap-2 ${
                imageUploadStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {imageUploadStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{imageUploadStatus.message}</div>
                  {imageUploadStatus.detail && (
                    <div className="text-[10px] opacity-80 mt-0.5">{imageUploadStatus.detail}</div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <label
                htmlFor="page-file-upload"
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 h-28 ${
                  isUploadingImage ? 'opacity-50 pointer-events-none' : ''
                } ${
                  isDarkMode 
                    ? 'border-neutral-800 hover:border-emerald-500 bg-neutral-900/50' 
                    : 'border-neutral-300 hover:border-emerald-500 bg-neutral-50'
                }`}
              >
                <Upload className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] font-bold text-neutral-700">
                  {isUploadingImage ? 'Uploading...' : 'Upload Image File'}
                </span>
                <span className="text-[9px] text-neutral-400">PNG, JPG, WebP up to 5MB</span>
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
                placeholder=""
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

        </form>

        {/* Sticky Action Footer: Never Gets Cropped */}
        <div className={`p-4 sm:p-5 border-t shrink-0 flex items-center justify-between gap-3 ${
          isDarkMode ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-neutral-50'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              isDarkMode 
                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300' 
                : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300'
            }`}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="product-modal-form"
            disabled={savingProduct}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {savingProduct ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" />
                <span>{editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
