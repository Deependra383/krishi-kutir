import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from '../firebase';
import { supabase, isSupabaseConfigured } from '../supabase';
import { ALL_PRODUCTS_LIST } from '../data';

const ProductContext = createContext(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(ALL_PRODUCTS_LIST);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync products with Supabase or Firestore
  useEffect(() => {
    let unsubscribeFirestore = null;
    let supabaseChannel = null;

    if (isSupabaseConfigured && supabase) {
      // 1. Fetch from Supabase
      const fetchSupabaseProducts = async () => {
        try {
          const { data, error: sbError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (sbError) throw sbError;

          if (data && data.length > 0) {
            setProducts(data);
          } else {
            // Seed initial data to Supabase if empty
            const hasBeenSeeded = localStorage.getItem('krishi_sb_catalog_seeded');
            if (!hasBeenSeeded) {
              localStorage.setItem('krishi_sb_catalog_seeded', 'true');
              await supabase.from('products').upsert(ALL_PRODUCTS_LIST);
            }
            setProducts(ALL_PRODUCTS_LIST);
          }
        } catch (err) {
          console.warn('Supabase products fetch failed, falling back to local/Firestore:', err);
          setProducts(ALL_PRODUCTS_LIST);
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
            if (data) setProducts(data);
          })
          .subscribe();
      } catch (subErr) {
        console.warn('Supabase realtime channel subscription notice:', subErr);
      }

    } else {
      // 2. Firestore Sync fallback
      const productsRef = collection(db, 'products');

      unsubscribeFirestore = onSnapshot(productsRef, async (snapshot) => {
        if (snapshot.empty) {
          const hasBeenSeeded = localStorage.getItem('krishi_catalog_initialized');
          if (!hasBeenSeeded) {
            localStorage.setItem('krishi_catalog_initialized', 'true');
            try {
              for (const item of ALL_PRODUCTS_LIST) {
                const productDoc = doc(db, 'products', item.id);
                await setDoc(productDoc, {
                  ...item,
                  createdAt: serverTimestamp()
                });
              }
            } catch (seedErr) {
              console.error('Error auto-seeding products to Firestore:', seedErr);
              setProducts(ALL_PRODUCTS_LIST);
            }
          } else {
            setProducts([]);
          }
        } else {
          localStorage.setItem('krishi_catalog_initialized', 'true');
          const productList = [];
          snapshot.forEach((docSnap) => {
            productList.push({
              id: docSnap.id,
              ...docSnap.data()
            });
          });
          setProducts(productList);
        }
        setLoading(false);
      }, (err) => {
        console.warn('Firestore real-time subscription error, using local catalog:', err);
        setProducts(ALL_PRODUCTS_LIST);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      if (supabaseChannel && supabase) supabase.removeChannel(supabaseChannel);
    };
  }, []);

  // Add Product
  const addProduct = async (productData) => {
    const generatedId = productData.id || `PROD-${Date.now()}`;
    const newProduct = {
      id: generatedId,
      name: productData.name || 'New Superfood Product',
      price: Number(productData.price) || 100,
      unit: productData.unit || '100 GM',
      moq: productData.moq || '1 Pack',
      category: productData.category || 'Microgreens Seeds',
      benefit: productData.benefit || 'Rich natural wellness superfood.',
      image: productData.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    };

    // Optimistic update
    setProducts(prev => [newProduct, ...prev.filter(p => p.id !== generatedId)]);

    // Write to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').insert([newProduct]);
      } catch (err) {
        console.error('Error adding product to Supabase:', err);
      }
    }

    // Write to Firestore as backup
    try {
      const productRef = doc(db, 'products', generatedId);
      await setDoc(productRef, {
        ...newProduct,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore backup sync notice:', err);
    }

    return newProduct;
  };

  // Update Product
  const updateProduct = async (id, updatedFields) => {
    const cleanData = { ...updatedFields };
    if (cleanData.price !== undefined) {
      cleanData.price = Number(cleanData.price);
    }
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...cleanData } : p));

    // Update in Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').update(cleanData).eq('id', id);
      } catch (err) {
        console.error('Error updating product in Supabase:', err);
      }
    }

    // Update in Firestore
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...cleanData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore update sync notice:', err);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    // Optimistically remove from state immediately
    setProducts(prev => prev.filter(p => p.id !== id));

    // Delete in Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting product from Supabase:', err);
      }
    }

    // Delete in Firestore
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
    } catch (err) {
      console.warn('Firestore delete sync notice:', err);
    }
  };

  // Reset to default catalogue
  const resetToDefaultCatalog = async () => {
    setProducts(ALL_PRODUCTS_LIST);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().neq('id', 'null');
        await supabase.from('products').upsert(ALL_PRODUCTS_LIST);
      } catch (err) {
        console.error('Error resetting Supabase catalog:', err);
      }
    }

    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, 'products', docSnap.id));
      }
      for (const item of ALL_PRODUCTS_LIST) {
        await setDoc(doc(db, 'products', item.id), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn('Error resetting Firestore catalog:', err);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
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
