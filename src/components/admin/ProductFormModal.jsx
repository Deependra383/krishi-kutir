import React from 'react';
import { X, Package, Upload, Image as ImageIcon, Save } from 'lucide-react';

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
  categories = [],
  isDarkMode = false
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans animate-in fade-in duration-200 ${!isDarkMode ? 'admin-light-mode' : 'admin-dark-mode'}`}>
      <div className="bg-neutral-950 text-white w-full max-w-xl rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase">
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
              </h3>
              <p className="text-xs text-neutral-400">Save title, pricing, category, and photo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Moringa Leaf Powder"
              value={formState.name}
              onChange={(e) => setFormState(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Category *
              </label>
              <select
                value={formState.category}
                onChange={(e) => setFormState(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none cursor-pointer"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Price in INR (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 350"
                value={formState.price}
                onChange={(e) => setFormState(p => ({ ...p, price: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Unit & MOQ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Unit (e.g. 100 GM, Tray)
              </label>
              <input
                type="text"
                placeholder="100 GM"
                value={formState.unit}
                onChange={(e) => setFormState(p => ({ ...p, unit: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Minimum Order (MOQ)
              </label>
              <input
                type="text"
                placeholder="250 GM"
                value={formState.moq}
                onChange={(e) => setFormState(p => ({ ...p, moq: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Benefits Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Health Benefits & Description
            </label>
            <textarea
              rows={2}
              placeholder="Nutritional value, vitamin density, culinary uses..."
              value={formState.benefit}
              onChange={(e) => setFormState(p => ({ ...p, benefit: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Image Upload / URL */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Product Image (Upload Local File or Web Link)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <label 
                htmlFor="page-file-upload"
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-neutral-800 hover:border-emerald-500 rounded-2xl cursor-pointer bg-neutral-900/70 hover:bg-neutral-900 transition-all text-center"
              >
                <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                <span className="text-xs font-bold text-neutral-200">Upload Image File</span>
                <span className="text-[10px] text-neutral-500">JPG, PNG, WebP up to 3MB</span>
                <input
                  id="page-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>

              <div className="h-28 bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-neutral-500 text-[10px]">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                    No Image Selected
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-neutral-500 font-bold block mb-1">Or paste online image URL:</span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formState.image}
                onChange={(e) => {
                  setFormState(p => ({ ...p, image: e.target.value }));
                  setImagePreview(e.target.value);
                }}
                className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500"
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
