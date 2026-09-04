import React from 'react';
import { X, Leaf, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MicroscopeOverlay = ({
  selectedMicroscopeItem,
  setSelectedMicroscopeItem,
  activeTheme,
  formatPrice
}) => {
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();

  if (!selectedMicroscopeItem) return null;

  const handleAddAndClose = () => {
    addToCart(selectedMicroscopeItem, 1);
    setSelectedMicroscopeItem(null);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(selectedMicroscopeItem, 1);
    setSelectedMicroscopeItem(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white text-neutral-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button 
          id="close-microscope"
          onClick={() => setSelectedMicroscopeItem(null)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl"><Leaf className="w-6 h-6" /></span>
          <div>
            <h3 className="text-2xl font-black uppercase text-neutral-900">{selectedMicroscopeItem.name}</h3>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold font-sans">
              {selectedMicroscopeItem.category} • {formatPrice ? formatPrice(selectedMicroscopeItem.price) : `₹${selectedMicroscopeItem.price}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={selectedMicroscopeItem.image || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'} 
              alt={selectedMicroscopeItem.name} 
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover rounded-2xl mb-4 bg-neutral-100"
            />
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium">
              🛡️ <strong className="font-semibold">Microbiological Audit:</strong> Certified Chemical Free, Non-GMO, and tested for zero pesticide traces.
            </div>
          </div>

          <div className="space-y-4 font-sans">
            <div>
              <h4 className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider">Health Profile & Benefits</h4>
              <p className="text-sm text-neutral-700 font-light mt-1">{selectedMicroscopeItem.benefit}</p>
            </div>

            <div>
              <h4 className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider">Estimated Mineral Assay</h4>
              <div className="space-y-2 mt-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1"><span>Calcium & Iron Density</span><span>94%</span></div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '94%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between font-bold mb-1"><span>Chlorophyll Concentration</span><span>88%</span></div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '88%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between font-bold mb-1"><span>Active Antioxidants</span><span>97%</span></div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full"><div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '97%' }}></div></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <h4 className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider">International Certifications</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded border">FSSAI Certified</span>
                <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded border">ISO 9001:2015</span>
                <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded border">APEDA Registered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">Unit Price</span>
            <span className="text-xl font-black text-neutral-900">
              {formatPrice ? formatPrice(selectedMicroscopeItem.price) : `₹${selectedMicroscopeItem.price}`}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              id="microscope-add-bag"
              onClick={handleAddAndClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add To Bag</span>
            </button>

            <button 
              id="microscope-buy-now"
              onClick={handleBuyNow}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Buy with Razorpay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
