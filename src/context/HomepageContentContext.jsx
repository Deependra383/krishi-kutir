import React, { createContext, useContext, useState, useEffect } from 'react';
import { HOME_3D_ASSETS } from '../data';
import defaultRachnaImg from '../assets/images/founder_portrait_1788864054548.jpg';
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
    name: 'Janvi Bhaghchandani',
    role: 'Chief Administrator',
    quote: 'We ensure seamless cold-chain logistics, strict batch hygiene, and FSSAI statutory compliance across every shipment.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80'
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
    target: "#full-catalogue-section"
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
    target: "#powders-spices-section"
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
    target: "#powders-spices-section"
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
    image: 'https://images.unsplash.com/photo-1544535830-9d5a6724cd31?auto=format&fit=crop&w=500&q=80'
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
    name: 'Living Microgreens & Trays',
    subtitle: 'Living Superfoods with 40x Nutrient Density',
    description: 'Living broccoli, daikon radish, sweet pea shoots, and sunflower greens delivered growing on organic coco pads or freshly harvested.',
    image: HOME_3D_ASSETS.microgreens,
    badge: '3D Living Harvest',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    tag: '0 Chemical Residue',
    target: '#microgreens-section'
  },
  {
    id: 'div-powders',
    name: 'Fruit & Vegetable Powders',
    subtitle: 'Dehydrated Pure Plant Concentrates',
    description: 'Cryo-dehydrated beetroot, moringa, amla, spinach, and tomato umami powder retaining maximum bioflavonoids, vitamins, and natural aroma.',
    image: HOME_3D_ASSETS.botanicalPowders,
    badge: '3D Cryo Processed',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    tag: '100% Pure Active Enzymes',
    target: '#powders-spices-section'
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
    target: '#powders-spices-section'
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
    target: '#powders-spices-section'
  },
  {
    id: 'div-supplies',
    name: 'Professional Trays & Mediums',
    subtitle: 'Food-Grade Grow Trays & Substrates',
    description: 'Commercial 10" x 20" slotted grow trays, triple-washed low-EC cocopeat blocks, biodegradable packaging, and untreated non-GMO seed lots.',
    image: HOME_3D_ASSETS.verticalFarm,
    badge: '3D Hydroponic Systems',
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    tag: 'Direct Grower Supply',
    target: '#full-catalogue-section'
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

export const HomepageContentProvider = ({ children }) => {
  // 1. Founders State
  const [founders, setFounders] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi_founders_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            founder1: { ...DEFAULT_FOUNDERS.founder1, ...(parsed.founder1 || {}) },
            founder2: { ...DEFAULT_FOUNDERS.founder2, ...(parsed.founder2 || {}) }
          };
        }
        // Legacy check for Rachna image
        const legacyRachnaImg = localStorage.getItem('kk_founder_rachna_image');
        if (legacyRachnaImg) {
          return {
            ...DEFAULT_FOUNDERS,
            founder1: { ...DEFAULT_FOUNDERS.founder1, image: legacyRachnaImg }
          };
        }
      } catch (e) {
        console.warn('Error reading founders config from localStorage:', e);
      }
    }
    return DEFAULT_FOUNDERS;
  });

  // 1b. Hero Slides State (Dynamic Home Carousel with Editable Text & Images)
  const [heroSlides, setHeroSlides] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi_hero_slides_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Auto-upgrade slide-1 to the new botanical hero if it has the older title
            const upgraded = parsed.map((s, idx) => {
              if (idx === 0 && (!s.heading || s.heading.includes('Fresh Microgreens & Live Growing Trays'))) {
                return { ...s, ...DEFAULT_HERO_SLIDES[0] };
              }
              return s;
            });
            return upgraded;
          }
        }
      } catch (e) {
        console.warn('Error reading hero slides config from localStorage:', e);
      }
    }
    return DEFAULT_HERO_SLIDES;
  });

  // 2. Home Images State (kept synced for legacy callers)
  const [homeImages, setHomeImages] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi_home_images_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            microgreens: { ...DEFAULT_HOME_IMAGES.microgreens, ...(parsed.microgreens || {}) },
            botanicalPowders: { ...DEFAULT_HOME_IMAGES.botanicalPowders, ...(parsed.botanicalPowders || {}) },
            spices: { ...DEFAULT_HOME_IMAGES.spices, ...(parsed.spices || {}) },
            verticalFarm: { ...DEFAULT_HOME_IMAGES.verticalFarm, ...(parsed.verticalFarm || {}) }
          };
        }
      } catch (e) {
        console.warn('Error reading home images config from localStorage:', e);
      }
    }
    return DEFAULT_HOME_IMAGES;
  });

  // 3. Footer Images State
  const [footerImages, setFooterImages] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi_footer_images_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error reading footer images config from localStorage:', e);
      }
    }
    return DEFAULT_FOOTER_IMAGES;
  });

  // 4. Events & Workshops State
  const [eventsWorkshops, setEventsWorkshops] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi_events_workshops_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error reading events workshops config from localStorage:', e);
      }
    }
    return DEFAULT_EVENTS_WORKSHOPS;
  });

  // 5. Infrastructure Cards State (Our Infrastructure & Supply Guarantee)
  const [infrastructureCards, setInfrastructureCards] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi_infrastructure_cards_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error reading infrastructure cards config from localStorage:', e);
      }
    }
    return DEFAULT_INFRASTRUCTURE_CARDS;
  });

  // 6. Division Cards State (Pure Botanical Ingredients & Living Superfoods)
  const [divisionCards, setDivisionCards] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krishi_division_cards_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error reading division cards config from localStorage:', e);
      }
    }
    return DEFAULT_DIVISION_CARDS;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync with other tabs / storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'krishi_founders_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setFounders({
            founder1: { ...DEFAULT_FOUNDERS.founder1, ...(parsed.founder1 || {}) },
            founder2: { ...DEFAULT_FOUNDERS.founder2, ...(parsed.founder2 || {}) }
          });
        } catch {}
      }
      if (e.key === 'krishi_hero_slides_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHeroSlides(parsed);
          }
        } catch {}
      }
      if (e.key === 'krishi_home_images_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setHomeImages({
            microgreens: { ...DEFAULT_HOME_IMAGES.microgreens, ...(parsed.microgreens || {}) },
            botanicalPowders: { ...DEFAULT_HOME_IMAGES.botanicalPowders, ...(parsed.botanicalPowders || {}) },
            spices: { ...DEFAULT_HOME_IMAGES.spices, ...(parsed.spices || {}) },
            verticalFarm: { ...DEFAULT_HOME_IMAGES.verticalFarm, ...(parsed.verticalFarm || {}) }
          });
        } catch {}
      }
      if (e.key === 'krishi_footer_images_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setFooterImages(parsed);
          }
        } catch {}
      }
      if (e.key === 'krishi_events_workshops_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setEventsWorkshops(parsed);
          }
        } catch {}
      }
      if (e.key === 'krishi_infrastructure_cards_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setInfrastructureCards(parsed);
          }
        } catch {}
      }
      if (e.key === 'krishi_division_cards_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setDivisionCards(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update specific founder field
  const updateFounder = (founderKey, field, value) => {
    setFounders(prev => {
      const updated = {
        ...prev,
        [founderKey]: {
          ...prev[founderKey],
          [field]: value
        }
      };
      try {
        localStorage.setItem('krishi_founders_config', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error persisting founders config:', err);
      }
      return updated;
    });
  };

  // Commit full founders
  const saveFounders = (newFounders) => {
    setFounders(newFounders);
    try {
      localStorage.setItem('krishi_founders_config', JSON.stringify(newFounders));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving founders config:', err);
    }
  };

  // Reset founders
  const resetFounders = () => {
    setFounders(DEFAULT_FOUNDERS);
    try {
      localStorage.removeItem('krishi_founders_config');
      localStorage.removeItem('kk_founder_rachna_image');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error resetting founders config:', err);
    }
  };

  // HERO SLIDES METHODS
  const updateHeroSlide = (index, field, value) => {
    setHeroSlides(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      try {
        localStorage.setItem('krishi_hero_slides_config', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error persisting hero slides config:', err);
      }
      return updated;
    });
  };

  const saveHeroSlides = (newSlides) => {
    setHeroSlides(newSlides);
    try {
      localStorage.setItem('krishi_hero_slides_config', JSON.stringify(newSlides));
      // Also update homeImages for backward compatibility
      if (newSlides[0]?.image) updateHomeImage('microgreens', newSlides[0].image);
      if (newSlides[1]?.image) updateHomeImage('spices', newSlides[1].image);
      if (newSlides[2]?.image) updateHomeImage('verticalFarm', newSlides[2].image);
      if (newSlides[3]?.image) updateHomeImage('botanicalPowders', newSlides[3].image);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving hero slides config:', err);
    }
  };

  const resetHeroSlides = () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    try {
      localStorage.removeItem('krishi_hero_slides_config');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error resetting hero slides config:', err);
    }
  };

  const addHeroSlide = (newSlide) => {
    setHeroSlides(prev => {
      const slideId = `slide-${Date.now()}`;
      const defaultNew = {
        id: slideId,
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
      };
      const updated = [...prev, defaultNew];
      try {
        localStorage.setItem('krishi_hero_slides_config', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const deleteHeroSlide = (index) => {
    setHeroSlides(prev => {
      if (prev.length <= 1) return prev;
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('krishi_hero_slides_config', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  // Update single home image
  const updateHomeImage = (imageKey, newUrl) => {
    setHomeImages(prev => {
      const updated = {
        ...prev,
        [imageKey]: {
          ...prev[imageKey],
          url: newUrl
        }
      };
      try {
        localStorage.setItem('krishi_home_images_config', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error persisting home images config:', err);
      }
      return updated;
    });
  };

  // Commit full home images
  const saveHomeImages = (newHomeImages) => {
    setHomeImages(newHomeImages);
    try {
      localStorage.setItem('krishi_home_images_config', JSON.stringify(newHomeImages));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving home images config:', err);
    }
  };

  // Reset home images
  const resetHomeImages = () => {
    setHomeImages(DEFAULT_HOME_IMAGES);
    try {
      localStorage.removeItem('krishi_home_images_config');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error resetting home images config:', err);
    }
  };

  // Update single footer image
  const updateFooterImage = (index, field, value) => {
    setFooterImages(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      try {
        localStorage.setItem('krishi_footer_images_config', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error persisting footer images config:', err);
      }
      return updated;
    });
  };

  // Commit full footer images
  const saveFooterImages = (newFooterImages) => {
    setFooterImages(newFooterImages);
    try {
      localStorage.setItem('krishi_footer_images_config', JSON.stringify(newFooterImages));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving footer images config:', err);
    }
  };

  // Reset footer images
  const resetFooterImages = () => {
    setFooterImages(DEFAULT_FOOTER_IMAGES);
    try {
      localStorage.removeItem('krishi_footer_images_config');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error resetting footer images config:', err);
    }
  };

  const addFooterImage = (newImg) => {
    setFooterImages(prev => {
      const defaultNew = {
        id: `footer-img-${Date.now()}`,
        title: 'Krishi Kutir Live Facility',
        subtitle: 'Harvest Snapshot',
        url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=600&q=80',
        ...(newImg || {})
      };
      const updated = [...prev, defaultNew];
      try {
        localStorage.setItem('krishi_footer_images_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteFooterImage = (index) => {
    setFooterImages(prev => {
      if (prev.length <= 1) return prev;
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('krishi_footer_images_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Update single event / workshop field
  const updateEventWorkshop = (index, field, value) => {
    setEventsWorkshops(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      try {
        localStorage.setItem('krishi_events_workshops_config', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error persisting events workshops config:', err);
      }
      return updated;
    });
  };

  // Commit full events & workshops
  const saveEventsWorkshops = (newEvents) => {
    setEventsWorkshops(newEvents);
    try {
      localStorage.setItem('krishi_events_workshops_config', JSON.stringify(newEvents));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving events workshops config:', err);
    }
  };

  // Reset events & workshops
  const resetEventsWorkshops = () => {
    setEventsWorkshops(DEFAULT_EVENTS_WORKSHOPS);
    try {
      localStorage.removeItem('krishi_events_workshops_config');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error resetting events workshops config:', err);
    }
  };

  const addEventWorkshop = (newEvent) => {
    setEventsWorkshops(prev => {
      const defaultNew = {
        id: `event-${Date.now()}`,
        title: 'New Workshop / Farm Session',
        location: 'Bhopal Chapter',
        desc: 'Interactive workshop on vertical microgreen cultivation and clean superfoods.',
        image: 'https://images.unsplash.com/photo-1544535830-9d5a6724cd31?auto=format&fit=crop&w=500&q=80',
        ...(newEvent || {})
      };
      const updated = [...prev, defaultNew];
      try {
        localStorage.setItem('krishi_events_workshops_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteEventWorkshop = (index) => {
    setEventsWorkshops(prev => {
      if (prev.length <= 1) return prev;
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('krishi_events_workshops_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Update single infrastructure card field
  const updateInfrastructureCard = (index, field, value) => {
    setInfrastructureCards(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      try {
        localStorage.setItem('krishi_infrastructure_cards_config', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error persisting infrastructure cards config:', err);
      }
      return updated;
    });
  };

  // Commit full infrastructure cards
  const saveInfrastructureCards = (newCards) => {
    setInfrastructureCards(newCards);
    try {
      localStorage.setItem('krishi_infrastructure_cards_config', JSON.stringify(newCards));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving infrastructure cards config:', err);
    }
  };

  // Reset infrastructure cards
  const resetInfrastructureCards = () => {
    setInfrastructureCards(DEFAULT_INFRASTRUCTURE_CARDS);
    try {
      localStorage.removeItem('krishi_infrastructure_cards_config');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error resetting infrastructure cards config:', err);
    }
  };

  const addInfrastructureCard = (newCard) => {
    setInfrastructureCards(prev => {
      const defaultNew = {
        id: `infra-${Date.now()}`,
        category: 'Supply Facility',
        title: 'New Infrastructure Unit',
        desc: 'Advanced automated climate-controlled racks and cold-chain distribution center.',
        badge: '100% Quality Inspected',
        image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
        ...(newCard || {})
      };
      const updated = [...prev, defaultNew];
      try {
        localStorage.setItem('krishi_infrastructure_cards_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteInfrastructureCard = (index) => {
    setInfrastructureCards(prev => {
      if (prev.length <= 1) return prev;
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('krishi_infrastructure_cards_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Update single division card field
  const updateDivisionCard = (index, field, value) => {
    setDivisionCards(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      try {
        localStorage.setItem('krishi_division_cards_config', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error persisting division cards config:', err);
      }
      return updated;
    });
  };

  // Commit full division cards
  const saveDivisionCards = (newCards) => {
    setDivisionCards(newCards);
    try {
      localStorage.setItem('krishi_division_cards_config', JSON.stringify(newCards));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving division cards config:', err);
    }
  };

  // Reset division cards
  const resetDivisionCards = () => {
    setDivisionCards(DEFAULT_DIVISION_CARDS);
    try {
      localStorage.removeItem('krishi_division_cards_config');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn('Error resetting division cards config:', err);
    }
  };

  const addDivisionCard = (newCard) => {
    setDivisionCards(prev => {
      const defaultNew = {
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
      };
      const updated = [...prev, defaultNew];
      try {
        localStorage.setItem('krishi_division_cards_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteDivisionCard = (index) => {
    setDivisionCards(prev => {
      if (prev.length <= 1) return prev;
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('krishi_division_cards_config', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <HomepageContentContext.Provider
      value={{
        founders,
        heroSlides,
        homeImages,
        footerImages,
        eventsWorkshops,
        infrastructureCards,
        divisionCards,
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
        savedSuccess
      }}
    >
      {children}
    </HomepageContentContext.Provider>
  );
};
