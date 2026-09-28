import microgreensImg from '../assets/images/microgreens_isolated_1790238555624.jpg';
import dairyImg from '../assets/images/dairy_isolated_1790238572681.jpg';
import fruitsImg from '../assets/images/fruits_isolated_1790238586782.jpg';
import veggiesImg from '../assets/images/veggies_isolated_1790238602338.jpg';
import spicesImg from '../assets/images/spices_isolated_1790238615187.jpg';
import seasoningImg from '../assets/images/seasoning_isolated_1790238635751.jpg';
import seedsImg from '../assets/images/seeds_isolated_1790238653625.jpg';

export const CATEGORIES_CONFIG = [
  {
    id: 'harvested-microgreens',
    letter: 'H',
    title: 'Harvested Microgreens',
    shortDesc: 'Crisp, freshly clipped living shoots harvested hours before dispatch with 40x nutrient density.',
    image: microgreensImg,
    borderColor: 'border-[#98c56c]',
    buttonColor: 'bg-[#5fa114] hover:bg-[#528d11]',
    accentColor: '#5fa114',
    watermarkColor: 'text-[#98c56c]/30',
    tag: 'Live Harvest • 40x Nutrition',
    benefits: [
      'Up to 40x higher sulforaphane, carotenoids, and vitamin C',
      'Harvested early morning and sealed in breathable eco-clamshells',
      'Ready to eat with zero soil or pesticide residues',
      'Ideal for gourmet salads, cold-pressed juices, and healthy garnishes'
    ],
    filterProduct: (p) => {
      const cat = (p.category || '').toLowerCase();
      return cat.includes('harvest') || cat.includes('clamshell');
    }
  },
  {
    id: 'dairy-alternatives',
    letter: 'D',
    title: 'Dairy Alternatives',
    shortDesc: 'Pure spray-dried plant milk powders including organic coconut cream, cashew, and oat milk.',
    image: dairyImg,
    borderColor: 'border-[#d8b066]',
    buttonColor: 'bg-[#b8862d] hover:bg-[#a17525]',
    accentColor: '#b8862d',
    watermarkColor: 'text-[#d8b066]/30',
    tag: '100% Lactose Free • Vegan Clean',
    benefits: [
      '100% lactose-free, vegan, and gut-friendly formulation',
      'Rich in clean MCTs, calcium, healthy plant lipids, and fiber',
      'Instant solubility in hot beverages, smoothies, and vegan curries',
      'Zero cholesterol, chemical emulsifiers, or synthetic preservatives'
    ],
    filterProduct: (p) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('dairy') || name.includes('milk') || name.includes('coconut');
    }
  },
  {
    id: 'fruits',
    letter: 'F',
    title: 'Fruits',
    shortDesc: 'Cryo-dehydrated wild berries, amla, and tropical fruit powders that preserve 98% bioactive enzymes.',
    image: fruitsImg,
    borderColor: 'border-[#cc88b8]',
    buttonColor: 'bg-[#b81878] hover:bg-[#9d1466]',
    accentColor: '#b81878',
    watermarkColor: 'text-[#cc88b8]/30',
    tag: 'Cryo-Preserved • Raw Enzymes',
    benefits: [
      'Pure Indian Gooseberry (Amla), pomegranate, and fruit essences',
      'Unsurpassed vitamin C density and powerful polyphenol antioxidants',
      'Natural flavor enhancer for morning yogurts and detox elixirs',
      'No added refined sugars, artificial coloring, or preservatives'
    ],
    filterProduct: (p) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      const isFruitVeg = cat.includes('fruit') || cat.includes('vegetable');
      const fruitKeywords = ['amla', 'pineapple', 'orange', 'pomegranate', 'anardana', 'amchur', 'berry', 'beetroot'];
      return isFruitVeg && fruitKeywords.some(k => name.includes(k));
    }
  },
  {
    id: 'vegetables',
    letter: 'V',
    title: 'Vegetables',
    shortDesc: 'Whole farm-fresh vegetables and dehydrated green powders: moringa leaf, spinach, and wheatgrass.',
    image: veggiesImg,
    borderColor: 'border-[#70b25e]',
    buttonColor: 'bg-[#4a9925] hover:bg-[#3f831f]',
    accentColor: '#4a9925',
    watermarkColor: 'text-[#70b25e]/30',
    tag: 'Chlorophyll Rich • Alkaline Core',
    benefits: [
      'Nutrient-dense moringa leaf and highly alkalizing pure spinach chlorophyll',
      'Wheatgrass shots, dehydrated ripe tomato umami, and mint powders',
      'Gentle low-temperature dehydration preserves vital phytonutrients',
      'Clean daily wellness boost for endurance athletes and family health'
    ],
    filterProduct: (p) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      const isFruitVeg = cat.includes('fruit') || cat.includes('vegetable');
      const vegKeywords = ['moringa', 'spinach', 'tomato', 'mint', 'wheatgrass', 'ashwagandha', 'broccoli'];
      return (isFruitVeg && vegKeywords.some(k => name.includes(k))) || (!cat.includes('fruit') && vegKeywords.some(k => name.includes(k)));
    }
  },
  {
    id: 'spices',
    letter: 'S',
    title: 'Spices',
    shortDesc: 'Single-origin, high-curcumin Lakadong turmeric, Ceylon cinnamon, black pepper, and roasted cumin.',
    image: spicesImg,
    borderColor: 'border-[#d59873]',
    buttonColor: 'bg-[#ba6529] hover:bg-[#9e5522]',
    accentColor: '#ba6529',
    watermarkColor: 'text-[#d59873]/30',
    tag: 'Single-Origin • High Volatile Oils',
    benefits: [
      'Lakadong turmeric verified at >7.5% natural curcumin density',
      'True Ceylon sweet cinnamon bark with ultra-low coumarin levels',
      'High piperine Malabar black peppercorns for enhanced bio-absorption',
      'Traditional stone-ground processing to preserve natural volatile oils'
    ],
    filterProduct: (p) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      const isSpiceCat = cat.includes('spice') || cat.includes('seasoning');
      const isSeasoningBlend = name.includes('blend') || name.includes('seasoning') || name.includes('herb');
      return isSpiceCat && !isSeasoningBlend;
    }
  },
  {
    id: 'seasoning',
    letter: 'S',
    title: 'Seasoning',
    shortDesc: 'Artisanal spice seasonings, Italian dried herb blends, and Himalayan pink rock salt mixtures.',
    image: seasoningImg,
    borderColor: 'border-[#c48f4e]',
    buttonColor: 'bg-[#b37330] hover:bg-[#996228]',
    accentColor: '#b37330',
    watermarkColor: 'text-[#c48f4e]/30',
    tag: 'Artisanal Blends • Zero MSG',
    benefits: [
      'Artisanal blends of oregano, basil, thyme, and crushed peppercorns',
      'Convenient sprinkler packing for pizzas, pasta, soups, and roasts',
      '100% natural herbs with zero MSG or artificial anti-caking agents',
      'Sun-dried and aromatic whole crushed botanical herbs'
    ],
    filterProduct: (p) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return (cat.includes('spice') || cat.includes('seasoning')) && 
             (name.includes('seasoning') || name.includes('blend') || name.includes('herb') || name.includes('sprinkler'));
    }
  },
  {
    id: 'microgreen-seeds',
    letter: 'M',
    title: 'Microgreen Seeds',
    shortDesc: 'Certified non-GMO, untreated heirloom sprouting seeds tested for high germination (>98%).',
    image: seedsImg,
    borderColor: 'border-[#5fa37e]',
    buttonColor: 'bg-[#3a8a66] hover:bg-[#307556]',
    accentColor: '#3a8a66',
    watermarkColor: 'text-[#5fa37e]/30',
    tag: 'Non-GMO Verified • >98% Sprout Rate',
    benefits: [
      'Laboratory tested for zero chemical dressings or fungicides',
      'Guaranteed high sprout uniformity and dense canopy yields',
      'Includes radish, broccoli, mustard, sunflower, and amaranth lots',
      'Trusted by commercial indoor vertical farms and home growers alike'
    ],
    filterProduct: (p) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('seed') || name.includes('seed');
    }
  }
];

export const getCategoryById = (id) => {
  return CATEGORIES_CONFIG.find(c => c.id === id) || CATEGORIES_CONFIG[0];
};
