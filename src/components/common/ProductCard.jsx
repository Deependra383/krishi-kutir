import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCategoryFallbackImage } from '../../utils/categoryImages';

export const ProductCard = ({
  product,
  formatPrice,
  onOpenAdmin,
  badgeText
}) => {
  const { isAdmin } = useAuth();
  const fallbackImg = getCategoryFallbackImage(product.category, product.name);

  const formattedPrice = formatPrice ? formatPrice(product.price) : `₹${product.price}`;

  return (
    <div
      id={`product-card-${product.id}`}
      className="relative z-10 bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 select-none"
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* ================= FULL COVER IMAGE ABOVE DETAILS ================= */}
          <div className="relative w-full h-40 sm:h-52 md:h-56 overflow-hidden bg-neutral-100">
            <img
              src={product.image || fallbackImg}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImg;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Admin Quick Edit Button */}
            {isAdmin && onOpenAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAdmin();
                }}
                className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md opacity-90 hover:opacity-100 transition-all cursor-pointer z-10"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>

          {/* ================= CARD DETAILS ================= */}
          <div className="p-3.5 sm:p-4 md:p-5 space-y-2 pb-4 sm:pb-5">
            {/* Title and Price */}
            <div className="flex items-baseline justify-between gap-1.5">
              <h4 
                className="font-bold text-neutral-900 text-xs sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors"
                title={product.name}
              >
                {product.name}
              </h4>
              <span className="font-extrabold text-emerald-800 text-xs sm:text-base tracking-tight shrink-0 font-sans">
                {formattedPrice}
              </span>
            </div>

            {/* Category / Unit Subtitle */}
            <div className="flex items-center justify-between gap-1 -mt-0.5">
              <span className="text-[10px] sm:text-xs text-neutral-400 font-medium capitalize line-clamp-1">
                {badgeText || product.category || 'Organic Farm Produce'}
              </span>
              {product.unit && (
                <span className="text-[9px] sm:text-[10px] text-neutral-400 font-mono shrink-0">
                  • {product.unit}
                </span>
              )}
            </div>

            {/* Description matching home page text style */}
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed pt-1 line-clamp-3 sm:line-clamp-4">
              {product.benefit || product.description || 'Pure, nutrient-dense organic harvest cultivated with zero chemical pesticides in our Bhopal vertical farm and botanical reserve.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
