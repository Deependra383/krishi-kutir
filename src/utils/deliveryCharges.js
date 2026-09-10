// Delivery and Courier charges calculation engine
// Origin: Bhopal, Madhya Pradesh, India (Krishi Kutir Vertical Farm & Processing Facility)

export const DEFAULT_COURIER_SETTINGS = {
  originCity: 'Bhopal',
  originState: 'Madhya Pradesh',
  originPincode: '462036',
  
  zones: {
    localBhopal: {
      id: 'localBhopal',
      name: 'Bhopal Intra-City (Local Dispatch)',
      shortLabel: 'Bhopal Local',
      rate: 40,
      freeThreshold: 499,
      estimatedDelivery: 'Same Day / Within 24 Hours',
      carrier: 'Krishi Kutir Local Express / Porter',
      description: 'Direct dispatch from our Bhopal facility'
    },
    regionalMP: {
      id: 'regionalMP',
      name: 'Madhya Pradesh (Intra-State Courier)',
      shortLabel: 'MP Regional',
      rate: 70,
      freeThreshold: 999,
      estimatedDelivery: '1 - 2 Business Days',
      carrier: 'Delhivery / DTDC Surface Cargo',
      description: 'Regional express ground courier across MP'
    },
    panIndia: {
      id: 'panIndia',
      name: 'Rest of India (National Air / Surface)',
      shortLabel: 'Pan-India Courier',
      rate: 110,
      freeThreshold: 1499,
      estimatedDelivery: '3 - 5 Business Days',
      carrier: 'Blue Dart / Delhivery Express Air',
      description: 'All Metros, Tier 1 & Tier 2 cities across India'
    },
    remoteRegion: {
      id: 'remoteRegion',
      name: 'Special Zones (North-East, J&K, Islands)',
      shortLabel: 'Special Remote Zone',
      rate: 160,
      freeThreshold: 2499,
      estimatedDelivery: '5 - 7 Business Days',
      carrier: 'India Post Speed Post / Air Cargo',
      description: 'Assam, NE States, J&K, Ladakh, Andaman & Nicobar'
    }
  }
};

const STORAGE_KEY = 'krishi_courier_settings';

/**
 * Retrieve saved courier rates or fall back to defaults
 */
export const getCourierSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_COURIER_SETTINGS,
        ...parsed,
        zones: {
          ...DEFAULT_COURIER_SETTINGS.zones,
          ...(parsed.zones || {})
        }
      };
    }
  } catch (e) {
    console.warn('Failed to parse courier settings from localStorage:', e);
  }
  return DEFAULT_COURIER_SETTINGS;
};

/**
 * Save custom courier settings (used in Admin Panel)
 */
export const saveCourierSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('krishi_courier_settings_updated'));
    return true;
  } catch (e) {
    console.error('Failed to save courier settings:', e);
    return false;
  }
};

/**
 * Reset courier settings to defaults
 */
export const resetCourierSettings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('krishi_courier_settings_updated'));
    return DEFAULT_COURIER_SETTINGS;
  } catch {
    return DEFAULT_COURIER_SETTINGS;
  }
};

/**
 * Clean and normalize string for comparison
 */
const cleanStr = (str) => (str || '').trim().toLowerCase();

/**
 * Check if the provided city, state, or pincode belongs to Bhopal
 */
export const isBhopalLocation = ({ city = '', pincode = '' }) => {
  const c = cleanStr(city);
  const pin = (pincode || '').toString().trim();

  // Explicit city match
  if (c.includes('bhopal')) return true;

  // Bhopal PIN codes start with 462 (e.g. 462001, 462002, ..., 462050)
  if (/^462\d{3}$/.test(pin) || pin.startsWith('462')) {
    return true;
  }

  return false;
};

/**
 * Check if the location is in Madhya Pradesh (outside Bhopal)
 */
export const isMadhyaPradeshLocation = ({ city = '', state = '', pincode = '' }) => {
  const c = cleanStr(city);
  const s = cleanStr(state);
  const pin = (pincode || '').toString().trim();

  // Known major MP cities
  const mpCities = [
    'indore', 'jabalpur', 'gwalior', 'ujjain', 'sagar', 'dewas', 'satna',
    'ratlam', 'rewa', 'katni', 'singrauli', 'burhanpur', 'khandwa', 'morena',
    'bhind', 'chhindwara', 'guna', 'shivpuri', 'vidisha', 'damoh', 'mandsaur',
    'khargone', 'neemuch', 'pithampur', 'sehore', 'hoshangabad', 'narmadapuram',
    'itarsi', 'betul', 'harda', 'dhar', 'nagda'
  ];

  if (s === 'madhya pradesh' || s === 'mp' || s.includes('madhya')) {
    return true;
  }

  if (mpCities.some(cityItem => c.includes(cityItem))) {
    return true;
  }

  // MP PIN codes generally range from 450000 to 489999
  const pinNum = parseInt(pin, 10);
  if (!isNaN(pinNum) && pinNum >= 450000 && pinNum <= 489999) {
    return true;
  }

  return false;
};

/**
 * Check if the location is in special remote zones (North-East, J&K, Ladakh, Andaman)
 */
export const isRemoteRegion = ({ city = '', state = '', pincode = '' }) => {
  const c = cleanStr(city);
  const s = cleanStr(state);
  const pin = (pincode || '').toString().trim();

  // Remote states
  const remoteStates = [
    'jammu', 'kashmir', 'ladakh', 'assam', 'meghalaya', 'manipur', 
    'mizoram', 'nagaland', 'tripura', 'arunachal', 'sikkim', 
    'andaman', 'nicobar', 'lakshadweep'
  ];

  if (remoteStates.some(rs => s.includes(rs) || c.includes(rs))) {
    return true;
  }

  // Remote PIN prefixes:
  // 18, 19: J&K, Ladakh
  // 737: Sikkim
  // 78, 79: Assam & North Eastern States
  // 744: Andaman & Nicobar
  if (/^(18|19|737|78|79|744)/.test(pin)) {
    return true;
  }

  return false;
};

/**
 * Determine delivery zone based on city, state, and pincode
 */
export const detectDeliveryZone = ({ city = '', state = '', pincode = '' }) => {
  const settings = getCourierSettings();

  // 1. Bhopal Local Check
  if (isBhopalLocation({ city, pincode })) {
    return settings.zones.localBhopal;
  }

  // 2. Special Remote Zone Check
  if (isRemoteRegion({ city, state, pincode })) {
    return settings.zones.remoteRegion;
  }

  // 3. Madhya Pradesh Regional Check
  if (isMadhyaPradeshLocation({ city, state, pincode })) {
    return settings.zones.regionalMP;
  }

  // 4. Default: Pan-India Rest of India
  return settings.zones.panIndia;
};

/**
 * Calculate the exact delivery fee and return detailed breakdown
 * @param {Object} params
 * @param {string} params.city - Customer city
 * @param {string} params.state - Customer state
 * @param {string} params.pincode - Customer pincode
 * @param {number} params.subtotal - Total order items price
 * @returns {Object} Full delivery calculation details
 */
export const calculateDelivery = ({ city = '', state = '', pincode = '', subtotal = 0 }) => {
  // If no location provided at all, default to Bhopal Local for store preview
  const effectiveCity = city || (!pincode ? 'Bhopal' : '');
  const zone = detectDeliveryZone({ city: effectiveCity, state, pincode });
  
  const standardFee = Number(zone.rate) || 0;
  const freeThreshold = Number(zone.freeThreshold) || 0;
  
  const isFree = subtotal >= freeThreshold;
  const deliveryFee = isFree ? 0 : standardFee;
  const amountNeededForFree = Math.max(0, freeThreshold - subtotal);
  const isBhopalLocal = zone.id === 'localBhopal';

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    shortLabel: zone.shortLabel,
    description: zone.description,
    carrier: zone.carrier,
    estimatedDelivery: zone.estimatedDelivery,
    standardFee,
    freeThreshold,
    isFree,
    deliveryFee,
    amountNeededForFree,
    isBhopalLocal,
    subtotal,
    grandTotal: subtotal + deliveryFee
  };
};
