// Helper to provide category-matched high-resolution fallback images when product images are missing or broken
export const CATEGORY_FALLBACK_IMAGES = {
  'Harvested Microgreens': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'Live Microgreens': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
  'Microgreens Seeds': 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80',
  'Dairy Alternatives': 'https://images.unsplash.com/photo-1568651318047-97dff75b7b9e?auto=format&fit=crop&w=600&q=80',
  'Fruits and Vegetables': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'Spices and Seasoning': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  'Professional Grow Trays': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
  'Substrates & Growing Mediums': 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?auto=format&fit=crop&w=600&q=80',
  'Eco Packaging': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80',
};

export const getCategoryFallbackImage = (category, name = '') => {
  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    return CATEGORY_FALLBACK_IMAGES[category];
  }
  const lowerCat = (category || '').toLowerCase();
  const lowerName = (name || '').toLowerCase();
  
  if (lowerCat.includes('seed') || lowerName.includes('seed')) {
    return CATEGORY_FALLBACK_IMAGES['Microgreens Seeds'];
  }
  if (lowerCat.includes('live') || lowerName.includes('tray') || lowerName.includes('live')) {
    return CATEGORY_FALLBACK_IMAGES['Live Microgreens'];
  }
  if (lowerCat.includes('harvest') || lowerCat.includes('microgreen') || lowerName.includes('microgreen')) {
    return CATEGORY_FALLBACK_IMAGES['Harvested Microgreens'];
  }
  if (lowerCat.includes('spice') || lowerCat.includes('season') || lowerName.includes('pepper') || lowerName.includes('turmeric') || lowerName.includes('cumin') || lowerName.includes('cardamom') || lowerName.includes('cinnamon')) {
    return CATEGORY_FALLBACK_IMAGES['Spices and Seasoning'];
  }
  if (lowerCat.includes('dairy') || lowerCat.includes('milk') || lowerName.includes('milk') || lowerName.includes('almond') || lowerName.includes('oat')) {
    return CATEGORY_FALLBACK_IMAGES['Dairy Alternatives'];
  }
  if (lowerCat.includes('fruit') || lowerCat.includes('vegetable') || lowerCat.includes('powder') || lowerName.includes('powder') || lowerName.includes('spinach') || lowerName.includes('beet') || lowerName.includes('amla')) {
    return CATEGORY_FALLBACK_IMAGES['Fruits and Vegetables'];
  }
  if (lowerCat.includes('substrate') || lowerCat.includes('coco') || lowerName.includes('cocopeat') || lowerName.includes('medium')) {
    return CATEGORY_FALLBACK_IMAGES['Substrates & Growing Mediums'];
  }
  if (lowerCat.includes('tray') || lowerName.includes('tray') || lowerName.includes('sprouter')) {
    return CATEGORY_FALLBACK_IMAGES['Professional Grow Trays'];
  }
  return CATEGORY_FALLBACK_IMAGES['Harvested Microgreens'];
};
