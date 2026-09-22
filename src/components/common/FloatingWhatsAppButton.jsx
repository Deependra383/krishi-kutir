import React from 'react';

export const FloatingWhatsAppButton = () => {
  const whatsappUrl = "https://wa.me/919009911030?text=Hi%20Krishi%20Kutir,%20I%20have%20an%20inquiry%20regarding%20purchasing%20your%20products.";

  return (
    <aside aria-label="WhatsApp quick contact desk" className="fixed bottom-6 right-6 z-50 select-none">
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp (+91 90099 11030)"
        title="Chat on WhatsApp (+91 90099 11030)"
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#075E54] hover:bg-[#054c44] text-white shadow-lg hover:shadow-2xl hover:shadow-[#075E54]/40 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        {/* WhatsApp Official Logo SVG */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-white drop-shadow-xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.65.74 5.14 2.03 7.28L2.24 29.3c-.15.54.34 1.03.88.88l6.19-1.74A13.91 13.91 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.55c-2.31 0-4.48-.65-6.33-1.78l-.45-.27-4.14 1.16 1.18-3.99-.29-.47A11.53 11.53 0 014.45 16c0-6.38 5.17-11.55 11.55-11.55S27.55 9.62 27.55 16 22.38 27.55 16 27.55zm6.83-8.83c-.37-.19-2.22-1.1-2.56-1.22-.34-.13-.59-.19-.84.19s-.97 1.22-1.19 1.47c-.22.25-.44.28-.82.09-.37-.19-1.57-.58-2.99-1.85-1.11-.99-1.86-2.21-2.07-2.58-.22-.37-.02-.57.16-.76.17-.17.37-.44.56-.66.19-.22.25-.37.37-.62.13-.25.06-.47-.03-.66-.09-.19-.84-2.03-1.16-2.78-.31-.73-.62-.63-.85-.64-.22-.01-.47-.01-.72-.01s-.66.09-1 .47c-.34.37-1.31 1.28-1.31 3.12s1.34 3.62 1.53 3.87c.19.25 2.64 4.03 6.39 5.65.89.39 1.59.62 2.13.79.9.29 1.72.25 2.37.15.72-.11 2.22-.91 2.53-1.78.31-.88.31-1.63.22-1.78-.09-.16-.34-.25-.72-.44z" />
        </svg>
      </a>
    </aside>
  );
};

