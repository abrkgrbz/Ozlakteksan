/**
 * Quick View Modal System
 * Ürün detaylarını modal içinde hızlı görüntüleme
 */
(function () {
    'use strict';

    // Quick View Modal Manager
    window.QuickView = {
        modal: null,
        currentProduct: null,

        /**
         * Initialize quick view modal
         */
        init: function() {
            this.createModal();
            this.attachEventListeners();
            console.log('✅ Quick View Modal initialized');
        },

        /**
         * Create modal structure
         */
        createModal: function() {
            // Check if modal already exists
            if (document.getElementById('quickViewModal')) {
                this.modal = document.getElementById('quickViewModal');
                return;
            }

            // Create modal HTML
            const modalHTML = `
                <div class="modal fade" id="quickViewModal" tabindex="-1" aria-labelledby="quickViewModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header border-bottom-0">
                                <h5 class="modal-title" id="quickViewModalLabel">
                                    <span class="quick-view-title">Ürün Detayı</span>
                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
                            </div>
                            <div class="modal-body">
                                <!-- Loading State -->
                                <div class="quick-view-loading text-center py-5">
                                    <div class="spinner-border text-primary mb-3" role="status">
                                        <span class="visually-hidden">Yükleniyor...</span>
                                    </div>
                                    <p class="text-muted">Ürün bilgileri yükleniyor...</p>
                                </div>

                                <!-- Content Container -->
                                <div class="quick-view-content d-none">
                                    <div class="row">
                                        <!-- Product Image Section -->
                                        <div class="col-md-5">
                                            <div class="quick-view-image-wrapper position-relative">
                                                <img src="" alt="" class="quick-view-image img-fluid rounded shadow-sm mb-3">
                                                <span class="quick-view-category badge bg-primary position-absolute top-0 start-0 m-2"></span>

                                                <!-- Action Buttons -->
                                                <div class="d-flex gap-2 mb-3">
                                                    <button type="button" class="btn btn-outline-danger btn-sm flex-fill quick-view-favorite" data-product-id="">
                                                        <i class="far fa-heart"></i> Favorilere Ekle
                                                    </button>
                                                    <button type="button" class="btn btn-outline-primary btn-sm flex-fill quick-view-compare" data-product-id="">
                                                        <i class="fas fa-balance-scale"></i> Karşılaştır
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Product Info Section -->
                                        <div class="col-md-7">
                                            <h3 class="quick-view-name fw-bold mb-3"></h3>

                                            <!-- Product Details -->
                                            <div class="quick-view-details mb-4">
                                                <h5 class="text-muted mb-3">Ürün Açıklaması</h5>
                                                <p class="quick-view-description"></p>
                                            </div>

                                            <!-- Features List -->
                                            <div class="quick-view-features mb-4">
                                                <h5 class="text-muted mb-3">Özellikler</h5>
                                                <ul class="list-unstyled quick-view-features-list">
                                                    <!-- Features will be inserted here -->
                                                </ul>
                                            </div>

                                            <!-- Applications -->
                                            <div class="quick-view-applications mb-4">
                                                <h5 class="text-muted mb-3">Kullanım Alanları</h5>
                                                <div class="quick-view-applications-list">
                                                    <!-- Application tags will be inserted here -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Error State -->
                                <div class="quick-view-error d-none text-center py-5">
                                    <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
                                    <h5>Hata Oluştu</h5>
                                    <p class="text-muted">Ürün bilgileri yüklenirken bir hata oluştu.</p>
                                    <button type="button" class="btn btn-primary btn-sm" onclick="QuickView.retry()">
                                        <i class="fas fa-redo"></i> Tekrar Dene
                                    </button>
                                </div>
                            </div>
                            <div class="modal-footer border-top-0">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                                <a href="#" class="btn btn-primary quick-view-details-link">
                                    <i class="fas fa-arrow-right me-2"></i>Tüm Detayları Gör
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.modal = document.getElementById('quickViewModal');
        },

        /**
         * Attach event listeners
         */
        attachEventListeners: function() {
            // Delegate event for quick view buttons
            document.addEventListener('click', (e) => {
                // Quick view button click
                if (e.target.closest('[data-quick-view]')) {
                    e.preventDefault();
                    const button = e.target.closest('[data-quick-view]');
                    const productId = button.getAttribute('data-quick-view');
                    this.show(productId);
                }

                // Favorite button click (inside modal)
                if (e.target.closest('.quick-view-favorite')) {
                    e.preventDefault();
                    const button = e.target.closest('.quick-view-favorite');
                    this.toggleFavorite(button);
                }

                // Compare button click (inside modal)
                if (e.target.closest('.quick-view-compare')) {
                    e.preventDefault();
                    const button = e.target.closest('.quick-view-compare');
                    this.toggleCompare(button);
                }
            });

            // Keyboard shortcut (ESC to close)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal) {
                    const modalInstance = bootstrap.Modal.getInstance(this.modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            });
        },

        /**
         * Show quick view modal
         * @param {string} productId - Product ID to display
         */
        show: function(productId) {
            // Reset modal state
            this.resetModal();

            // Show modal
            const modalInstance = new bootstrap.Modal(this.modal);
            modalInstance.show();

            // Load product data
            this.loadProduct(productId);
        },

        /**
         * Load product data
         * @param {string} productId - Product ID to load
         */
        loadProduct: function(productId) {
            // Show loading state
            this.setLoadingState(true);

            // Simulate API call (replace with actual AJAX call)
            setTimeout(() => {
                // Mock product data (replace with actual API response)
                const mockProducts = {
                    '1': {
                        id: 1,
                        name: 'NBR O-Ring Contalar',
                        category: 'Conta',
                        description: 'Yüksek kaliteli NBR (Nitril Kauçuk) malzemeden üretilmiş O-ring contalar. Mükemmel yağ ve yakıt direnci ile endüstriyel uygulamalarda güvenle kullanılır.',
                        image: '/images/products/o-ring.jpg',
                        features: [
                            'Sıcaklık dayanımı: -30°C ile +120°C arası',
                            'Yağ ve yakıt direnci',
                            'Standart ve özel ölçülerde üretim',
                            'Shore A 70-90 sertlik aralığı'
                        ],
                        applications: ['Hidrolik Sistemler', 'Pnömatik Sistemler', 'Otomotiv', 'Makine İmalatı']
                    },
                    '2': {
                        id: 2,
                        name: 'Titreşim Emici Kauçuk Takozlar',
                        category: 'Takoz',
                        description: 'Endüstriyel makinelerde titreşim ve gürültü kontrolü için özel olarak tasarlanmış kauçuk takozlar. Uzun ömürlü ve dayanıklı yapısıyla öne çıkar.',
                        image: '/images/products/vibration-mount.jpg',
                        features: [
                            'Yüksek titreşim sönümleme kapasitesi',
                            'Yağ ve ozon direnci',
                            '50-500 kg yük kapasitesi',
                            'Kolay montaj'
                        ],
                        applications: ['Kompresörler', 'Jeneratörler', 'Pompalar', 'CNC Makineleri']
                    }
                };

                const product = mockProducts[productId];

                if (product) {
                    this.displayProduct(product);
                } else {
                    // If product not found, make actual API call
                    this.fetchProductFromAPI(productId);
                }
            }, 800);
        },

        /**
         * Fetch product from API
         * @param {string} productId - Product ID to fetch
         */
        fetchProductFromAPI: function(productId) {
            fetch(`/api/products/${productId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Product not found');
                    return response.json();
                })
                .then(product => {
                    this.displayProduct(product);
                })
                .catch(error => {
                    console.error('Error loading product:', error);
                    this.setErrorState(true);
                });
        },

        /**
         * Display product in modal
         * @param {Object} product - Product data
         */
        displayProduct: function(product) {
            this.currentProduct = product;

            // Update modal content
            const modal = this.modal;

            // Title
            modal.querySelector('.quick-view-title').textContent = product.name;
            modal.querySelector('.quick-view-name').textContent = product.name;

            // Category
            modal.querySelector('.quick-view-category').textContent = product.category;

            // Description
            modal.querySelector('.quick-view-description').textContent = product.description;

            // Image
            const image = modal.querySelector('.quick-view-image');
            if (product.image) {
                image.src = product.image;
                image.alt = product.name;
            } else {
                // Use placeholder
                image.src = '/images/placeholder.jpg';
                image.alt = 'Ürün görseli mevcut değil';
            }

            // Features
            const featuresList = modal.querySelector('.quick-view-features-list');
            featuresList.innerHTML = '';
            if (product.features && product.features.length > 0) {
                product.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.className = 'mb-2';
                    li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${feature}`;
                    featuresList.appendChild(li);
                });
                modal.querySelector('.quick-view-features').classList.remove('d-none');
            } else {
                modal.querySelector('.quick-view-features').classList.add('d-none');
            }

            // Applications
            const applicationsList = modal.querySelector('.quick-view-applications-list');
            applicationsList.innerHTML = '';
            if (product.applications && product.applications.length > 0) {
                product.applications.forEach(app => {
                    const span = document.createElement('span');
                    span.className = 'badge bg-secondary me-2 mb-2';
                    span.textContent = app;
                    applicationsList.appendChild(span);
                });
                modal.querySelector('.quick-view-applications').classList.remove('d-none');
            } else {
                modal.querySelector('.quick-view-applications').classList.add('d-none');
            }

            // Action buttons
            modal.querySelector('.quick-view-favorite').setAttribute('data-product-id', product.id);
            modal.querySelector('.quick-view-compare').setAttribute('data-product-id', product.id);

            // Details link
            modal.querySelector('.quick-view-details-link').href = `/Products/Details/${product.id}`;

            // Check if already in favorites
            this.updateFavoriteButton();

            // Check if already in comparison
            this.updateCompareButton();

            // Hide loading, show content
            this.setLoadingState(false);
        },

        /**
         * Toggle favorite status
         * @param {HTMLElement} button - Favorite button element
         */
        toggleFavorite: function(button) {
            const productId = button.getAttribute('data-product-id');

            if (window.Favorites) {
                window.Favorites.toggle(productId);
                this.updateFavoriteButton();

                // Show toast notification
                const isFavorite = window.Favorites.isFavorite(productId);
                if (window.Toast) {
                    window.Toast.success(isFavorite ? 'Favorilere eklendi!' : 'Favorilerden çıkarıldı!');
                }
            } else {
                console.warn('Favorites system not initialized');
            }
        },

        /**
         * Toggle comparison status
         * @param {HTMLElement} button - Compare button element
         */
        toggleCompare: function(button) {
            const productId = button.getAttribute('data-product-id');

            if (window.ProductComparison) {
                window.ProductComparison.toggle(productId);
                this.updateCompareButton();

                // Show toast notification
                const inComparison = window.ProductComparison.isInComparison(productId);
                if (window.Toast) {
                    window.Toast.info(inComparison ? 'Karşılaştırma listesine eklendi!' : 'Karşılaştırma listesinden çıkarıldı!');
                }
            } else {
                console.warn('Product Comparison system not initialized');
            }
        },

        /**
         * Update favorite button state
         */
        updateFavoriteButton: function() {
            if (!window.Favorites || !this.currentProduct) return;

            const button = this.modal.querySelector('.quick-view-favorite');
            const isFavorite = window.Favorites.isFavorite(this.currentProduct.id);

            if (isFavorite) {
                button.innerHTML = '<i class="fas fa-heart"></i> Favorilerden Çıkar';
                button.classList.remove('btn-outline-danger');
                button.classList.add('btn-danger');
            } else {
                button.innerHTML = '<i class="far fa-heart"></i> Favorilere Ekle';
                button.classList.remove('btn-danger');
                button.classList.add('btn-outline-danger');
            }
        },

        /**
         * Update compare button state
         */
        updateCompareButton: function() {
            if (!window.ProductComparison || !this.currentProduct) return;

            const button = this.modal.querySelector('.quick-view-compare');
            const inComparison = window.ProductComparison.isInComparison(this.currentProduct.id);

            if (inComparison) {
                button.innerHTML = '<i class="fas fa-balance-scale"></i> Karşılaştırmadan Çıkar';
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-primary');
            } else {
                button.innerHTML = '<i class="fas fa-balance-scale"></i> Karşılaştır';
                button.classList.remove('btn-primary');
                button.classList.add('btn-outline-primary');
            }
        },

        /**
         * Reset modal to initial state
         */
        resetModal: function() {
            this.currentProduct = null;
            this.setLoadingState(true);
            this.setErrorState(false);
        },

        /**
         * Set loading state
         * @param {boolean} isLoading - Loading state
         */
        setLoadingState: function(isLoading) {
            const loading = this.modal.querySelector('.quick-view-loading');
            const content = this.modal.querySelector('.quick-view-content');
            const error = this.modal.querySelector('.quick-view-error');

            if (isLoading) {
                loading.classList.remove('d-none');
                content.classList.add('d-none');
                error.classList.add('d-none');
            } else {
                loading.classList.add('d-none');
                content.classList.remove('d-none');
                error.classList.add('d-none');
            }
        },

        /**
         * Set error state
         * @param {boolean} hasError - Error state
         */
        setErrorState: function(hasError) {
            const loading = this.modal.querySelector('.quick-view-loading');
            const content = this.modal.querySelector('.quick-view-content');
            const error = this.modal.querySelector('.quick-view-error');

            if (hasError) {
                loading.classList.add('d-none');
                content.classList.add('d-none');
                error.classList.remove('d-none');
            } else {
                error.classList.add('d-none');
            }
        },

        /**
         * Retry loading product
         */
        retry: function() {
            if (this.currentProduct) {
                this.loadProduct(this.currentProduct.id);
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => QuickView.init());
    } else {
        QuickView.init();
    }
})();