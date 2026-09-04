import React from 'react';
import { ShoppingBag, ZoomIn, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCategoryFallbackImage } from '../../utils/categoryImages';

export const ProductCard = ({
  product,
  formatPrice,
  onAddToCart,
  onBuyNow,
  isAdded,
  onInspect,
  onOpenAdmin,
  badgeText,
  badgeColor = 'bg-neutral-900 text-white'
}) => {
  const { isAdmin } = useAuth();
  const fallbackImg = getCategoryFallbackImage(product.category, product.name);

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300 hover:border-emerald-300 hover:shadow-xl select-none"
    >
      <div>
        {/* Product Image Container - Clean without text written on top of image */}
        <div className="h-48 sm:h-52 rounded-xl overflow-hidden relative mb-4 bg-neutral-100">
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

          {/* Quick Inspect Button */}
          {onInspect && (
            <button
              onClick={() => onInspect(product)}
              title="View product details & lab specs"
              className="absolute bottom-3 right-3 p-2.5 bg-white/90 hover:bg-white text-neutral-800 rounded-xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md hover:scale-105"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          )}

          {/* Admin Quick Action */}
          {isAdmin && onOpenAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAdmin();
              }}
              className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-2">
          {/* Subtitle / Category Pill */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              {badgeText || product.category || 'Krishi Kutir'}
            </span>
            {product.moq && (
              <span className="text-neutral-500 text-[10px] font-mono shrink-0">
                MOQ: {product.moq}
              </span>
            )}
          </div>

          <h4 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h4>
          
          <p className="text-xs text-neutral-500 font-light line-clamp-2 h-8 leading-relaxed">
            {product.benefit || 'Pure, nutrient-dense organic harvest.'}
          </p>
          
          <div className="pt-2 border-t border-neutral-100 flex items-baseline justify-between">
            <div>
              <span className="text-lg font-black text-neutral-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-neutral-500 font-normal">
                {' '}• {product.unit || 'Pack'}
              </span>
            </div>

            {onInspect && (
              <button
                onClick={() => onInspect(product)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
        <button
          id={`add-cart-${product.id}`}
          onClick={(e) => onAddToCart(e, product)}
          className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border shadow-2xs ${
            isAdded
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
          }`}
        >
          {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          <span>{isAdded ? 'Added' : 'Add to Bag'}</span>
        </button>

        <button
          id={`buy-now-${product.id}`}
          onClick={(e) => onBuyNow(e, product)}
          className="py-2.5 px-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-all cursor-pointer flex items-center justify-center shadow-md shadow-emerald-700/20"
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};
