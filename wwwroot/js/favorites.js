/**
 * Favorites System
 * LocalStorage ile favori ürünleri yönetme
 */
(function () {
    'use strict';

    // Favorites Manager
    window.Favorites = {
        storageKey: 'ozlasteksan_favorites',
        favorites: [],
        maxFavorites: 50, // Maximum favori sayısı

        /**
         * Initialize favorites system
         */
        init: function() {
            this.loadFavorites();
            this.attachEventListeners();
            this.updateUI();
            console.log('✅ Favorites system initialized');
        },

        /**
         * Load favorites from localStorage
         */
        loadFavorites: function() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                this.favorites = stored ? JSON.parse(stored) : [];

                // Validate data
                if (!Array.isArray(this.favorites)) {
                    this.favorites = [];
                }

                // Clean up old data (keep only IDs)
                this.favorites = this.favorites.filter(id => id && typeof id !== 'object');
            } catch (error) {
                console.error('Error loading favorites:', error);
                this.favorites = [];
            }
        },

        /**
         * Save favorites to localStorage
         */
        saveFavorites: function() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
                this.notifyChange();
            } catch (error) {
                console.error('Error saving favorites:', error);
                if (window.Toast) {
                    window.Toast.error('Favoriler kaydedilemedi!');
                }
            }
        },

        /**
         * Attach event listeners
         */
        attachEventListeners: function() {
            // Delegate event for favorite buttons
            document.addEventListener('click', (e) => {
                // Favorite toggle button
                if (e.target.closest('[data-favorite-toggle]')) {
                    e.preventDefault();
                    const button = e.target.closest('[data-favorite-toggle]');
                    const productId = button.getAttribute('data-favorite-toggle');
                    this.toggle(productId);
                }

                // View favorites button
                if (e.target.closest('[data-favorites-view]')) {
                    e.preventDefault();
                    this.showFavoritesModal();
                }

                // Clear all favorites
                if (e.target.closest('[data-favorites-clear]')) {
                    e.preventDefault();
                    this.clearAll();
                }
            });

            // Listen for storage changes (other tabs)
            window.addEventListener('storage', (e) => {
                if (e.key === this.storageKey) {
                    this.loadFavorites();
                    this.updateUI();
                }
            });
        },

        /**
         * Toggle favorite status
         * @param {string} productId - Product ID
         */
        toggle: function(productId) {
            if (!productId) return;

            productId = String(productId);

            if (this.isFavorite(productId)) {
                this.remove(productId);
            } else {
                this.add(productId);
            }
        },

        /**
         * Add product to favorites
         * @param {string} productId - Product ID
         */
        add: function(productId) {
            if (!productId) return;

            productId = String(productId);

            // Check if already exists
            if (this.isFavorite(productId)) {
                return;
            }

            // Check max limit
            if (this.favorites.length >= this.maxFavorites) {
                if (window.Toast) {
                    window.Toast.warning(`Maksimum ${this.maxFavorites} favori ekleyebilirsiniz!`);
                }
                return;
            }

            // Add to favorites
            this.favorites.push(productId);
            this.saveFavorites();
            this.updateButtonState(productId, true);

            // Show notification
            if (window.Toast) {
                window.Toast.success('Favorilere eklendi!', 2000);
            }

            // Animate button
            this.animateButton(productId);
        },

        /**
         * Remove product from favorites
         * @param {string} productId - Product ID
         */
        remove: function(productId) {
            if (!productId) return;

            productId = String(productId);

            const index = this.favorites.indexOf(productId);
            if (index > -1) {
                this.favorites.splice(index, 1);
                this.saveFavorites();
                this.updateButtonState(productId, false);

                // Show notification
                if (window.Toast) {
                    window.Toast.info('Favorilerden çıkarıldı!', 2000);
                }
            }
        },

        /**
         * Clear all favorites
         */
        clearAll: function() {
            if (this.favorites.length === 0) {
                if (window.Toast) {
                    window.Toast.info('Favori listeniz zaten boş.');
                }
                return;
            }

            if (confirm('Tüm favorileri temizlemek istediğinize emin misiniz?')) {
                this.favorites = [];
                this.saveFavorites();
                this.updateUI();

                if (window.Toast) {
                    window.Toast.success('Tüm favoriler temizlendi!');
                }
            }
        },

        /**
         * Check if product is favorite
         * @param {string} productId - Product ID
         * @returns {boolean}
         */
        isFavorite: function(productId) {
            if (!productId) return false;
            return this.favorites.includes(String(productId));
        },

        /**
         * Get favorites count
         * @returns {number}
         */
        getCount: function() {
            return this.favorites.length;
        },

        /**
         * Get all favorites
         * @returns {Array}
         */
        getAll: function() {
            return [...this.favorites];
        },

        /**
         * Update UI for all favorite buttons
         */
        updateUI: function() {
            // Update all favorite toggle buttons
            document.querySelectorAll('[data-favorite-toggle]').forEach(button => {
                const productId = button.getAttribute('data-favorite-toggle');
                this.updateButtonState(productId, this.isFavorite(productId));
            });

            // Update favorites counter
            this.updateCounter();
        },

        /**
         * Update button state
         * @param {string} productId - Product ID
         * @param {boolean} isFavorite - Is favorite
         */
        updateButtonState: function(productId, isFavorite) {
            const buttons = document.querySelectorAll(`[data-favorite-toggle="${productId}"]`);

            buttons.forEach(button => {
                const icon = button.querySelector('i');
                const text = button.querySelector('.favorite-text');

                if (isFavorite) {
                    button.classList.add('is-favorite');
                    button.classList.remove('btn-outline-danger');
                    button.classList.add('btn-danger');

                    if (icon) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    }

                    if (text) {
                        text.textContent = 'Favorilerden Çıkar';
                    }

                    button.setAttribute('aria-pressed', 'true');
                    button.setAttribute('title', 'Favorilerden çıkar');
                } else {
                    button.classList.remove('is-favorite');
                    button.classList.add('btn-outline-danger');
                    button.classList.remove('btn-danger');

                    if (icon) {
                        icon.classList.add('far');
                        icon.classList.remove('fas');
                    }

                    if (text) {
                        text.textContent = 'Favorilere Ekle';
                    }

                    button.setAttribute('aria-pressed', 'false');
                    button.setAttribute('title', 'Favorilere ekle');
                }
            });
        },

        /**
         * Animate favorite button
         * @param {string} productId - Product ID
         */
        animateButton: function(productId) {
            const buttons = document.querySelectorAll(`[data-favorite-toggle="${productId}"]`);

            buttons.forEach(button => {
                const icon = button.querySelector('i');
                if (icon) {
                    // Add animation class
                    icon.classList.add('favorite-animation');

                    // Remove animation class after completion
                    setTimeout(() => {
                        icon.classList.remove('favorite-animation');
                    }, 600);
                }
            });
        },

        /**
         * Update favorites counter
         */
        updateCounter: function() {
            const count = this.getCount();
            const counters = document.querySelectorAll('[data-favorites-count]');

            counters.forEach(counter => {
                counter.textContent = count;

                // Show/hide counter based on count
                if (count > 0) {
                    counter.classList.remove('d-none');
                    counter.classList.add('favorites-badge-animate');

                    setTimeout(() => {
                        counter.classList.remove('favorites-badge-animate');
                    }, 300);
                } else {
                    counter.classList.add('d-none');
                }
            });
        },

        /**
         * Show favorites modal
         */
        showFavoritesModal: function() {
            // Create modal if it doesn't exist
            if (!document.getElementById('favoritesModal')) {
                this.createFavoritesModal();
            }

            // Load favorites data
            this.loadFavoritesData();

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('favoritesModal'));
            modal.show();
        },

        /**
         * Create favorites modal
         */
        createFavoritesModal: function() {
            const modalHTML = `
                <div class="modal fade" id="favoritesModal" tabindex="-1" aria-labelledby="favoritesModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="favoritesModalLabel">
                                    <i class="fas fa-heart text-danger me-2"></i>Favori Ürünlerim
                                    <span class="badge bg-secondary ms-2" data-favorites-modal-count>0</span>
                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
                            </div>
                            <div class="modal-body">
                                <div id="favoritesContent">
                                    <!-- Content will be loaded here -->
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-danger btn-sm" data-favorites-clear>
                                    <i class="fas fa-trash me-2"></i>Tümünü Temizle
                                </button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },

        /**
         * Load favorites data into modal
         */
        loadFavoritesData: function() {
            const container = document.getElementById('favoritesContent');
            const countBadge = document.querySelector('[data-favorites-modal-count]');

            if (!container) return;

            const count = this.getCount();

            // Update count badge
            if (countBadge) {
                countBadge.textContent = count;
            }

            if (count === 0) {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="far fa-heart fa-4x text-muted mb-3"></i>
                        <h5 class="text-muted">Henüz favori ürün eklemediniz</h5>
                        <p class="text-muted">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.</p>
                        <a href="/Products" class="btn btn-primary mt-3">
                            <i class="fas fa-shopping-bag me-2"></i>Ürünleri Keşfet
                        </a>
                    </div>
                `;
                return;
            }

            // Load favorite products (mock data for now)
            const favoritesHTML = this.favorites.map(productId => {
                // This would normally fetch product data from API
                return `
                    <div class="favorite-item border rounded p-3 mb-3" data-favorite-item="${productId}">
                        <div class="row align-items-center">
                            <div class="col-md-8">
                                <h6 class="mb-1">Ürün #${productId}</h6>
                                <p class="text-muted mb-0 small">Ürün açıklaması...</p>
                            </div>
                            <div class="col-md-4 text-end">
                                <button class="btn btn-sm btn-outline-danger me-2" data-favorite-toggle="${productId}">
                                    <i class="fas fa-heart"></i>
                                </button>
                                <a href="/Products/Details/${productId}" class="btn btn-sm btn-primary">
                                    <i class="fas fa-eye"></i> Görüntüle
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = `
                <div class="favorites-list">
                    ${favoritesHTML}
                </div>
            `;
        },

        /**
         * Notify change to other components
         */
        notifyChange: function() {
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('favoritesChanged', {
                detail: {
                    favorites: this.favorites,
                    count: this.favorites.length
                }
            }));
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Favorites.init());
    } else {
        Favorites.init();
    }
})();