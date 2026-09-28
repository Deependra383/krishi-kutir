import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCategoryFallbackImage } from '../../utils/categoryImages';

// Clean SVG WhatsApp Icon
const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export const ProductCard = ({
  product,
  formatPrice,
  onOpenAdmin,
  badgeText,
  activeTheme,
  onAddToCart,
  onBuyNow,
  isAdded,
  onInspect,
  isHovering,
  coord,
  onMouseMove,
  onMouseEnter,
  onMouseLeave
}) => {
  const { isAdmin } = useAuth();
  const fallbackImg = getCategoryFallbackImage(product.category, product.name);

  const formattedPrice = formatPrice ? formatPrice(product.price) : `₹${product.price}`;

  // WhatsApp inquiry URL prefilled with product name, price, and inquiry details
  const whatsappUrl = `https://wa.me/919009911030?text=${encodeURIComponent(
    `Hi Krishi Kutir, I want to inquire about purchasing ${product.name} (${formattedPrice}${product.unit ? ' / ' + product.unit : ''}). Please share availability and ordering details.`
  )}`;

  return (
    <div
      id={`product-card-${product.id}`}
      onMouseMove={(e) => onMouseMove && onMouseMove(e, product.id)}
      onMouseEnter={() => onMouseEnter && onMouseEnter(product.id)}
      onMouseLeave={() => onMouseLeave && onMouseLeave(product.id)}
      className="relative z-10 bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 ease-out will-change-transform shadow-xs hover:scale-[1.025] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/10 hover:border-emerald-400/90 active:scale-[0.99] select-none cursor-pointer"
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
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />

            {/* Subtle soft gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
              <span className="font-extrabold text-emerald-800 text-xs sm:text-base tracking-tight shrink-0 font-sans group-hover:text-emerald-600 transition-colors">
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

            {/* ================= INQUIRE ON WHATSAPP OPTION ================= */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group/wa"
                title={`Inquire on WhatsApp for ${product.name}`}
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0 fill-current group-hover/wa:scale-110 transition-transform" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
