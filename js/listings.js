/**
 * listings.js - Logic for the bikes listing page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the listings page
  if (!document.getElementById('bikesGrid')) return;
  
  initListings();
});

// State
let allBikes = [];
let currentFilters = {
  brand: '',
  category: '',
  status: ''
};

/**
 * Initialize the listings page
 */
async function initListings() {
  // Load bikes data
  allBikes = await fetchBikes();
  
  // Render initial grid
  renderBikesGrid(allBikes);
  
  // Initialize filters
  initFilters();
  
  // Initialize scroll animations for cards
  initCardAnimations();
}

/**
 * Render the bikes grid
 * @param {Array} bikes - Array of bike objects
 */
function renderBikesGrid(bikes) {
  const grid = document.getElementById('bikesGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');
  
  // Update count
  resultsCount.textContent = bikes.length;
  
  // Show/hide no results message
  if (bikes.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  
  noResults.classList.add('hidden');
  
  // Generate HTML for each bike
  grid.innerHTML = bikes.map(bike => createBikeCard(bike)).join('');
}

/**
 * Create HTML for a single bike card
 * @param {Object} bike - Bike object
 * @returns {string} HTML string
 */
function createBikeCard(bike) {
  const fields = bike.fields;
  const imageUrl = fields.Images && fields.Images[0] 
    ? fields.Images[0].url 
    : 'https://via.placeholder.com/600x400';
  
  return `
    <article class="bike-card reveal">
      <div class="bike-card__header">
        <h3 class="bike-card__title">${fields.Title}</h3>
      </div>
      <div class="bike-card__img-wrap">
        <img class="bike-card__img" src="${imageUrl}" alt="${fields.Title}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x400'">
      </div>
      <div class="bike-card__specs">
        <div class="bike-card__spec-row">
          <span class="bike-card__spec-label">ΕΤΟΣ:</span>
          <span class="bike-card__spec-value">${fields.Year}</span>
          <span class="bike-card__price">${fields.Price ? fields.Price.toLocaleString('el-GR') + ' €' : 'Κατόπιν επικοινωνίας'}</span>
        </div>
        <div class="bike-card__spec-row">
          <span class="bike-card__spec-label">ΧΡΩΜΑ:</span>
          <span class="bike-card__spec-value">${fields.Color || '—'}</span>
        </div>
        <div class="bike-card__spec-row">
          <span class="bike-card__spec-label">ΧΙΛΙΟΜΕΤΡΑ:</span>
          <span class="bike-card__spec-value">${fields.Mileage ? fields.Mileage.toLocaleString('el-GR') + ' km' : '0 km'}</span>
        </div>
      </div>
      <div class="bike-card__divider"></div>
      <a href="bike-detail.html?id=${bike.id}" class="bike-card__cta">Προβολή</a>
    </article>
  `;
}

/**
 * Initialize filter functionality
 */
function initFilters() {
  const brandFilter = document.getElementById('brandFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  
  // Add event listeners
  brandFilter.addEventListener('change', handleFilterChange);
  categoryFilter.addEventListener('change', handleFilterChange);
  statusFilter.addEventListener('change', handleFilterChange);
  
  // Check URL params for initial filters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('brand')) {
    brandFilter.value = urlParams.get('brand');
    currentFilters.brand = urlParams.get('brand');
  }
}

/**
 * Handle filter changes
 */
function handleFilterChange() {
  const brandFilter = document.getElementById('brandFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  
  currentFilters = {
    brand: brandFilter.value,
    category: categoryFilter.value,
    status: statusFilter.value
  };
  
  // Apply filters
  const filteredBikes = filterBikes(allBikes, currentFilters);
  renderBikesGrid(filteredBikes);
  
  // Re-initialize scroll animations for new cards
  initCardAnimations();
}

/**
 * Filter bikes based on criteria
 * @param {Array} bikes - Array of bikes
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered bikes
 */
function filterBikes(bikes, filters) {
  return bikes.filter(bike => {
    const fields = bike.fields;
    
    if (filters.brand && fields.Brand !== filters.brand) return false;
    if (filters.category && fields.Category !== filters.category) return false;
    if (filters.status && fields.Status !== filters.status) return false;
    
    return true;
  });
}

/**
 * Initialize scroll animations for bike cards
 */
function initCardAnimations() {
  const cards = document.querySelectorAll('.bike-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  cards.forEach(card => observer.observe(card));
}
