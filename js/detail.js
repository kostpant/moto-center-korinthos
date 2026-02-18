/**
 * detail.js - Logic for the bike detail page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the detail page
  if (!document.getElementById('bikeTitle')) return;
  
  initDetailPage();
});

/**
 * Initialize the detail page
 */
async function initDetailPage() {
  // Get bike ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const bikeId = urlParams.get('id');
  
  if (!bikeId) {
    showError('Δεν βρέθηκε μοτοσυκλέτα');
    return;
  }
  
  // Fetch bike data
  const bike = await fetchBikeById(bikeId);
  
  if (!bike) {
    showError('Η μοτοσυκλέτα δεν βρέθηκε');
    return;
  }
  
  // Render bike details
  renderBikeDetails(bike);
  
  // Load related bikes
  loadRelatedBikes(bike);
}

/**
 * Render bike details on the page
 * @param {Object} bike - Bike object
 */
function renderBikeDetails(bike) {
  const fields = bike.fields;
  
  // Update header
  document.getElementById('bikeBrand').textContent = fields.Brand;
  document.getElementById('bikeTitle').textContent = fields.Title;
  document.getElementById('bikePrice').textContent = `${fields.Price.toLocaleString()} €`;
  
  // Update status badge
  const statusEl = document.getElementById('bikeStatus');
  statusEl.textContent = fields.Status === 'Sold' ? 'Πωλήθηκε' : 'Διαθέσιμο';
  if (fields.Status === 'Sold') {
    statusEl.classList.add('bike-header__status--sold');
  }
  
  // Update description
  document.getElementById('bikeDescription').textContent = fields.Description || 
    'Δεν υπάρχει διαθέσιμη περιγραφή για αυτή τη μοτοσυκλέτα.';
  
  // Update specifications table
  renderSpecsTable(fields);
  
  // Initialize gallery
  initGallery(fields.Images);
}

/**
 * Render specifications table
 * @param {Object} fields - Bike fields
 */
function renderSpecsTable(fields) {
  const specsTable = document.getElementById('specsTable');
  
  const specs = [
    { label: 'Μάρκα', value: fields.Brand },
    { label: 'Κατηγορία', value: fields.Category },
    { label: 'Έτος', value: fields.Year },
    { label: 'Κυβισμός', value: `${fields.Engine_CC}cc` },
    { label: 'Χιλιόμετρα', value: fields.Mileage.toLocaleString() },
    { label: 'Χρώμα', value: fields.Color },
    { label: 'Κατάσταση', value: fields.Status === 'Sold' ? 'Πωλημένη' : 'Διαθέσιμη' }
  ];
  
  specsTable.innerHTML = specs.map(spec => `
    <tr class="specs-table__row">
      <td class="specs-table__cell specs-table__cell--label">${spec.label}</td>
      <td class="specs-table__cell specs-table__cell--value">${spec.value}</td>
    </tr>
  `).join('');
}

/**
 * Initialize image gallery
 * @param {Array} images - Array of image objects
 */
function initGallery(images) {
  const mainImage = document.getElementById('mainImage');
  const galleryThumbs = document.getElementById('galleryThumbs');
  
  // Default placeholder if no images
  const defaultImage = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=500&fit=crop';
  const imageList = images && images.length > 0 ? images : [{ url: defaultImage }];
  
  // Set main image
  mainImage.src = imageList[0].url;
  mainImage.alt = 'Motorcycle Image';
  
  // Generate thumbnails
  if (imageList.length > 1) {
    galleryThumbs.innerHTML = imageList.map((img, index) => `
      <div class="gallery__thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
        <img src="${img.url}" alt="Thumbnail ${index + 1}" loading="lazy">
      </div>
    `).join('');
    
    // Add click handlers
    galleryThumbs.querySelectorAll('.gallery__thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.index);
        mainImage.src = imageList[index].url;
        
        // Update active state
        galleryThumbs.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }
}

/**
 * Load related bikes
 * @param {Object} currentBike - Current bike object
 */
async function loadRelatedBikes(currentBike) {
  const allBikes = await fetchBikes();
  const currentFields = currentBike.fields;
  
  // Find related bikes (same brand or category, excluding current)
  const relatedBikes = allBikes
    .filter(bike => 
      bike.id !== currentBike.id && 
      (bike.fields.Brand === currentFields.Brand || 
       bike.fields.Category === currentFields.Category)
    )
    .slice(0, 3);
  
  const relatedContainer = document.getElementById('relatedBikes');
  
  if (relatedBikes.length === 0) {
    relatedContainer.innerHTML = '<p class="text-center text-muted col-span-3">Δεν βρέθηκαν παρόμοιες μοτοσυκλέτες</p>';
    return;
  }
  
  relatedContainer.innerHTML = relatedBikes.map(bike => createRelatedBikeCard(bike)).join('');
}

/**
 * Create HTML for a related bike card
 * @param {Object} bike - Bike object
 * @returns {string} HTML string
 */
function createRelatedBikeCard(bike) {
  const fields = bike.fields;
  const imageUrl = fields.Images && fields.Images[0] 
    ? fields.Images[0].url 
    : 'https://via.placeholder.com/600x400';
  
  return `
    <article class="bike-card">
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
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
  const container = document.querySelector('.section--light .container');
  container.innerHTML = `
    <div class="text-center py-20">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 64px; height: 64px; color: var(--color-text-muted); margin: 0 auto 16px;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <h3 class="font-heading text-2xl mb-2">${message}</h3>
      <a href="bikes.html" class="btn btn--primary mt-4">Επιστροφή στο Showroom</a>
    </div>
  `;
}
