import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { createCategoryConfigItem } from '../data/categoriesConfig';

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

// ---------------------------------------------------------------------------
// Storage helpers
// Supabase is the single source of truth. localStorage is only a cache for a
// fast first paint (and the full store when Supabase isn't configured).
// ---------------------------------------------------------------------------
const USE_CLOUD = Boolean(isSupabaseConfigured && supabase);

const LS_KEYS = {
  products: 'krishi_local_products',
  majors: 'krishi_major_categories',
  cats: 'krishi_custom_categories',
  configs: 'krishi_category_configs'
};

// Rows in the Supabase `site_settings` table
const SETTINGS_KEYS = {
  majors: 'major_categories',
  cats: 'custom_categories',
  configs: 'category_configs'
};

const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

const readLS = (key, fallback, isValid) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValid(parsed)) return parsed;
    }
  } catch {}
  return fallback;
};

const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to cache ${key}:`, e);
  }
};

const isNonEmpty = (v) => (Array.isArray(v) ? v.length > 0 : isObj(v) && Object.keys(v).length > 0);

// Only these columns are sent to the `products` table
const PRODUCT_COLUMNS = ['id', 'name', 'price', 'unit', 'moq', 'category', 'subCategory', 'majorCategory', 'benefit', 'image'];

const toProductRow = (p) => {
  const row = {};
  PRODUCT_COLUMNS.forEach((col) => {
    if (p[col] !== undefined) row[col] = p[col];
  });
  if (row.price !== undefined) row.price = Number(row.price) || 0;
  return row;
};

const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Local-only mode (no Supabase): seed the starter hierarchy once per browser
if (typeof window !== 'undefined' && !USE_CLOUD) {
  try {
    if (localStorage.getItem('krishi_hierarchy_initialized_v2') !== 'true') {
      writeLS(LS_KEYS.majors, STANDARD_MAJOR_CATEGORIES);
      writeLS(LS_KEYS.cats, STANDARD_SUB_CATEGORIES);
      writeLS(LS_KEYS.configs, STANDARD_CATEGORY_CONFIGS);
      const existingProds = localStorage.getItem(LS_KEYS.products);
      if (!existingProds || existingProds === '[]' || existingProds === 'null') {
        writeLS(LS_KEYS.products, STANDARD_PRODUCTS);
      }
      localStorage.setItem('krishi_hierarchy_initialized_v2', 'true');
    }
  } catch {}
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => readLS(LS_KEYS.products, [], Array.isArray));
  const [customCategories, setCustomCategories] = useState(() => readLS(LS_KEYS.cats, [], Array.isArray));
  const [majorCategories, setMajorCategories] = useState(() => readLS(LS_KEYS.majors, [], Array.isArray));
  const [categoryConfigs, setCategoryConfigs] = useState(() => readLS(LS_KEYS.configs, {}, isObj));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Latest values, so async rollbacks restore the right snapshot
  const productsRef = useRef(products);
  const settingsRef = useRef({ majors: majorCategories, cats: customCategories, configs: categoryConfigs });
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => {
    settingsRef.current = { majors: majorCategories, cats: customCategories, configs: categoryConfigs };
  }, [majorCategories, customCategories, categoryConfigs]);

  const setProductsAndCache = (list) => {
    productsRef.current = list;
    setProducts(list);
    writeLS(LS_KEYS.products, list);
  };

  // Apply any of { majors, cats, configs } to state + cache
  const applySettingsLocally = (changes) => {
    const next = { ...settingsRef.current };
    if ('majors' in changes) {
      next.majors = changes.majors;
      setMajorCategories(changes.majors);
      writeLS(LS_KEYS.majors, changes.majors);
    }
    if ('cats' in changes) {
      next.cats = changes.cats;
      setCustomCategories(changes.cats);
      writeLS(LS_KEYS.cats, changes.cats);
    }
    if ('configs' in changes) {
      next.configs = changes.configs;
      setCategoryConfigs(changes.configs);
      writeLS(LS_KEYS.configs, changes.configs);
    }
    settingsRef.current = next;
  };

  // Optimistic save of category settings to Supabase, rolled back on failure
  const persistSettings = async (changes) => {
    const previous = {};
    Object.keys(changes).forEach((k) => { previous[k] = settingsRef.current[k]; });
    applySettingsLocally(changes);
    if (!USE_CLOUD) return true;

    const now = new Date().toISOString();
    const rows = Object.entries(changes).map(([k, value]) => ({ key: SETTINGS_KEYS[k], value, updated_at: now }));
    const { error: sbError } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    if (sbError) {
      console.error('Failed to save categories to Supabase:', sbError);
      applySettingsLocally(previous);
      setError(sbError.message);
      return false;
    }
    setError(null);
    return true;
  };

  // ---------------------------------------------------------------------------
  // Loading from Supabase
  // ---------------------------------------------------------------------------
  const loadSettings = async ({ seedIfMissing = false } = {}) => {
    const { data, error: sbError } = await supabase.from('site_settings').select('key, value');
    if (sbError) throw sbError;

    const byKey = {};
    (data || []).forEach((row) => { byKey[row.key] = row.value; });

    const found = {};
    const missing = {};
    Object.entries(SETTINGS_KEYS).forEach(([local, remote]) => {
      if (byKey[remote] !== undefined && byKey[remote] !== null) {
        found[local] = byKey[remote];
      } else if (seedIfMissing) {
        // First run after the fix: push this browser's categories up (or the starter set)
        const cached = settingsRef.current[local];
        const starter = local === 'majors' ? STANDARD_MAJOR_CATEGORIES
          : local === 'cats' ? STANDARD_SUB_CATEGORIES
          : STANDARD_CATEGORY_CONFIGS;
        missing[local] = isNonEmpty(cached) ? cached : starter;
      }
    });

    if (Object.keys(found).length) applySettingsLocally(found);

    const wasMissing = Object.keys(missing).length > 0;
    if (wasMissing) {
      const now = new Date().toISOString();
      const rows = Object.entries(missing).map(([k, value]) => ({ key: SETTINGS_KEYS[k], value, updated_at: now }));
      // ignoreDuplicates: never overwrite rows another device created a moment ago
      const { error: seedErr } = await supabase
        .from('site_settings')
        .upsert(rows, { onConflict: 'key', ignoreDuplicates: true });
      if (seedErr) throw seedErr;
      applySettingsLocally(missing);
    }
    return wasMissing;
  };

  const loadProducts = async ({ migrateLocal = false } = {}) => {
    const { data, error: sbError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (sbError) throw sbError;

    if ((data || []).length === 0 && migrateLocal && productsRef.current.length > 0) {
      // Cloud catalog is empty on the very first run: upload this browser's products
      const rows = productsRef.current.map(toProductRow);
      const { error: upErr } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
      if (upErr) throw upErr;
      return loadProducts();
    }

    setProductsAndCache(data || []);
  };

  useEffect(() => {
    if (!USE_CLOUD) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    let channel = null;

    const init = async () => {
      try {
        const firstRun = await loadSettings({ seedIfMissing: true });
        if (cancelled) return;
        await loadProducts({ migrateLocal: firstRun });
        if (!cancelled) setError(null);
      } catch (err) {
        console.error('Supabase sync failed, showing cached data:', err);
        if (!cancelled) setError(err?.message || 'Could not reach Supabase');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    // Realtime: changes made on any device/account show up everywhere
    try {
      channel = supabase
        .channel('krishi-catalog-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          loadProducts().catch((e) => console.warn('Realtime products refresh failed:', e));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
          loadSettings().catch((e) => console.warn('Realtime categories refresh failed:', e));
        })
        .subscribe();
    } catch (subErr) {
      console.warn('Supabase realtime subscription notice:', subErr);
    }

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Major categories
  // ---------------------------------------------------------------------------
  const saveMajorCategoriesList = (newMajors) => persistSettings({ majors: newMajors });

  const addMajorCategory = (majorData) => {
    const rawName = typeof majorData === 'string' ? majorData : majorData?.name;
    const trimmed = (rawName || '').trim();
    if (!trimmed) return false;

    const id = (typeof majorData === 'object' && majorData?.id) ? majorData.id : slugify(trimmed);

    const exists = majorCategories.some(m => m.id === id || (m.name || '').toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;

    const newMajor = {
      id,
      name: trimmed,
      title: trimmed,
      description: (typeof majorData === 'object' && majorData?.description) ? majorData.description : '',
      image: (typeof majorData === 'object' && majorData?.image) ? majorData.image : '',
      createdAt: new Date().toISOString()
    };

    saveMajorCategoriesList([...majorCategories, newMajor]);
    return newMajor;
  };

  const updateMajorCategory = (id, updatedFields) => {
    saveMajorCategoriesList(majorCategories.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const deleteMajorCategory = (identifier) => {
    if (!identifier) return false;
    const majorObj = typeof identifier === 'object' ? identifier : null;
    const rawVal = typeof identifier === 'string'
      ? identifier
      : (majorObj?.id || majorObj?.name || majorObj?.title || '');
    const targetId = (rawVal || '').toString().trim().toLowerCase();
    const slug = slugify(targetId);

    const updatedMajors = (majorCategories || []).filter(m => {
      const mId = (m.id || '').toLowerCase().trim();
      const mName = (m.name || m.title || '').toLowerCase().trim();
      const mSlug = slugify(mName);
      return mId !== targetId && mName !== targetId && mSlug !== slug && mId !== slug;
    });

    // Also unassign majorCategoryId from subcategories if attached
    const updatedConfigs = { ...categoryConfigs };
    let configsChanged = false;
    Object.keys(updatedConfigs).forEach(catKey => {
      const cfg = updatedConfigs[catKey];
      const parentId = (cfg?.majorCategoryId || '').toLowerCase().trim();
      const parentName = (cfg?.majorCategoryName || '').toLowerCase().trim();
      if (parentId === targetId || parentId === slug || parentName === targetId) {
        updatedConfigs[catKey] = { ...cfg, majorCategoryId: null, majorCategoryName: null };
        configsChanged = true;
      }
    });

    persistSettings(configsChanged
      ? { majors: updatedMajors, configs: updatedConfigs }
      : { majors: updatedMajors });
    return true;
  };

  // ---------------------------------------------------------------------------
  // Sub-categories
  // ---------------------------------------------------------------------------
  const saveCategoriesList = (newCategories, newConfigs = categoryConfigs) =>
    persistSettings({ cats: newCategories, configs: newConfigs });

  const addCategory = (categoryData) => {
    // categoryData can be string or object { name, image, shortDesc, letter, tag, benefits }
    const name = typeof categoryData === 'string' ? categoryData : (categoryData?.name || categoryData?.title);
    const trimmed = (name || '').trim();
    if (!trimmed) return false;

    const catId = (typeof categoryData === 'object' && categoryData?.id) ? categoryData.id : slugify(trimmed);

    const exists = customCategories.some(c => {
      const cStr = typeof c === 'string' ? c : (c?.name || c?.title || '');
      return (cStr || '').trim().toLowerCase() === trimmed.toLowerCase();
    });
    const updatedList = exists ? customCategories : [...customCategories, trimmed];
    const updatedConfigs = { ...categoryConfigs };

    if (typeof categoryData === 'object' && categoryData !== null) {
      updatedConfigs[catId] = { ...categoryData, id: catId, title: trimmed, name: trimmed };
    } else if (!updatedConfigs[catId]) {
      updatedConfigs[catId] = { id: catId, title: trimmed, name: trimmed };
    }

    saveCategoriesList(updatedList, updatedConfigs);
    return true;
  };

  const updateCategoryConfig = (catId, updatedFields) => {
    persistSettings({
      configs: {
        ...categoryConfigs,
        [catId]: { ...(categoryConfigs[catId] || {}), ...updatedFields }
      }
    });
  };

  const deleteCategory = (identifier) => {
    if (!identifier) return false;
    const catObj = typeof identifier === 'object' ? identifier : null;
    const rawVal = typeof identifier === 'string'
      ? identifier
      : (catObj?.id || catObj?.title || catObj?.name || '');
    const trimmed = (rawVal || '').toString().trim().toLowerCase();
    const explicitId = (catObj?.id || '').toString().trim().toLowerCase();
    const slug = slugify(catObj?.id || trimmed);
    const altSlug = slugify(trimmed);

    // 1. Filter out from customCategories safely
    const updatedList = (customCategories || []).filter(c => {
      if (!c) return false;
      const cStr = typeof c === 'string' ? c : (c?.name || c?.title || c?.id || '');
      const cTrimmed = (cStr || '').trim().toLowerCase();
      const cSlug = slugify(cTrimmed);
      const cExplicitId = (typeof c === 'object' && c?.id ? c.id : '').toLowerCase().trim();

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
      const cfgSlug = slugify(cfgTitle);

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

  const resetCategories = () => saveCategoriesList([], {});
  const clearAllCategories = () => saveCategoriesList([], {});

  // Purely dynamic produce collections - only categories created by user are shown
  const showcaseCategories = useMemo(() => {
    return (customCategories || []).map((catItem, idx) => {
      const catName = typeof catItem === 'string' ? catItem : (catItem?.title || catItem?.name || '');
      const trimmed = (catName || '').trim();
      const id = (typeof catItem === 'object' && catItem?.id) ? catItem.id : slugify(trimmed);
      const customConfig = categoryConfigs[id] || (typeof catItem === 'object' ? catItem : {});
      return createCategoryConfigItem(trimmed, customConfig, idx);
    }).filter(c => Boolean(c.title));
  }, [customCategories, categoryConfigs]);

  // ---------------------------------------------------------------------------
  // Products (optimistic update, rollback if Supabase rejects)
  // ---------------------------------------------------------------------------
  const failProducts = (previous, sbError, action) => {
    console.error(`Error ${action} in Supabase:`, sbError);
    setProductsAndCache(previous);
    setError(sbError.message);
    throw new Error(`Could not ${action}: ${sbError.message}`);
  };

  const addProduct = async (productData) => {
    const generatedId = productData.id || `PROD-${Date.now()}`;
    const firstCat = customCategories[0];
    const firstCatName = typeof firstCat === 'string' ? firstCat : (firstCat?.name || firstCat?.title);
    const newProduct = {
      id: generatedId,
      name: productData.name || 'New Produce Item',
      price: productData.price !== undefined ? Number(productData.price) : 0,
      unit: productData.unit || '100 GM',
      moq: productData.moq || '1 Pack',
      category: productData.category || firstCatName || 'General Produce',
      subCategory: productData.subCategory || productData.category || null,
      majorCategory: productData.majorCategory || null,
      benefit: productData.benefit || 'Pure, nutrient-dense organic harvest cultivated with zero chemical pesticides.',
      image: productData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    };

    const previous = productsRef.current;
    setProductsAndCache([newProduct, ...previous.filter(p => p.id !== generatedId)]);

    if (USE_CLOUD) {
      const { error: sbError } = await supabase.from('products').upsert([toProductRow(newProduct)], { onConflict: 'id' });
      if (sbError) failProducts(previous, sbError, 'add product');
    }
    return newProduct;
  };

  const updateProduct = async (id, updatedFields) => {
    const cleanData = toProductRow(updatedFields);
    delete cleanData.id;

    const previous = productsRef.current;
    setProductsAndCache(previous.map(p => p.id === id ? { ...p, ...cleanData } : p));

    if (USE_CLOUD) {
      const { error: sbError } = await supabase.from('products').update(cleanData).eq('id', id);
      if (sbError) failProducts(previous, sbError, 'update product');
    }
  };

  const deleteProduct = async (id) => {
    const previous = productsRef.current;
    setProductsAndCache(previous.filter(p => p.id !== id));

    if (USE_CLOUD) {
      const { error: sbError } = await supabase.from('products').delete().eq('id', id);
      if (sbError) failProducts(previous, sbError, 'delete product');
    }
  };

  // Reset / Clear all products (only runs when the admin clicks it)
  const clearAllProducts = async () => {
    const previous = productsRef.current;
    setProductsAndCache([]);

    if (USE_CLOUD) {
      const { error: sbError } = await supabase.from('products').delete().neq('id', '__none__');
      if (sbError) failProducts(previous, sbError, 'clear catalog');
    }
  };

  const resetToDefaultCatalog = clearAllProducts;

  const seedStandardHierarchy = async () => {
    const ok = await persistSettings({
      majors: STANDARD_MAJOR_CATEGORIES,
      cats: STANDARD_SUB_CATEGORIES,
      configs: STANDARD_CATEGORY_CONFIGS
    });
    if (!ok) return false;

    const previous = productsRef.current;
    setProductsAndCache(STANDARD_PRODUCTS);
    if (USE_CLOUD) {
      const { error: sbError } = await supabase
        .from('products')
        .upsert(STANDARD_PRODUCTS.map(toProductRow), { onConflict: 'id' });
      if (sbError) failProducts(previous, sbError, 'seed products');
      await loadProducts();
    }
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