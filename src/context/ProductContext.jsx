import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { ALL_PRODUCTS_LIST } from '../data';

const ProductContext = createContext(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_local_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ALL_PRODUCTS_LIST;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync products with Supabase or LocalStorage
  useEffect(() => {
    let supabaseChannel = null;

    if (isSupabaseConfigured && supabase) {
      const fetchSupabaseProducts = async () => {
        try {
          const { data, error: sbError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (sbError) throw sbError;

          if (data && data.length > 0) {
            // Check if any standard catalog products are missing in Supabase
            const existingIds = new Set(data.map(p => p.id));
            const missingCatalog = ALL_PRODUCTS_LIST.filter(p => !existingIds.has(p.id));
            
            if (missingCatalog.length > 0) {
              console.log(`Synchronizing ${missingCatalog.length} missing catalog products to Supabase...`);
              supabase.from('products').upsert(missingCatalog).then(() => {});
              const merged = [...data, ...missingCatalog];
              setProducts(merged);
              try {
                localStorage.setItem('krishi_local_products', JSON.stringify(merged));
              } catch {}
            } else {
              setProducts(data);
              try {
                localStorage.setItem('krishi_local_products', JSON.stringify(data));
              } catch {}
            }
          } else {
            // Seed all initial catalog products to Supabase if empty
            await supabase.from('products').upsert(ALL_PRODUCTS_LIST);
            setProducts(ALL_PRODUCTS_LIST);
            try {
              localStorage.setItem('krishi_local_products', JSON.stringify(ALL_PRODUCTS_LIST));
            } catch {}
          }
        } catch (err) {
          console.warn('Supabase products fetch failed, using local catalog:', err);
          try {
            const saved = localStorage.getItem('krishi_local_products');
            if (saved) setProducts(JSON.parse(saved));
            else setProducts(ALL_PRODUCTS_LIST);
          } catch {
            setProducts(ALL_PRODUCTS_LIST);
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
      // Local storage fallback
      try {
        const saved = localStorage.getItem('krishi_local_products');
        if (saved) {
          setProducts(JSON.parse(saved));
        } else {
          localStorage.setItem('krishi_local_products', JSON.stringify(ALL_PRODUCTS_LIST));
          setProducts(ALL_PRODUCTS_LIST);
        }
      } catch {
        setProducts(ALL_PRODUCTS_LIST);
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
      console.warn('LocalStorage save error:', e);
    }
  };

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

  // Reset to default catalogue
  const resetToDefaultCatalog = async () => {
    setProducts(ALL_PRODUCTS_LIST);
    persistLocally(ALL_PRODUCTS_LIST);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().neq('id', 'null');
        await supabase.from('products').upsert(ALL_PRODUCTS_LIST);
      } catch (err) {
        console.error('Error resetting Supabase catalog:', err);
      }
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
