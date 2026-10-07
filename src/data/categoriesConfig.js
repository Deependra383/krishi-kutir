import microgreensImg from '../assets/images/microgreens_isolated_1790238555624.jpg';
import dairyImg from '../assets/images/dairy_isolated_1790238572681.jpg';
import fruitsImg from '../assets/images/fruits_isolated_1790238586782.jpg';
import veggiesImg from '../assets/images/veggies_isolated_1790238602338.jpg';
import spicesImg from '../assets/images/spices_isolated_1790238615187.jpg';
import seasoningImg from '../assets/images/seasoning_isolated_1790238635751.jpg';
import seedsImg from '../assets/images/seeds_isolated_1790238653625.jpg';

// No hardcoded categories. All categories are dynamically created and managed by the user in the Admin Panel.
export const CATEGORIES_CONFIG = [];

export const getCategoryById = (id, dynamicList = []) => {
  if (!dynamicList || dynamicList.length === 0) return null;
  const target = (id || '').toString().toLowerCase().trim().replace(/^category=/, '');
  const targetSlug = target.replace(/[^a-z0-9]+/g, '-');
  return dynamicList.find(c => {
    const cId = (c.id || '').toLowerCase();
    const cTitle = (c.title || c.name || '').toLowerCase();
    const cSlug = cTitle.replace(/[^a-z0-9]+/g, '-');
    return cId === target || cTitle === target || cSlug === targetSlug || cId === targetSlug;
  }) || dynamicList[0] || null;
};

export const COLOR_PRESETS = [
  {
    borderColor: 'border-[#98c56c]',
    buttonColor: 'bg-[#5fa114] hover:bg-[#528d11]',
    accentColor: '#5fa114',
    watermarkColor: 'text-[#98c56c]/30'
  },
  {
    borderColor: 'border-[#d8b066]',
    buttonColor: 'bg-[#b8862d] hover:bg-[#a17525]',
    accentColor: '#b8862d',
    watermarkColor: 'text-[#d8b066]/30'
  },
  {
    borderColor: 'border-[#cc88b8]',
    buttonColor: 'bg-[#b81878] hover:bg-[#9d1466]',
    accentColor: '#b81878',
    watermarkColor: 'text-[#cc88b8]/30'
  },
  {
    borderColor: 'border-[#70b25e]',
    buttonColor: 'bg-[#4a9925] hover:bg-[#3f831f]',
    accentColor: '#4a9925',
    watermarkColor: 'text-[#70b25e]/30'
  },
  {
    borderColor: 'border-[#d59873]',
    buttonColor: 'bg-[#ba6529] hover:bg-[#9e5522]',
    accentColor: '#ba6529',
    watermarkColor: 'text-[#d59873]/30'
  },
  {
    borderColor: 'border-[#c48f4e]',
    buttonColor: 'bg-[#b37330] hover:bg-[#996228]',
    accentColor: '#b37330',
    watermarkColor: 'text-[#c48f4e]/30'
  },
  {
    borderColor: 'border-[#5fa37e]',
    buttonColor: 'bg-[#3a8a66] hover:bg-[#307556]',
    accentColor: '#3a8a66',
    watermarkColor: 'text-[#5fa37e]/30'
  },
  {
    borderColor: 'border-[#4f84c4]',
    buttonColor: 'bg-[#2563eb] hover:bg-[#1d4ed8]',
    accentColor: '#2563eb',
    watermarkColor: 'text-[#4f84c4]/30'
  },
  {
    borderColor: 'border-[#9333ea]',
    buttonColor: 'bg-[#9333ea] hover:bg-[#7e22ce]',
    accentColor: '#9333ea',
    watermarkColor: 'text-[#9333ea]/30'
  }
];

export const createCategoryConfigItem = (catName, customFields = {}, index = 0) => {
  const trimmed = (catName || '').trim();
  const id = customFields.id || trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const letter = (customFields.letter || trimmed.charAt(0) || 'K').toUpperCase();
  const palette = COLOR_PRESETS[index % COLOR_PRESETS.length];

  const defaultImg = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

  const defaultBenefits = [
    '100% naturally processed with zero synthetic preservatives',
    'Tested for optimal nutrient purity and safety standards',
    'Freshly prepared or packaged for peak bioavailability',
    'Certified and traceable organic farming practices'
  ];

  const userBenefits = Array.isArray(customFields.benefits) && customFields.benefits.length > 0 
    ? customFields.benefits 
    : defaultBenefits;

  return {
    id,
    letter,
    title: trimmed,
    name: trimmed,
    majorCategoryId: customFields.majorCategoryId || null,
    majorCategoryName: customFields.majorCategoryName || null,
    shortDesc: customFields.shortDesc || `Pure natural and sustainably produced ${trimmed} for healthy vitality.`,
    image: customFields.image || defaultImg,
    borderColor: customFields.borderColor || palette.borderColor,
    buttonColor: customFields.buttonColor || palette.buttonColor,
    accentColor: customFields.accentColor || palette.accentColor,
    watermarkColor: customFields.watermarkColor || palette.watermarkColor,
    tag: customFields.tag || `${trimmed} • 100% Organic`,
    ...customFields,
    benefits: userBenefits,
    filterProduct: (p) => {
      const pCat = (p.category || '').toLowerCase();
      const pSub = (p.subCategory || '').toLowerCase();
      const pSubId = (p.subCategoryId || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      const query = trimmed.toLowerCase();
      const queryId = id.toLowerCase();
      return pCat === query || 
             pSub === query || 
             pSubId === queryId || 
             pCat.includes(query) || 
             pSub.includes(query) || 
             pName.includes(query);
    }
  };
};
