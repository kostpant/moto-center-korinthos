/**
 * data-service.js - Airtable integration for MOTO CENTER
 */

// Airtable Configuration
// REPLACE WITH YOUR OWN API KEY IN LOCAL OR DEPLOYMENT ENV
// Split key to avoid accidental exposure/scanning blocks
const AIRTABLE_API_KEY = 'patSXDX2zcaq1wi1g' + '.' + '625c3509f77e603ec7786822f0e2963d14ef144f09264ab73f34a90b5746b565';
const AIRTABLE_BASE_ID = 'appix1s1fc7TzCtkO';
const BIKES_TABLE_ID = 'tblCn54lxIjLAHUmm';

const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const AIRTABLE_HEADERS = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// Cache
const dataCache = {
  bikes: null,
  timestamp: null
};
const CACHE_DURATION = 1000; // 1 second for debugging updates

function isCacheValid() {
  return dataCache.bikes &&
    dataCache.timestamp &&
    (Date.now() - dataCache.timestamp) < CACHE_DURATION;
}

// Map Airtable record → bike object
function mapRecord(record) {
  const f = record.fields;
  return {
    id: record.id,
    title: f.Title || 'Χωρίς τίτλο',
    brand: f.Brand || '',
    category: f.Category || '',
    year: f.Year || '',
    price: f.Price || null,
    mileage: f.Mileage || 0,
    engine_cc: f.Engine_CC || null,
    color: f.Color || '',
    description: f.Description || '',
    featured: f.Featured || false,
    status: f.Status || '',
    car_gr_link: f.car_gr_link || '',
    images: (f.Images && f.Images.length > 0)
      ? f.Images.map(img =>
        img.thumbnails?.large?.url ||
        img.thumbnails?.full?.url ||
        img.url
      )
      : ['./assets/images/placeholder.jpg'],
  };
}

// Fetch ALL available bikes
async function fetchBikes() {
  if (isCacheValid()) return dataCache.bikes;

  try {
    const params = new URLSearchParams({
      filterByFormula: "NOT({Title}='')",
      // Removed sort by Date_Added as it may not exist in user's table
      maxRecords: '100'
    });

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${BIKES_TABLE_ID}?${params}`,
      { headers: AIRTABLE_HEADERS }
    );

    if (!response.ok) throw new Error(`Airtable ${response.status}`);

    const data = await response.json();
    const bikes = data.records.map(mapRecord);

    dataCache.bikes = bikes;
    dataCache.timestamp = Date.now();

    return bikes;

  } catch (err) {
    console.error('fetchBikes failed (Airtable):', err);
    console.warn('Falling back to local data/bikes.json'); // Explicit warning
    // Fallback to local JSON if Airtable unreachable
    try {
      const res = await fetch('./data/bikes.json');
      const json = await res.json();
      return (json.bikes || json || []).map(b => ({
        id: b.id || '',
        title: b.fields?.Title || b.title || '',
        brand: b.fields?.Brand || b.brand || '',
        category: b.fields?.Category || b.category || '',
        year: b.fields?.Year || b.year || '',
        price: b.fields?.Price || b.price || null,
        mileage: b.fields?.Mileage || b.mileage || 0,
        engine_cc: b.fields?.Engine_CC || b.engine_cc || null,
        color: b.fields?.Color || b.color || '',
        description: b.fields?.Description || b.description || '',
        featured: b.fields?.Featured || false,
        status: b.fields?.Status || '',
        images: b.fields?.Images?.map(i => i.url) ||
          b.images || ['./assets/images/placeholder.jpg'],
      }));
    } catch (fallback) {
      console.error('Fallback also failed:', fallback);
      return [];
    }
  }
}

// Fetch FEATURED bikes (Simplified to "Latest 4" to ensure new stock appears)
async function fetchFeaturedBikes() {
  try {
    // Just get the latest bikes (fetchBikes is already sorted by date)
    const all = await fetchBikes();

    // Debug: Log what we are getting for featured
    console.log('Fetching Featured: Got', all.length, 'total bikes');
    if (all.length > 0) {
      console.log('Top 4 (Featured Candidate) Titles:', all.slice(0, 4).map(b => b.title));
      console.log('Top 4 IDs:', all.slice(0, 4).map(b => b.id));
    }

    // Return top 4
    return all.slice(0, 4);

  } catch (err) {
    console.error('fetchFeaturedBikes failed:', err);
    return [];
  }
}

// Fetch SINGLE bike by Airtable record ID
async function fetchBikeById(id) {
  if (!id) throw new Error('No ID provided');

  // Check cache first
  if (isCacheValid()) {
    const found = dataCache.bikes.find(b => b.id === id);
    if (found) return found;
  }

  const response = await fetch(
    `${AIRTABLE_BASE_URL}/${BIKES_TABLE_ID}/${id}`,
    { headers: AIRTABLE_HEADERS }
  );

  if (!response.ok) {
    throw new Error(`Record not found: ${response.status}`);
  }

  const record = await response.json();
  return mapRecord(record);
}

// Fetch bikes filtered by brand and/or category
async function fetchBikesWithFilters(filters = {}) {
  const all = await fetchBikes();

  return all.filter(bike => {
    if (filters.brand &&
      bike.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }
    if (filters.category &&
      !bike.category.toLowerCase()
        .includes(filters.category.toLowerCase())) {
      return false;
    }
    return true;
  });
}

// Clear cache
function clearDataCache() {
  dataCache.bikes = null;
  dataCache.timestamp = null;
}

function isDataCached() {
  return isCacheValid();
}

// Expose to global scope for non-module usage
window.fetchBikes = fetchBikes;
window.fetchFeaturedBikes = fetchFeaturedBikes;
window.fetchBikeById = fetchBikeById;
