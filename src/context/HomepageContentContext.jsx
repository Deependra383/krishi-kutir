import React, { createContext, useContext, useState } from 'react';
import { useSyncedSetting } from './useSyncedSetting';
import { HOME_3D_ASSETS } from '../data';
import defaultRachnaImg from '../assets/images/founder_portrait_1788864054548.jpg';
import defaultJanviImg from '../assets/images/janvi_portrait_1790083174336.jpg';
import botanicalHeroBanner from '../assets/images/botanical_hero_banner.jpg';

const DEFAULT_FOUNDERS = {
  founder1: {
    id: 'founder1',
    name: 'Rachna Alok Sharma',
    role: 'Founder & Master Grower',
    quote: 'Our mission is to bring nutrient-dense living microgreens from our grow tables directly into Indian kitchens, fresh and chemical-free.',
    image: defaultRachnaImg
  },
  founder2: {
    id: 'founder2',
    name: 'Janvi Bhagchandani',
    role: 'Chief Administrator',
    quote: 'We ensure seamless cold-chain logistics, strict batch hygiene, and FSSAI statutory compliance across every shipment.',
    image: defaultJanviImg
  }
};

export const DEFAULT_HERO_SLIDES = [
  {
    id: 'slide-1',
    title: "Skin Care & Botanical Harvest",
    heading: "Bringing Out The Beauty In You",
    description: "Nurtured with zero pesticides in our Bhopal vertical farm and botanical gardens. Experience living microgreens, pure sun-cured botanical powders, and restorative herbal wellness crafted to nourish your skin, body, and vitality.",
    image: botanicalHeroBanner,
    accent: "Living Microgreens, Pure Herbal Clays & Botanical Infusions",
    tag: "Skin Care Product",
    badge: "Krishi Kutir • Pure Botanical Harvest",
    overlaySub: "Bhopal Botanical & Vertical Farm",
    overlayCap: "100% Pure Organic Vitality",
    target: "#category=harvested-microgreens"
  },
  {
    id: 'slide-2',
    title: "100% Pure. Plant Powered.",
    heading: "Herbal Powders, Pure Extracts & Spices",
    description: "Dehydrated superfoods, dairy-free milk powders, organic vegetable powders, and fragrant whole spices processed under ISO 22000 and FSSAI hygienic standards.",
    image: HOME_3D_ASSETS.spices,
    accent: "Lakadong Turmeric, Moringa, Beetroot & Amla",
    tag: "Natural Nutrition & Extracts",
    badge: "Krishi Kutir • Ayurvedic Potency",
    overlaySub: "Leaf Lounge Processing Unit",
    overlayCap: "Pure Plant Concentrates",
    target: "#category=fruits"
  },
  {
    id: 'slide-3',
    title: "Grow Together. Supply Chain Excellence.",
    heading: "Partner With Krishi Kutir - B2B & Wholesale",
    description: "Reliable commercial supply for restaurants, cafes, supermarkets, wellness brands, and international distributors with customized bulk pricing and cold-chain dispatch.",
    image: HOME_3D_ASSETS.verticalFarm,
    accent: "HoReCa Supply, Contract Farming & Export Shipments",
    tag: "B2B & Institutional",
    badge: "Krishi Kutir • Commercial Grade",
    overlaySub: "Bhopal Vertical Facility",
    overlayCap: "Commercial Grow Racks",
    target: "#partner-with-us"
  },
  {
    id: 'slide-4',
    title: "Natural Food Solutions. 100% Traceable.",
    heading: "Cryo-Dehydrated Fruit & Vegetable Powders",
    description: "Serving taste with purity: retain over 95% of native active enzymes and natural colors without chemical additives, carriers, or artificial preservatives.",
    image: HOME_3D_ASSETS.botanicalPowders,
    accent: "Tomato Umami, Mint, Spinach & Green Mango",
    tag: "Botanical Ingredients",
    badge: "Krishi Kutir • Cryo Processed",
    overlaySub: "Zero Additives Laboratory",
    overlayCap: "Active Enzymes Certified",
    target: "#category=fruits"
  }
];

const DEFAULT_HOME_IMAGES = {
  microgreens: {
    id: 'microgreens',
    title: 'Skin Care & Botanical Wellness',
    label: 'Image 1: Botanical Hero & Wellness',
    description: 'Displayed in Hero Slider (Slide 1) and Botanical Wellness Showcase',
    url: botanicalHeroBanner
  },
  botanicalPowders: {
    id: 'botanicalPowders',
    title: 'Cryo-Dehydrated Fruit & Veg Powders',
    label: 'Image 2: Fruit & Vegetable Powders',
    description: 'Displayed in Hero Slider (Slide 4) and Product Divisions Grid (Fruit & Veg Powders)',
    url: HOME_3D_ASSETS.botanicalPowders
  },
  spices: {
    id: 'spices',
    title: 'Herbal Spices & Natural Extracts',
    label: 'Image 3: Herbal Spices & Extracts',
    description: 'Displayed in Hero Slider (Slide 2) and Product Divisions Grid (Organic Spices)',
    url: HOME_3D_ASSETS.spices
  },
  verticalFarm: {
    id: 'verticalFarm',
    title: 'Vertical Farm Hydroponic Facility',
    label: 'Image 4: Vertical Farm & B2B Commercial Supply',
    description: 'Displayed in Hero Slider (Slide 3) and Product Divisions Grid (Grow Trays & Systems)',
    url: HOME_3D_ASSETS.verticalFarm
  }
};

const DEFAULT_FOOTER_IMAGES = [
  {
    id: 'footer-img-1',
    title: 'Fresh Living Microgreens',
    subtitle: 'Daily Harvest Trays',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'footer-img-2',
    title: 'Cryo-Dehydrated Powders',
    subtitle: 'Pure Spices & Extracts',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'footer-img-3',
    title: 'Bhopal Vertical Farm',
    subtitle: 'LED Hydroponic Facility',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'footer-img-4',
    title: 'Gourmet Culinary Supply',
    subtitle: 'HoReCa Chef Partner',
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80'
  }
];

const DEFAULT_EVENTS_WORKSHOPS = [
  {
    id: 'event-1',
    title: 'Dietetics Association Workshop',
    location: 'Bhopal Chapter',
    desc: 'Demonstrating high-density microgreens nutrition to 100+ clinical nutritionists.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'event-2',
    title: 'Central Agri Institute Visit',
    location: 'CIAE Campus',
    desc: 'Co-founding high-tech seedling trays and solar LED strip growth optimization tests.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'event-3',
    title: 'Culinary Wellness Summit',
    location: 'Orchard Majestic',
    desc: 'Pairing dehydrated beetroot and spinach powder with elite vegan gourmet dishes.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80'
  }
];

const DEFAULT_INFRASTRUCTURE_CARDS = [
  {
    id: 'infra-1',
    category: 'Farm Infrastructure',
    title: 'Controlled Vertical Racks',
    desc: 'High-efficiency LED full-spectrum lights, automated air circulation fans, and low-EC coco substrate ensure 365-day harvest reliability without seasonal crop failure.',
    badge: '100% Crop Continuity',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'infra-2',
    category: 'Culinary Partners',
    title: 'HORECA Chef Supply',
    desc: 'Daily recurring delivery of live trays or freshly harvested clamshells to fine-dining restaurants, five-star banquets, and boutique wellness cafes.',
    badge: 'Direct Morning Drop-offs',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'infra-3',
    category: 'Botanical Processing',
    title: 'Hygienic Dehydration',
    desc: 'Precision low-temperature air-drying prevents heat oxidation, preserving intact vitamins, live chlorophyll, and deep natural colors in every powder batch.',
    badge: 'Moisture < 5% Certified',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'infra-4',
    category: 'Global Logistics',
    title: 'Global Cargo & Export',
    desc: 'Phytosanitary certification, vacuum nitrogen sealing, and express air-freight clearance to the US, Europe, Middle East, and Asia-Pacific.',
    badge: 'Worldwide Export Ready',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
  }
];

const DEFAULT_DIVISION_CARDS = [
  {
    id: 'div-microgreens',
    name: 'Harvested Microgreens & Living Trays',
    subtitle: 'Living Superfoods with 40x Nutrient Density',
    description: 'Living broccoli, daikon radish, sweet pea shoots, and sunflower greens delivered growing on organic coco pads or freshly harvested.',
    image: HOME_3D_ASSETS.microgreens,
    badge: '3D Living Harvest',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    tag: '0 Chemical Residue',
    target: '#category=harvested-microgreens'
  },
  {
    id: 'div-powders',
    name: 'Natural Powders (Fruit & Vegetable)',
    subtitle: 'Dehydrated Pure Plant Concentrates',
    description: 'Cryo-dehydrated beetroot, moringa, amla, spinach, and tomato umami powder retaining maximum bioflavonoids, vitamins, and natural aroma.',
    image: HOME_3D_ASSETS.botanicalPowders,
    badge: '3D Cryo Processed',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    tag: '100% Pure Active Enzymes',
    target: '#category=fruits'
  },
  {
    id: 'div-spices',
    name: 'Organic Spices & Herbal Extracts',
    subtitle: 'Ayurvedic Potency & High-Curcumin Spices',
    description: 'Single-origin Lakadong turmeric (>7.5% curcumin), Ceylon cinnamon, sun-dried Sonth ginger, and hand-sorted Tellicherry black pepper.',
    image: HOME_3D_ASSETS.spices,
    badge: '3D Pure Extracts',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    tag: 'Steam Sterilized',
    target: '#category=spices'
  },
  {
    id: 'div-dairy',
    name: 'Plant-Based Milk Alternatives',
    subtitle: 'Lactose-Free Pure Botanical Powders',
    description: 'Spray-dried oat milk, pure almond milk powder, and creamy coconut milk powder designed for everyday smoothies, baking, and barista drinks.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    badge: 'Dairy Free & Vegan',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    tag: 'Zero Additives / No Maltodextrin',
    target: '#category=dairy-alternatives'
  },
  {
    id: 'div-supplies',
    name: 'Professional Trays & Seeds',
    subtitle: 'Food-Grade Grow Trays & Substrates',
    description: 'Commercial 10" x 20" slotted grow trays, triple-washed low-EC cocopeat blocks, biodegradable packaging, and untreated non-GMO seed lots.',
    image: HOME_3D_ASSETS.verticalFarm,
    badge: '3D Hydroponic Systems',
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    tag: 'Direct Grower Supply',
    target: '#category=microgreen-seeds'
  }
];

const HomepageContentContext = createContext(null);

export const useHomepageContent = () => {
  const context = useContext(HomepageContentContext);
  if (!context) {
    return {
      founders: DEFAULT_FOUNDERS,
      heroSlides: DEFAULT_HERO_SLIDES,
      homeImages: DEFAULT_HOME_IMAGES,
      footerImages: DEFAULT_FOOTER_IMAGES,
      eventsWorkshops: DEFAULT_EVENTS_WORKSHOPS,
      infrastructureCards: DEFAULT_INFRASTRUCTURE_CARDS,
      divisionCards: DEFAULT_DIVISION_CARDS,
      defaultFounders: DEFAULT_FOUNDERS,
      defaultHeroSlides: DEFAULT_HERO_SLIDES,
      defaultHomeImages: DEFAULT_HOME_IMAGES,
      defaultFooterImages: DEFAULT_FOOTER_IMAGES,
      defaultEventsWorkshops: DEFAULT_EVENTS_WORKSHOPS,
      defaultInfrastructureCards: DEFAULT_INFRASTRUCTURE_CARDS,
      defaultDivisionCards: DEFAULT_DIVISION_CARDS,
      updateFounder: () => {},
      saveFounders: () => {},
      resetFounders: () => {},
      updateHeroSlide: () => {},
      saveHeroSlides: () => {},
      resetHeroSlides: () => {},
      addHeroSlide: () => {},
      deleteHeroSlide: () => {},
      updateHomeImage: () => {},
      saveHomeImages: () => {},
      resetHomeImages: () => {},
      updateFooterImage: () => {},
      saveFooterImages: () => {},
      resetFooterImages: () => {},
      addFooterImage: () => {},
      deleteFooterImage: () => {},
      updateEventWorkshop: () => {},
      saveEventsWorkshops: () => {},
      resetEventsWorkshops: () => {},
      addEventWorkshop: () => {},
      deleteEventWorkshop: () => {},
      updateInfrastructureCard: () => {},
      saveInfrastructureCards: () => {},
      resetInfrastructureCards: () => {},
      addInfrastructureCard: () => {},
      deleteInfrastructureCard: () => {},
      updateDivisionCard: () => {},
      saveDivisionCards: () => {},
      resetDivisionCards: () => {},
      addDivisionCard: () => {},
      deleteDivisionCard: () => {},
      savedSuccess: false
    };
  }
  return context;
};

// ---------------------------------------------------------------------------
// All homepage content is stored in the shared Supabase `site_settings` table,
// so admin changes show on every device and every login.
// ---------------------------------------------------------------------------

// One-time move of the old founder image key into the founders cache
if (typeof window !== 'undefined') {
  try {
    const legacyRachnaImg = localStorage.getItem('kk_founder_rachna_image');
    if (legacyRachnaImg && !localStorage.getItem('krishi_founders_config')) {
      localStorage.setItem('krishi_founders_config', JSON.stringify({
        ...DEFAULT_FOUNDERS,
        founder1: { ...DEFAULT_FOUNDERS.founder1, image: legacyRachnaImg }
      }));
    }
  } catch {}
}

const nonEmptyArrayOr = (fallback) => (v) => (Array.isArray(v) && v.length > 0 ? v : fallback);

const normalizeFounders = (v) => ({
  founder1: { ...DEFAULT_FOUNDERS.founder1, ...(v?.founder1 || {}) },
  founder2: { ...DEFAULT_FOUNDERS.founder2, ...(v?.founder2 || {}) }
});

const normalizeHeroSlides = (v) => {
  if (!Array.isArray(v) || v.length === 0) return DEFAULT_HERO_SLIDES;
  // Auto-upgrade slide-1 to the new botanical hero if it has the older title
  return v.map((s, idx) => {
    if (idx === 0 && (!s.heading || s.heading.includes('Fresh Microgreens & Live Growing Trays'))) {
      return { ...s, ...DEFAULT_HERO_SLIDES[0] };
    }
    return s;
  });
};

const normalizeHomeImages = (v) => ({
  microgreens: { ...DEFAULT_HOME_IMAGES.microgreens, ...(v?.microgreens || {}) },
  botanicalPowders: { ...DEFAULT_HOME_IMAGES.botanicalPowders, ...(v?.botanicalPowders || {}) },
  spices: { ...DEFAULT_HOME_IMAGES.spices, ...(v?.spices || {}) },
  verticalFarm: { ...DEFAULT_HOME_IMAGES.verticalFarm, ...(v?.verticalFarm || {}) }
});

const normalizeEvents = (v) => {
  if (!Array.isArray(v) || v.length === 0) return DEFAULT_EVENTS_WORKSHOPS;
  return v.map(ev => {
    if (ev.image && ev.image.includes('photo-1544535830-9d5a6724cd31')) {
      return { ...ev, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80' };
    }
    return ev;
  });
};

const normalizeFooter = nonEmptyArrayOr(DEFAULT_FOOTER_IMAGES);
const normalizeInfrastructure = nonEmptyArrayOr(DEFAULT_INFRASTRUCTURE_CARDS);
const normalizeDivisions = nonEmptyArrayOr(DEFAULT_DIVISION_CARDS);

// Helpers for list-type settings
const updateAt = (list, index, field, value) => {
  const updated = [...list];
  if (updated[index]) updated[index] = { ...updated[index], [field]: value };
  return updated;
};
const removeAt = (list, index) => (list.length <= 1 ? list : list.filter((_, i) => i !== index));

export const HomepageContentProvider = ({ children }) => {
  const foundersSetting = useSyncedSetting({
    key: 'founders', cacheKey: 'krishi_founders_config',
    defaults: DEFAULT_FOUNDERS, normalize: normalizeFounders
  });
  const heroSetting = useSyncedSetting({
    key: 'hero_slides', cacheKey: 'krishi_hero_slides_config',
    defaults: DEFAULT_HERO_SLIDES, normalize: normalizeHeroSlides
  });
  const homeImagesSetting = useSyncedSetting({
    key: 'home_images', cacheKey: 'krishi_home_images_config',
    defaults: DEFAULT_HOME_IMAGES, normalize: normalizeHomeImages
  });
  const footerSetting = useSyncedSetting({
    key: 'footer_images', cacheKey: 'krishi_footer_images_config',
    defaults: DEFAULT_FOOTER_IMAGES, normalize: normalizeFooter
  });
  const eventsSetting = useSyncedSetting({
    key: 'events_workshops', cacheKey: 'krishi_events_workshops_config',
    defaults: DEFAULT_EVENTS_WORKSHOPS, normalize: normalizeEvents
  });
  const infraSetting = useSyncedSetting({
    key: 'infrastructure_cards', cacheKey: 'krishi_infrastructure_cards_config',
    defaults: DEFAULT_INFRASTRUCTURE_CARDS, normalize: normalizeInfrastructure
  });
  const divisionSetting = useSyncedSetting({
    key: 'division_cards', cacheKey: 'krishi_division_cards_config',
    defaults: DEFAULT_DIVISION_CARDS, normalize: normalizeDivisions
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const flashSaved = (ok) => {
    if (!ok) return;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // FOUNDERS
  const updateFounder = (founderKey, field, value) => {
    foundersSetting.setValue(prev => ({
      ...prev,
      [founderKey]: { ...prev[founderKey], [field]: value }
    }));
  };
  const saveFounders = (newFounders) => {
    foundersSetting.setValue(newFounders, { immediate: true }).then(flashSaved);
  };
  const resetFounders = () => {
    try { localStorage.removeItem('kk_founder_rachna_image'); } catch {}
    foundersSetting.reset().then(flashSaved);
  };

  // HOME IMAGES (kept synced for legacy callers)
  const updateHomeImage = (imageKey, newUrl) => {
    homeImagesSetting.setValue(prev => ({
      ...prev,
      [imageKey]: { ...prev[imageKey], url: newUrl }
    }));
  };
  const saveHomeImages = (newHomeImages) => {
    homeImagesSetting.setValue(newHomeImages, { immediate: true }).then(flashSaved);
  };
  const resetHomeImages = () => {
    homeImagesSetting.reset().then(flashSaved);
  };

  // HERO SLIDES
  const updateHeroSlide = (index, field, value) => {
    heroSetting.setValue(prev => updateAt(prev, index, field, value));
  };
  const saveHeroSlides = (newSlides) => {
    heroSetting.setValue(newSlides, { immediate: true }).then(flashSaved);
    // Also update homeImages for backward compatibility
    if (newSlides[0]?.image) updateHomeImage('microgreens', newSlides[0].image);
    if (newSlides[1]?.image) updateHomeImage('spices', newSlides[1].image);
    if (newSlides[2]?.image) updateHomeImage('verticalFarm', newSlides[2].image);
    if (newSlides[3]?.image) updateHomeImage('botanicalPowders', newSlides[3].image);
  };
  const resetHeroSlides = () => {
    heroSetting.reset().then(flashSaved);
  };
  const addHeroSlide = (newSlide) => {
    heroSetting.setValue(prev => [...prev, {
      id: `slide-${Date.now()}`,
      title: "Krishi Kutir Harvest",
      heading: "New Living Harvest Showcase",
      description: "Freshly cultivated in our automated Bhopal facility with 100% natural, chemical-free standards.",
      image: HOME_3D_ASSETS.microgreens,
      accent: "Featured Farm Lot",
      tag: "Fresh Harvest",
      badge: "Krishi Kutir • Live Batch",
      overlaySub: "Leaf Lounge Vertical Farm",
      overlayCap: "Hydroponic Facility",
      target: "#microgreens-section",
      ...(newSlide || {})
    }], { immediate: true });
  };
  const deleteHeroSlide = (index) => {
    heroSetting.setValue(prev => removeAt(prev, index), { immediate: true });
  };

  // FOOTER IMAGES
  const updateFooterImage = (index, field, value) => {
    footerSetting.setValue(prev => updateAt(prev, index, field, value));
  };
  const saveFooterImages = (newFooterImages) => {
    footerSetting.setValue(newFooterImages, { immediate: true }).then(flashSaved);
  };
  const resetFooterImages = () => {
    footerSetting.reset().then(flashSaved);
  };
  const addFooterImage = (newImg) => {
    footerSetting.setValue(prev => [...prev, {
      id: `footer-img-${Date.now()}`,
      title: 'Krishi Kutir Live Facility',
      subtitle: 'Harvest Snapshot',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=600&q=80',
      ...(newImg || {})
    }], { immediate: true });
  };
  const deleteFooterImage = (index) => {
    footerSetting.setValue(prev => removeAt(prev, index), { immediate: true });
  };

  // EVENTS & WORKSHOPS
  const updateEventWorkshop = (index, field, value) => {
    eventsSetting.setValue(prev => updateAt(prev, index, field, value));
  };
  const saveEventsWorkshops = (newEvents) => {
    eventsSetting.setValue(newEvents, { immediate: true }).then(flashSaved);
  };
  const resetEventsWorkshops = () => {
    eventsSetting.reset().then(flashSaved);
  };
  const addEventWorkshop = (newEvent) => {
    eventsSetting.setValue(prev => [...prev, {
      id: `event-${Date.now()}`,
      title: 'New Workshop / Farm Session',
      location: 'Bhopal Chapter',
      desc: 'Interactive workshop on vertical microgreen cultivation and clean superfoods.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      ...(newEvent || {})
    }], { immediate: true });
  };
  const deleteEventWorkshop = (index) => {
    eventsSetting.setValue(prev => removeAt(prev, index), { immediate: true });
  };

  // INFRASTRUCTURE CARDS
  const updateInfrastructureCard = (index, field, value) => {
    infraSetting.setValue(prev => updateAt(prev, index, field, value));
  };
  const saveInfrastructureCards = (newCards) => {
    infraSetting.setValue(newCards, { immediate: true }).then(flashSaved);
  };
  const resetInfrastructureCards = () => {
    infraSetting.reset().then(flashSaved);
  };
  const addInfrastructureCard = (newCard) => {
    infraSetting.setValue(prev => [...prev, {
      id: `infra-${Date.now()}`,
      category: 'Supply Facility',
      title: 'New Infrastructure Unit',
      desc: 'Advanced automated climate-controlled racks and cold-chain distribution center.',
      badge: '100% Quality Inspected',
      image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
      ...(newCard || {})
    }], { immediate: true });
  };
  const deleteInfrastructureCard = (index) => {
    infraSetting.setValue(prev => removeAt(prev, index), { immediate: true });
  };

  // DIVISION CARDS
  const updateDivisionCard = (index, field, value) => {
    divisionSetting.setValue(prev => updateAt(prev, index, field, value));
  };
  const saveDivisionCards = (newCards) => {
    divisionSetting.setValue(newCards, { immediate: true }).then(flashSaved);
  };
  const resetDivisionCards = () => {
    divisionSetting.reset().then(flashSaved);
  };
  const addDivisionCard = (newCard) => {
    divisionSetting.setValue(prev => [...prev, {
      id: `div-${Date.now()}`,
      name: 'New Botanical Product Division',
      subtitle: 'Natural Living Harvest & Superfoods',
      description: 'Cultivated and produced under clean room and natural organic farming conditions.',
      image: HOME_3D_ASSETS.microgreens,
      badge: 'Pure Botanical',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      tag: '100% Traceable',
      target: '#full-catalogue-section',
      ...(newCard || {})
    }], { immediate: true });
  };
  const deleteDivisionCard = (index) => {
    divisionSetting.setValue(prev => removeAt(prev, index), { immediate: true });
  };

  const contentError =
    foundersSetting.error || heroSetting.error || homeImagesSetting.error || footerSetting.error ||
    eventsSetting.error || infraSetting.error || divisionSetting.error || null;

  return (
    <HomepageContentContext.Provider
      value={{
        founders: foundersSetting.value,
        heroSlides: heroSetting.value,
        homeImages: homeImagesSetting.value,
        footerImages: footerSetting.value,
        eventsWorkshops: eventsSetting.value,
        infrastructureCards: infraSetting.value,
        divisionCards: divisionSetting.value,
        defaultFounders: DEFAULT_FOUNDERS,
        defaultHeroSlides: DEFAULT_HERO_SLIDES,
        defaultHomeImages: DEFAULT_HOME_IMAGES,
        defaultFooterImages: DEFAULT_FOOTER_IMAGES,
        defaultEventsWorkshops: DEFAULT_EVENTS_WORKSHOPS,
        defaultInfrastructureCards: DEFAULT_INFRASTRUCTURE_CARDS,
        defaultDivisionCards: DEFAULT_DIVISION_CARDS,
        updateFounder,
        saveFounders,
        resetFounders,
        updateHeroSlide,
        saveHeroSlides,
        resetHeroSlides,
        addHeroSlide,
        deleteHeroSlide,
        updateHomeImage,
        saveHomeImages,
        resetHomeImages,
        updateFooterImage,
        saveFooterImages,
        resetFooterImages,
        addFooterImage,
        deleteFooterImage,
        updateEventWorkshop,
        saveEventsWorkshops,
        resetEventsWorkshops,
        addEventWorkshop,
        deleteEventWorkshop,
        updateInfrastructureCard,
        saveInfrastructureCards,
        resetInfrastructureCards,
        addInfrastructureCard,
        deleteInfrastructureCard,
        updateDivisionCard,
        saveDivisionCards,
        resetDivisionCards,
        addDivisionCard,
        deleteDivisionCard,
        contentError,
        savedSuccess
      }}
    >
      {children}
    </HomepageContentContext.Provider>
  );
};