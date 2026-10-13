import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { ALL_PRODUCTS_LIST } from '../data';
import { CATEGORIES_CONFIG, createCategoryConfigItem } from '../data/categoriesConfig';

const ProductContext = createContext(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

// Empty default categories - user creates all categories and products manually via the Admin Panel
export const DEFAULT_PRODUCT_CATEGORIES = [];

export const STANDARD_MAJOR_CATEGORIES = [
  {
    id: 'natural-powders',
    name: 'Natural Powders',
    title: 'Natural Powders',
    description: '100% natural stone-ground fruit powders, vegetable powders, and plant-based dairy alternatives.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'microgreens-seed',
    name: 'Microgreens & Seeds',
    title: 'Microgreens & Seeds',
    description: 'Living microgreens trays, fresh harvested shoots, and tested high-germination sprouting seeds.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString()
  }
];

export const STANDARD_SUB_CATEGORIES = [
  'Fruit Powder',
  'Vegetable Powder',
  'Dairy Alternatives',
  'Live Harvested Microgreens',
  'Seeds'
];

export const STANDARD_CATEGORY_CONFIGS = {
  'fruit-powder': {
    id: 'fruit-powder',
    name: 'Fruit Powder',
    title: 'Fruit Powder',
    majorCategoryId: 'natural-powders',
    majorCategoryName: 'Natural Powders',
    image: 'https://images.unsplash.com/photo-1577069808021-764f691d5757?auto=format&fit=crop&w=600&q=80',
    tag: '100% Natural Fruit Extracts',
    shortDesc: 'Pure concentrated fruit powders packed with natural polyphenols, antioxidants, and authentic taste.'
  },
  'vegetable-powder': {
    id: 'vegetable-powder',
    name: 'Vegetable Powder',
    title: 'Vegetable Powder',
    majorCategoryId: 'natural-powders',
    majorCategoryName: 'Natural Powders',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    tag: 'Farm-Fresh Green Vitality',
    shortDesc: 'Nutrient-dense dehydrated vegetable powders ideal for daily wellness, cooking, and smoothies.'
  },
  'dairy-alternatives': {
    id: 'dairy-alternatives',
    name: 'Dairy Alternatives',
    title: 'Dairy Alternatives',
    majorCategoryId: 'natural-powders',
    majorCategoryName: 'Natural Powders',
    image: 'https://images.unsplash.com/photo-1568651316521-1d5d1c44dfa8?auto=format&fit=crop&w=600&q=80',
    tag: 'Plant-Based • Lactose Free',
    shortDesc: 'Pure plant-based powders including spray-dried coconut milk, almond milk, and creamy oat milk powder.'
  },
  'live-harvested-microgreens': {
    id: 'live-harvested-microgreens',
    name: 'Live Harvested Microgreens',
    title: 'Live Harvested Microgreens',
    majorCategoryId: 'microgreens-seed',
    majorCategoryName: 'Microgreens & Seeds',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    tag: 'Living Trays • 40x Nutrients',
    shortDesc: 'Nutrient-packed living microgreens harvested fresh on order for maximum enzyme vitality.'
  },
  'seeds': {
    id: 'seeds',
    name: 'Seeds',
    title: 'Seeds',
    majorCategoryId: 'microgreens-seed',
    majorCategoryName: 'Microgreens & Seeds',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80',
    tag: 'Untreated • 96%+ Germination',
    shortDesc: 'Certified organic, high-germination microgreen and culinary sprouting seeds.'
  }
};

export const STANDARD_PRODUCTS = [
  {
    id: 'PROD-DAIRY-01',
    name: 'Pure Coconut Milk Powder',
    price: 340,
    unit: '250 GM',
    moq: '1 Pack',
    category: 'Dairy Alternatives',
    subCategory: 'Dairy Alternatives',
    majorCategory: 'Natural Powders',
    benefit: 'Rich, velvety vegan milk alternative spray-dried at low temperatures with MCTs. 100% plant-based and lactose-free.',
    image: 'https://images.unsplash.com/photo-1568651316521-1d5d1c44dfa8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PROD-DAIRY-02',
    name: 'Organic Almond Milk Powder',
    price: 490,
    unit: '200 GM',
    moq: '1 Pack',
    category: 'Dairy Alternatives',
    subCategory: 'Dairy Alternatives',
    majorCategory: 'Natural Powders',
    benefit: '100% whole blanched organic almonds ground into a soluble powder rich in vitamin E and natural healthy fats.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PROD-DAIRY-03',
    name: 'Creamy Oat Milk Powder',
    price: 290,
    unit: '250 GM',
    moq: '1 Pack',
    category: 'Dairy Alternatives',
    subCategory: 'Dairy Alternatives',
    majorCategory: 'Natural Powders',
    benefit: 'Naturally sweet and creamy oat powder with beta-glucan soluble fiber, perfect for coffee, tea, and smoothies.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PROD-FRUIT-01',
    name: 'Wild Blueberry & Amla Extract Powder',
    price: 360,
    unit: '150 GM',
    moq: '1 Pack',
    category: 'Fruit Powder',
    subCategory: 'Fruit Powder',
    majorCategory: 'Natural Powders',
    benefit: 'High-potency antioxidant fruit powder dried below 40°C to preserve vitamin C and natural bioflavonoids.',
    image: 'https://images.unsplash.com/photo-1577069808021-764f691d5757?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PROD-VEG-01',
    name: 'Beetroot & Spinach Vitality Powder',
    price: 260,
    unit: '200 GM',
    moq: '1 Pack',
    category: 'Vegetable Powder',
    subCategory: 'Vegetable Powder',
    majorCategory: 'Natural Powders',
    benefit: 'Rich in dietary nitrates and iron, supporting natural stamina, circulation, and daily cardiovascular vitality.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PROD-MICRO-01',
    name: 'Live Radish & Sunflower Microgreens Tray',
    price: 180,
    unit: '1 Live Tray',
    moq: '1 Tray',
    category: 'Live Harvested Microgreens',
    subCategory: 'Live Harvested Microgreens',
    majorCategory: 'Microgreens & Seeds',
    benefit: 'Living organic microgreens harvested live on demand with 40x the vitamin concentration of adult vegetables.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PROD-SEED-01',
    name: 'Broccoli Sprouting Seeds (Calabrese)',
    price: 220,
    unit: '150 GM',
    moq: '1 Pack',
    category: 'Seeds',
    subCategory: 'Seeds',
    majorCategory: 'Microgreens & Seeds',
    benefit: 'Laboratory tested 98% germination rate. High sulforaphane yield for home sprouting and commercial microgreen trays.',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80'
  }
];

// Seed the user requested hierarchy if not initialized yet
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('krishi_hierarchy_initialized_v2') !== 'true') {
      localStorage.setItem('krishi_major_categories', JSON.stringify(STANDARD_MAJOR_CATEGORIES));
      localStorage.setItem('krishi_custom_categories', JSON.stringify(STANDARD_SUB_CATEGORIES));
      localStorage.setItem('krishi_category_configs', JSON.stringify(STANDARD_CATEGORY_CONFIGS));
      const existingProds = localStorage.getItem('krishi_local_products');
      if (!existingProds || existingProds === '[]' || existingProds === 'null') {
        localStorage.setItem('krishi_local_products', JSON.stringify(STANDARD_PRODUCTS));
      }
      localStorage.setItem('krishi_hierarchy_initialized_v2', 'true');
    }
  } catch {}
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_local_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const savedCats = localStorage.getItem('krishi_custom_categories');
      if (savedCats) {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Major Categories State (e.g. "Natural Powders", "Microgreens & Seeds")
  const [majorCategories, setMajorCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_major_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const saveMajorCategoriesList = (newMajors) => {
    setMajorCategories(newMajors);
    try {
      localStorage.setItem('krishi_major_categories', JSON.stringify(newMajors));
    } catch (e) {
      console.warn('Failed to save major categories to localStorage:', e);
    }
  };

  const addMajorCategory = (majorData) => {
    const rawName = typeof majorData === 'string' ? majorData : majorData?.name;
    const trimmed = (rawName || '').trim();
    if (!trimmed) return false;

    const id = (typeof majorData === 'object' && majorData?.id)
      ? majorData.id
      : trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const exists = majorCategories.some(m => m.id === id || m.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;

    const newMajor = {
      id,
      name: trimmed,
      title: trimmed,
      description: (typeof majorData === 'object' && majorData?.description) ? majorData.description : '',
      image: (typeof majorData === 'object' && majorData?.image) ? majorData.image : '',
      createdAt: new Date().toISOString()
    };

    const updated = [...majorCategories, newMajor];
    saveMajorCategoriesList(updated);
    return newMajor;
  };

  const updateMajorCategory = (id, updatedFields) => {
    const updated = majorCategories.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    saveMajorCategoriesList(updated);
  };

  const deleteMajorCategory = (identifier) => {
    if (!identifier) return false;
    const majorObj = typeof identifier === 'object' ? identifier : null;
    const rawVal = typeof identifier === 'string' 
      ? identifier 
      : (majorObj?.id || majorObj?.name || majorObj?.title || '');
    const targetId = (rawVal || '').toString().trim().toLowerCase();
    const slug = targetId.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const updated = (majorCategories || []).filter(m => {
      const mId = (m.id || '').toLowerCase().trim();
      const mName = (m.name || m.title || '').toLowerCase().trim();
      const mSlug = mName.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return mId !== targetId && mName !== targetId && mSlug !== slug && mId !== slug;
    });
    saveMajorCategoriesList(updated);

    // Also unassign majorCategoryId from subcategories if attached
    const updatedConfigs = { ...categoryConfigs };
    let configsChanged = false;
    Object.keys(updatedConfigs).forEach(catKey => {
      const cfg = updatedConfigs[catKey];
      const parentId = (cfg?.majorCategoryId || '').toLowerCase().trim();
      const parentName = (cfg?.majorCategoryName || '').toLowerCase().trim();
      if (parentId === targetId || parentId === slug || parentName === targetId) {
        updatedConfigs[catKey] = {
          ...updatedConfigs[catKey],
          majorCategoryId: null,
          majorCategoryName: null
        };
        configsChanged = true;
      }
    });
    if (configsChanged) {
      setCategoryConfigs(updatedConfigs);
      try {
        localStorage.setItem('krishi_category_configs', JSON.stringify(updatedConfigs));
      } catch {}
    }
    return true;
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load custom rich category configs (metadata like image, desc, benefits)
  const [categoryConfigs, setCategoryConfigs] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_category_configs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      }
    } catch {}
    return {};
  });

  // Helper to persist categories
  const saveCategoriesList = (newCategories, newConfigs = categoryConfigs) => {
    setCustomCategories(newCategories);
    setCategoryConfigs(newConfigs);
    try {
      localStorage.setItem('krishi_custom_categories', JSON.stringify(newCategories));
      localStorage.setItem('krishi_category_configs', JSON.stringify(newConfigs));
    } catch (e) {
      console.warn('Failed to save categories to localStorage:', e);
    }
  };

  const addCategory = (categoryData) => {
    // categoryData can be string or object { name, image, shortDesc, letter, tag, benefits }
    const name = typeof categoryData === 'string' ? categoryData : (categoryData?.name || categoryData?.title);
    const trimmed = (name || '').trim();
    if (!trimmed) return false;

    const catId = (typeof categoryData === 'object' && categoryData?.id)
      ? categoryData.id 
      : trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const exists = customCategories.some(c => {
      const cStr = typeof c === 'string' ? c : (c?.name || c?.title || '');
      return (cStr || '').trim().toLowerCase() === trimmed.toLowerCase();
    });
    const updatedList = exists ? customCategories : [...customCategories, trimmed];
    let updatedConfigs = { ...categoryConfigs };

    if (typeof categoryData === 'object' && categoryData !== null) {
      updatedConfigs[catId] = {
        ...categoryData,
        id: catId,
        title: trimmed,
        name: trimmed
      };
    } else if (!updatedConfigs[catId]) {
      updatedConfigs[catId] = {
        id: catId,
        title: trimmed,
        name: trimmed
      };
    }

    saveCategoriesList(updatedList, updatedConfigs);
    return true;
  };

  const updateCategoryConfig = (catId, updatedFields) => {
    const updated = {
      ...categoryConfigs,
      [catId]: {
        ...(categoryConfigs[catId] || {}),
        ...updatedFields
      }
    };
    setCategoryConfigs(updated);
    try {
      localStorage.setItem('krishi_category_configs', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save category config:', e);
    }
  };

  const deleteCategory = (identifier) => {
    if (!identifier) return false;
    const catObj = typeof identifier === 'object' ? identifier : null;
    const rawVal = typeof identifier === 'string' 
      ? identifier 
      : (catObj?.id || catObj?.title || catObj?.name || '');
    const trimmed = (rawVal || '').toString().trim().toLowerCase();
    const explicitId = (catObj?.id || '').toString().trim().toLowerCase();
    const slug = (catObj?.id || trimmed).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const altSlug = trimmed.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // 1. Filter out from customCategories safely
    const updatedList = (customCategories || []).filter(c => {
      if (!c) return false;
      const cStr = typeof c === 'string' ? c : (c?.name || c?.title || c?.id || '');
      const cTrimmed = (cStr || '').trim().toLowerCase();
      const cSlug = cTrimmed.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const cExplicitId = (typeof c === 'object' && c?.id ? c.id : '').toLowerCase().trim();

      // Check matches
      if (cTrimmed === trimmed || cSlug === slug || cSlug === altSlug || cTrimmed === slug) return false;
      if (explicitId && (cExplicitId === explicitId || cSlug === explicitId || cTrimmed === explicitId)) return false;
      if (cExplicitId && (cExplicitId === slug || cExplicitId === trimmed)) return false;
      return true;
    });

    // 2. Remove from categoryConfigs
    const updatedConfigs = { ...categoryConfigs };
    Object.keys(updatedConfigs).forEach(key => {
      const cfg = updatedConfigs[key];
      const kLower = key.toLowerCase().trim();
      const cfgId = (cfg?.id || '').toLowerCase().trim();
      const cfgTitle = (cfg?.title || cfg?.name || '').toLowerCase().trim();
      const cfgSlug = cfgTitle.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (
        kLower === trimmed ||
        kLower === slug ||
        kLower === altSlug ||
        (explicitId && kLower === explicitId) ||
        (cfgId && (cfgId === explicitId || cfgId === slug || cfgId === trimmed)) ||
        (cfgTitle && (cfgTitle === trimmed || cfgSlug === slug))
      ) {
        delete updatedConfigs[key];
      }
    });

    saveCategoriesList(updatedList, updatedConfigs);
    return true;
  };

  const resetCategories = () => {
    saveCategoriesList([], {});
  };

  const clearAllCategories = () => {
    saveCategoriesList([], {});
  };

  // Purely dynamic produce collections - only categories created by user are shown
  const showcaseCategories = useMemo(() => {
    return (customCategories || []).map((catItem, idx) => {
      const catName = typeof catItem === 'string' ? catItem : (catItem?.title || catItem?.name || '');
      const trimmed = (catName || '').trim();
      const id = (typeof catItem === 'object' && catItem?.id)
        ? catItem.id
        : trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const customConfig = categoryConfigs[id] || (typeof catItem === 'object' ? catItem : {});
      return createCategoryConfigItem(trimmed, customConfig, idx);
    }).filter(c => Boolean(c.title));
  }, [customCategories, categoryConfigs]);

  // Sync products with Supabase or LocalStorage
  useEffect(() => {
    let supabaseChannel = null;

    if (isSupabaseConfigured && supabase) {
      const fetchSupabaseProducts = async () => {
        try {
          // One-time purge of all products in Supabase so user can start with a clean slate
          if (localStorage.getItem('krishi_purged_all_products_v3') !== 'true') {
            try {
              await supabase.from('products').delete().neq('id', 'null');
            } catch (pErr) {
              console.warn('Supabase purge notice:', pErr);
            }
            localStorage.setItem('krishi_purged_all_products_v3', 'true');
          }

          const { data, error: sbError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (sbError) throw sbError;

          if (data) {
            setProducts(data);
            try {
              localStorage.setItem('krishi_local_products', JSON.stringify(data));
            } catch {}
          }
        } catch (err) {
          console.warn('Supabase products fetch notice, using local products:', err);
          try {
            const saved = localStorage.getItem('krishi_local_products');
            if (saved) setProducts(JSON.parse(saved));
            else setProducts([]);
          } catch {
            setProducts([]);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchSupabaseProducts();

      // Realtime subscription for Supabase
      try {
        supabaseChannel = supabase
          .channel('public:products')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (data) {
              setProducts(data);
              try {
                localStorage.setItem('krishi_local_products', JSON.stringify(data));
              } catch {}
            }
          })
          .subscribe();
      } catch (subErr) {
        console.warn('Supabase realtime channel subscription notice:', subErr);
      }
    } else {
      // Local storage
      try {
        const saved = localStorage.getItem('krishi_local_products');
        if (saved) {
          setProducts(JSON.parse(saved));
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      }
      setLoading(false);
    }

    return () => {
      if (supabaseChannel && supabase) supabase.removeChannel(supabaseChannel);
    };
  }, []);

  // Save to local storage whenever products change
  const persistLocally = (newProducts) => {
    try {
      localStorage.setItem('krishi_local_products', JSON.stringify(newProducts));
    } catch (e) {
      console.warn('Failed to save products to localStorage:', e);
    }
  };

  // Add Product
  const addProduct = async (productData) => {
    const generatedId = productData.id || `PROD-${Date.now()}`;
    const newProduct = {
      id: generatedId,
      name: productData.name || 'New Produce Item',
      price: productData.price !== undefined ? Number(productData.price) : 0,
      unit: productData.unit || '100 GM',
      moq: productData.moq || '1 Pack',
      category: productData.category || (customCategories[0] || 'General Produce'),
      benefit: productData.benefit || 'Pure, nutrient-dense organic harvest cultivated with zero chemical pesticides.',
      image: productData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    };

    setProducts(prev => {
      const updated = [newProduct, ...prev.filter(p => p.id !== generatedId)];
      persistLocally(updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').insert([newProduct]);
      } catch (err) {
        console.error('Error adding product to Supabase:', err);
      }
    }

    return newProduct;
  };

  // Update Product
  const updateProduct = async (id, updatedFields) => {
    const cleanData = { ...updatedFields };
    if (cleanData.price !== undefined) {
      cleanData.price = Number(cleanData.price);
    }

    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...cleanData } : p);
      persistLocally(updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').update(cleanData).eq('id', id);
      } catch (err) {
        console.error('Error updating product in Supabase:', err);
      }
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      persistLocally(updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting product from Supabase:', err);
      }
    }
  };

  // Reset / Clear all products
  const clearAllProducts = async () => {
    setProducts([]);
    persistLocally([]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().neq('id', 'null');
      } catch (err) {
        console.error('Error clearing Supabase catalog:', err);
      }
    }
  };

  const resetToDefaultCatalog = clearAllProducts;

  const seedStandardHierarchy = async () => {
    saveMajorCategoriesList(STANDARD_MAJOR_CATEGORIES);
    saveCategoriesList(STANDARD_SUB_CATEGORIES, STANDARD_CATEGORY_CONFIGS);
    setProducts(STANDARD_PRODUCTS);
    persistLocally(STANDARD_PRODUCTS);
    try {
      localStorage.setItem('krishi_hierarchy_initialized_v2', 'true');
    } catch {}
    return true;
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories: customCategories,
      customCategories,
      categoryConfigs,
      showcaseCategories,
      majorCategories,
      addMajorCategory,
      updateMajorCategory,
      deleteMajorCategory,
      seedStandardHierarchy,
      addCategory,
      updateCategoryConfig,
      deleteCategory,
      resetCategories,
      clearAllCategories,
      clearAllProducts,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefaultCatalog
    }}>
      {children}
    </ProductContext.Provider>
  );
};
