import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  FolderTree,
  FolderPlus,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { uploadProductImage, isSupabaseConfigured } from '../../supabase';

export const CategoryManagerCard = ({ isDarkMode = false }) => {
  const { 
    products = [],
    categories = [], 
    showcaseCategories = [], 
    majorCategories = [],
    addMajorCategory,
    deleteMajorCategory,
    addCategory, 
    updateCategoryConfig, 
    deleteCategory, 
    resetCategories,
    seedStandardHierarchy
  } = useProducts();

  // Active view: 'sub' (manage subcategories) | 'major' (manage major categories)
  const [activeSection, setActiveSection] = useState('sub');

  // Simple / Advanced creation toggle for sub-category
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sub-category form state
  const [subName, setSubName] = useState('');
  const [selectedMajorId, setSelectedMajorId] = useState('');
  const [subImage, setSubImage] = useState('');
  const [subShortDesc, setSubShortDesc] = useState('');
  const [subTag, setSubTag] = useState('');
  const [subBenefit1, setSubBenefit1] = useState('');
  const [subBenefit2, setSubBenefit2] = useState('');

  // Major-category form state
  const [majorName, setMajorName] = useState('');
  const [majorDesc, setMajorDesc] = useState('');
  const [majorImage, setMajorImage] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // File upload to Supabase Storage ('products' or fallback)
  const handleImageFileChange = async (e, targetSetter) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (isSupabaseConfigured) {
        const res = await uploadProductImage(file);
        if (res?.url) {
          targetSetter(res.url);
          setFeedback({ type: 'success', message: 'Image uploaded successfully!' });
          setTimeout(() => setFeedback(null), 3000);
          setIsUploading(false);
          return;
        }
      }

      // Local Data URL fallback
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        targetSetter(uploadEvent.target.result);
        setFeedback({ type: 'info', message: 'Image loaded locally.' });
        setTimeout(() => setFeedback(null), 3000);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('Upload error:', err);
      setFeedback({ type: 'error', message: 'Could not upload image file.' });
      setTimeout(() => setFeedback(null), 3500);
      setIsUploading(false);
    }
  };

  // Create Sub Category
  const handleCreateSubCategory = (e) => {
    e.preventDefault();
    const trimmed = subName.trim();
    if (!trimmed) return;

    const benefits = [];
    if (subBenefit1.trim()) benefits.push(subBenefit1.trim());
    if (subBenefit2.trim()) benefits.push(subBenefit2.trim());

    const chosenMajor = majorCategories.find(m => m.id === selectedMajorId);

    const payload = {
      name: trimmed,
      title: trimmed,
      majorCategoryId: chosenMajor ? chosenMajor.id : (selectedMajorId || null),
      majorCategoryName: chosenMajor ? chosenMajor.name : null,
      image: subImage.trim() || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      shortDesc: subShortDesc.trim() || `Pure natural and sustainably produced ${trimmed} for healthy vitality.`,
      tag: subTag.trim() || `${trimmed} • 100% Organic`,
      letter: (trimmed.charAt(0) || 'K').toUpperCase(),
      benefits: benefits.length > 0 ? benefits : undefined
    };

    const success = addCategory(payload);
    if (success) {
      setFeedback({ 
        type: 'success', 
        message: `Sub-category "${trimmed}" created ${chosenMajor ? `under "${chosenMajor.name}"` : ''}! Available in Navbar and Showcase.` 
      });
      // Clear form
      setSubName('');
      setSubImage('');
      setSubShortDesc('');
      setSubTag('');
      setSubBenefit1('');
      setSubBenefit2('');
      setShowAdvanced(false);
    } else {
      setFeedback({ type: 'error', message: `Sub-category "${trimmed}" already exists.` });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  // Create Major Category
  const handleCreateMajorCategory = (e) => {
    e.preventDefault();
    const trimmed = majorName.trim();
    if (!trimmed) return;

    const payload = {
      name: trimmed,
      description: majorDesc.trim(),
      image: majorImage.trim() || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
    };

    const result = addMajorCategory(payload);
    if (result) {
      setFeedback({ 
        type: 'success', 
        message: `Major Category "${trimmed}" created! You can now assign sub-categories to it.` 
      });
      setMajorName('');
      setMajorDesc('');
      setMajorImage('');
    } else {
      setFeedback({ type: 'error', message: `Major Category "${trimmed}" already exists.` });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleExecuteDeleteSub = (cat) => {
    deleteCategory(cat);
    setFeedback({ type: 'info', message: `Removed sub-category "${cat.title || cat.name}".` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExecuteDeleteMajor = (major) => {
    deleteMajorCategory(major.id);
    setFeedback({ type: 'info', message: `Removed Major Category "${major.name}".` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExecuteReset = () => {
    resetCategories();
    setConfirmReset(false);
    setFeedback({ type: 'info', message: 'Cleared all categories.' });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleLoadStandard = async () => {
    if (seedStandardHierarchy) {
      await seedStandardHierarchy();
      setFeedback({ type: 'success', message: 'Loaded standard hierarchy: Natural Powders, Microgreens & Seeds, Dairy Alternatives, Fruit & Veggie Powders!' });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Helper to get products count for a category
  const getProductCountForCat = (cat) => {
    const catTitle = (cat.title || cat.name || '').toLowerCase();
    const catId = (cat.id || '').toLowerCase();
    return products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pSub = (p.subCategory || '').toLowerCase();
      return pCat === catTitle || pSub === catTitle || pCat.includes(catTitle) || pCat.includes(catId);
    }).length;
  };

  return (
    <div className={`p-5 sm:p-7 rounded-3xl border transition-all ${
      isDarkMode 
        ? 'bg-neutral-950 border-neutral-800 text-white' 
        : 'bg-white border-neutral-200 text-neutral-900 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-neutral-200/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black uppercase tracking-wider text-neutral-900">
                Major & Sub Categories Manager
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Navbar & Carousel Live Sync
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Organize into Major Categories (e.g. Natural Powders, Microgreens & Seeds) and Sub Categories (Fruit Powder, Dairy Alternatives, Seeds).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end lg:self-center">
          <button
            type="button"
            onClick={handleLoadStandard}
            className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
            title="Load standard Natural Powders & Microgreens hierarchy"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load Standard Hierarchy</span>
          </button>

          {confirmReset ? (
            <div className="flex items-center gap-1.5 shrink-0 bg-red-50 p-1.5 rounded-xl border border-red-200">
              <span className="text-[10px] font-bold text-red-800">Delete all?</span>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 rounded-lg bg-white border border-neutral-300 text-neutral-700 text-[10px] font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-[11px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-all cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in duration-150 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : feedback.type === 'error'
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-neutral-100 text-neutral-800 border-neutral-300'
        }`}>
          {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {feedback.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          {feedback.type === 'info' && <Tag className="w-4 h-4 text-neutral-600 shrink-0" />}
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Tabs Switcher: Sub Categories vs Major Categories */}
      <div className="mt-5 flex items-center gap-2 border-b border-neutral-200/80 pb-3">
        <button
          type="button"
          onClick={() => setActiveSection('sub')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'sub'
              ? 'bg-[#2d6a4f] text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Sub Categories ({showcaseCategories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('major')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'major'
              ? 'bg-[#2d6a4f] text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Major Categories ({majorCategories.length})</span>
        </button>
      </div>

      {/* ================= SECTION 1: SUB CATEGORIES ================= */}
      {activeSection === 'sub' && (
        <div className="mt-4 space-y-6">
          <form onSubmit={handleCreateSubCategory} className="p-4 sm:p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-200/60">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Create New Sub Category</span>
              </span>
              <span className="text-[10px] text-neutral-400">
                e.g. Dairy Alternatives, Fruit Powder, Vegetable Powder, Seeds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Sub-category Name */}
              <div className="md:col-span-6 relative">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                  Sub-Category Name *
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dairy Alternatives, Fruit Powder, Vegetable Powder..."
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold transition-all"
                  />
                </div>
              </div>

              {/* Major Category Selector */}
              <div className="md:col-span-6">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                  Parent Major Category
                </label>
                <select
                  value={selectedMajorId}
                  onChange={(e) => setSelectedMajorId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium transition-all cursor-pointer"
                >
                  <option value="">-- None / Standalone Category --</option>
                  {majorCategories.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced toggle & Submit */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 cursor-pointer py-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{showAdvanced ? 'Hide Additional Details' : 'Add Photo, Tag & Description'}</span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Sub Category</span>
              </button>
            </div>

            {/* Advanced Fields */}
            {showAdvanced && (
              <div className="pt-3 border-t border-neutral-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-600 mb-1">Image URL or Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={subImage}
                      onChange={(e) => setSubImage(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-neutral-200 bg-white outline-none"
                    />
                    <label className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                      <Upload className="w-3 h-3 text-emerald-600" />
                      <span>{isUploading ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileChange(e, setSubImage)}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-600 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Plant-Based • Lactose Free"
                    value={subTag}
                    onChange={(e) => setSubTag(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200 bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-600 mb-1">Short Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure plant-derived powders including coconut milk, almond milk, and creamy oat milk."
                    value={subShortDesc}
                    onChange={(e) => setSubShortDesc(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-200 bg-white outline-none"
                  />
                </div>
              </div>
            )}
          </form>

          {/* Grouped View of Sub Categories by Major Category */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
                Configured Sub Categories ({showcaseCategories.length})
              </span>
              <span className="text-[10px] text-neutral-400">
                Organized under Major Categories
              </span>
            </div>

            {showcaseCategories.length === 0 ? (
              <div className="py-10 text-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 space-y-2">
                <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs font-bold text-neutral-700">No sub-categories created yet.</p>
                <p className="text-[11px] text-neutral-400">Click &ldquo;Load Standard Hierarchy&rdquo; above or use the form to add one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Major Category Groups */}
                {majorCategories.map((major) => {
                  const children = showcaseCategories.filter(c => c.majorCategoryId === major.id);
                  if (children.length === 0) return null;

                  return (
                    <div key={major.id} className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                            {major.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            {children.length} Sub-Categories
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {children.map((cat) => {
                          const prodCount = getProductCountForCat(cat);
                          return (
                            <div
                              key={cat.id}
                              className="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-300 transition-all"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 shrink-0 flex items-center justify-center p-0.5 overflow-hidden">
                                  {cat.image ? (
                                    <img src={cat.image} alt={cat.title} className="max-h-full max-w-full object-contain" />
                                  ) : (
                                    <span className="font-serif font-black text-emerald-800 text-xs">{cat.letter}</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-neutral-900 truncate">
                                    {cat.title}
                                  </h5>
                                  <p className="text-[10px] text-neutral-400 truncate">
                                    {prodCount} products listed
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <a
                                  href={`#category=${cat.id}`}
                                  title="View page"
                                  className="p-1 rounded-md text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete sub-category "${cat.title}"?`)) {
                                      handleExecuteDeleteSub(cat);
                                    }
                                  }}
                                  title="Delete sub-category"
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Standalone / Unassigned Sub-Categories */}
                {(() => {
                  const unassigned = showcaseCategories.filter(c => !c.majorCategoryId || !majorCategories.some(m => m.id === c.majorCategoryId));
                  if (unassigned.length === 0) return null;

                  return (
                    <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
                        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700">
                          Other Sub-Categories ({unassigned.length})
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {unassigned.map((cat) => {
                          const prodCount = getProductCountForCat(cat);
                          return (
                            <div
                              key={cat.id}
                              className="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-300 transition-all"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 shrink-0 flex items-center justify-center p-0.5 overflow-hidden">
                                  {cat.image ? (
                                    <img src={cat.image} alt={cat.title} className="max-h-full max-w-full object-contain" />
                                  ) : (
                                    <span className="font-serif font-black text-emerald-800 text-xs">{cat.letter}</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-neutral-900 truncate">
                                    {cat.title}
                                  </h5>
                                  <p className="text-[10px] text-neutral-400 truncate">
                                    {prodCount} products listed
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <a
                                  href={`#category=${cat.id}`}
                                  title="View page"
                                  className="p-1 rounded-md text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete sub-category "${cat.title}"?`)) {
                                      handleExecuteDeleteSub(cat);
                                    }
                                  }}
                                  title="Delete sub-category"
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SECTION 2: MAJOR CATEGORIES ================= */}
      {activeSection === 'major' && (
        <div className="mt-4 space-y-6">
          <form onSubmit={handleCreateMajorCategory} className="p-4 sm:p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-200/60">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <FolderPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Create New Major Category</span>
              </span>
              <span className="text-[10px] text-neutral-400">
                Primary department (e.g. Natural Powders, Microgreens & Seeds)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                  Major Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Natural Powders, Microgreens & Seeds..."
                  value={majorName}
                  onChange={(e) => setMajorName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                  Image URL or Upload (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={majorImage}
                    onChange={(e) => setMajorImage(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white outline-none"
                  />
                  <label className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3 h-3 text-emerald-600" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, setMajorImage)}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100% natural dehydrated fruit powders, vegetable powders, and plant-based dairy alternatives."
                  value={majorDesc}
                  onChange={(e) => setMajorDesc(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Major Category</span>
              </button>
            </div>
          </form>

          {/* List of Major Categories */}
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500 block">
              Active Major Categories ({majorCategories.length})
            </span>

            {majorCategories.length === 0 ? (
              <div className="py-8 text-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 space-y-2">
                <FolderPlus className="w-7 h-7 text-neutral-400 mx-auto" />
                <p className="text-xs font-bold text-neutral-700">No major categories created.</p>
                <p className="text-[11px] text-neutral-400">Click &ldquo;Load Standard Hierarchy&rdquo; to add Natural Powders and Microgreens & Seeds.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {majorCategories.map((m) => {
                  const assignedSubs = showcaseCategories.filter(c => c.majorCategoryId === m.id);
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100/60 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 font-black text-sm">
                          {m.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 truncate">
                            {m.name}
                          </h4>
                          {m.description && (
                            <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                              {m.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {assignedSubs.length} Sub-Categories
                            </span>
                            {assignedSubs.map(s => (
                              <span key={s.id} className="text-[9px] px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600 font-medium">
                                {s.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete Major Category "${m.name}"? Subcategories will become unassigned.`)) {
                            handleExecuteDeleteMajor(m);
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors shrink-0"
                        title="Delete Major Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
