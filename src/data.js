/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import microgreens3D from './assets/images/microgreens_tray_3d_1788782941452.jpg';
import herbalSpices3D from './assets/images/herbal_spices_3d_1788782975754.jpg';
import verticalFarm3D from './assets/images/vertical_farm_3d_1788782992145.jpg';
import botanicalPowders3D from './assets/images/botanical_powders_3d_1788783009356.jpg';

export const HOME_3D_ASSETS = {
  microgreens: microgreens3D,
  spices: herbalSpices3D,
  verticalFarm: verticalFarm3D,
  botanicalPowders: botanicalPowders3D
};

// ==========================================
// 1. PRODUCTS (Empty by default - all products are user-created via Admin Panel)
// ==========================================

export const HARVESTED_MICROGREENS = [];
export const LIVE_MICROGREENS = [];
export const SEEDS_CATALOGUE = [];
export const DAIRY_ALTERNATIVES = [];
export const FRUITS_AND_VEGETABLES_POWDERS = [];
export const SPICES_AND_SEASONING = [];
export const OTHER_PRODUCTS = [];

// All products are dynamically created and stored in Admin Panel
export const ALL_PRODUCTS_LIST = [];

export const CURRENCIES = {
  INR: { symbol: '₹', rate: 1.0, label: 'Indian Rupee (INR)' },
  USD: { symbol: '$', rate: 0.012, label: 'US Dollar (USD)' },
  EUR: { symbol: '€', rate: 0.011, label: 'Euro (EUR)' },
  GBP: { symbol: '£', rate: 0.0094, label: 'British Pound (GBP)' },
  JPY: { symbol: '¥', rate: 1.91, label: 'Japanese Yen (JPY)' }
};

export const THEMES = [
  {
    id: 'T1',
    name: 'Venkatesh Traditional',
    tagline: 'Warm organic tones, fine curves, leaf graphics',
    bodyClass: 'bg-[#f8fcf9] text-[#1e2d24]',
    accentColor: '#15803d',
    buttonClass: 'bg-[#15803d] text-white hover:bg-[#166534] rounded-full shadow-md shadow-green-100',
    cardClass: 'bg-white border border-[#e2efe6] rounded-2xl p-6 hover:shadow-xl transition-all duration-300',
    headerClass: 'bg-[#f0f9f2] border-b border-[#e2efe6]',
    badgeClass: 'bg-[#e2efe6] text-[#15803d] rounded-full px-3 py-1 text-xs font-semibold'
  },
  {
    id: 'T2',
    name: 'Modern Minimalist Spa',
    tagline: 'High-contrast soft ivory, thin borders, extra breathing room',
    bodyClass: 'bg-[#fafaf7] text-neutral-800',
    accentColor: '#404040',
    buttonClass: 'bg-neutral-800 text-neutral-50 hover:bg-black rounded-none tracking-widest text-xs uppercase transition-all',
    cardClass: 'bg-white border border-neutral-100 rounded-none p-6 transition-all duration-500 hover:border-neutral-400',
    headerClass: 'bg-[#fafaf7] border-b border-neutral-200/50',
    badgeClass: 'border border-neutral-200 text-neutral-600 rounded-none px-3 py-0.5 text-[10px] uppercase font-bold tracking-wider'
  },
  {
    id: 'T3',
    name: 'Cosmic Wellness (Dark Mode)',
    tagline: 'Futuristic neon accents, pitch obsidian backdrops, glowing shadows',
    bodyClass: 'bg-[#090e0c] text-emerald-100',
    accentColor: '#10b981',
    buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-[#090e0c] font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all',
    cardClass: 'bg-[#0e1613] border border-emerald-950/80 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-emerald-500/50 transition-all duration-300',
    headerClass: 'bg-[#0d1411] border-b border-emerald-950/60',
    badgeClass: 'bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded-md px-2 py-1 text-xs font-mono font-bold'
  },
  {
    id: 'T4',
    name: 'Vibrant Spice Bazaar',
    tagline: 'Earthy terracotta, warm crimson sands, golden hour glows',
    bodyClass: 'bg-[#fcf7f2] text-[#4a2e21]',
    accentColor: '#b45309',
    buttonClass: 'bg-[#be123c] text-white hover:bg-[#9f1239] rounded-xl shadow-lg shadow-rose-200/50 transition-all',
    cardClass: 'bg-white border border-[#f3e5d8] rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
    headerClass: 'bg-[#fcf1e6] border-b border-[#ebd7c5]',
    badgeClass: 'bg-[#fdf4e9] text-[#b45309] rounded-xl px-3 py-1 text-xs font-bold border border-[#f5dbbf]'
  },
  {
    id: 'T5',
    name: 'Clean Editorial Magazine',
    tagline: 'Elegant serif headlines, asymmetrical margins, botanical grids',
    bodyClass: 'bg-[#fcfcf9] text-neutral-900 font-serif',
    accentColor: '#1c1917',
    buttonClass: 'bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-full font-sans tracking-wide text-xs transition-all px-6 py-3',
    cardClass: 'bg-stone-50 border border-stone-200 rounded-lg p-8 shadow-sm hover:shadow-lg transition-all duration-500',
    headerClass: 'bg-stone-100/50 border-b border-stone-200',
    badgeClass: 'bg-stone-200/60 text-stone-800 rounded-full px-3 py-1 text-xs font-sans font-medium'
  },
  {
    id: 'T6',
    name: 'B2B Global Trade Hub',
    tagline: 'Dense tabular columns, instant cargo shipping telemetry',
    bodyClass: 'bg-[#f8fafc] text-slate-800 font-sans',
    accentColor: '#0284c7',
    buttonClass: 'bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm text-sm font-semibold',
    cardClass: 'bg-white border border-slate-200 rounded-lg p-5 hover:border-sky-500 transition-all shadow-sm',
    headerClass: 'bg-white border-b border-slate-200 shadow-xs',
    badgeClass: 'bg-sky-50 text-sky-700 rounded-md px-2.5 py-1 text-xs font-semibold border border-sky-100'
  }
];

export const INTERNATIONAL_COUNTRIES = [
  { code: 'US', name: 'United States', rate: 2200, time: '4-6 Days (Air Cargo)', tax: 'Duty-free up to $800' },
  { code: 'DE', name: 'Germany', rate: 2500, time: '5-7 Days (Air Freight)', tax: '5% Import VAT applicable' },
  { code: 'GB', name: 'United Kingdom', rate: 2400, time: '4-6 Days (Air Express)', tax: 'Customs cleared directly' },
  { code: 'JP', name: 'Japan', rate: 1900, time: '3-5 Days (Express Air)', tax: 'Phytosanitary check required' },
  { code: 'AU', name: 'Australia', rate: 2600, time: '6-8 Days (B2B Cargo)', tax: 'Strict biosecurity compliance' },
  { code: 'IN', name: 'India (Domestic)', rate: 120, time: '2-4 Days (Courier)', tax: 'GST extra as applicable' }
];

export const CAROUSEL_ITEMS = [
  {
    title: "Living Superfoods. 40x Nutrition.",
    heading: "Fresh Microgreens & Live Growing Trays",
    description: "Harvested at peak vibrancy in the Leaf Lounge or delivered growing live on organic coco-coir pads. 100% chemical-free, nutrient-dense living greens.",
    image: microgreens3D,
    image3d: microgreens3D,
    accent: "Living Broccoli, Radish, Sunflower & Pea Shoots",
    tag: "Living Greens Division",
    type: "microgreens",
    target: "#microgreens-section"
  },
  {
    title: "100% Pure. Plant Powered.",
    heading: "Herbal Powders, Pure Extracts & Spices",
    description: "Dehydrated superfoods, dairy-free milk powders, organic vegetable powders, and fragrant whole spices processed under ISO 22000 and FSSAI hygienic standards.",
    image: herbalSpices3D,
    image3d: herbalSpices3D,
    accent: "Lakadong Turmeric, Moringa, Beetroot & Amla",
    tag: "Natural Nutrition & Extracts",
    type: "powders",
    target: "#powders-spices-section"
  },
  {
    title: "Grow Together. Supply Chain Excellence.",
    heading: "Partner With Krishi Kutir - B2B & Wholesale",
    description: "Reliable commercial supply for restaurants, cafes, supermarkets, wellness brands, and international distributors with customized bulk pricing and cold-chain dispatch.",
    image: verticalFarm3D,
    image3d: verticalFarm3D,
    accent: "HoReCa Supply, Contract Farming & Export Shipments",
    tag: "B2B & Institutional",
    type: "partner",
    target: "#partner-with-us"
  },
  {
    title: "Natural Food Solutions. 100% Traceable.",
    heading: "Cryo-Dehydrated Fruit & Vegetable Powders",
    description: "Serving taste with purity: retain over 95% of native active enzymes and natural colors without chemical additives, carriers, or artificial preservatives.",
    image: botanicalPowders3D,
    image3d: botanicalPowders3D,
    accent: "Tomato Umami, Mint, Spinach & Green Mango",
    tag: "Botanical Ingredients",
    type: "powders",
    target: "#powders-spices-section"
  }
];
