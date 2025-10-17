/**
 * Product Comparison System
 * 2-4 ürünü yan yana karşılaştırma
 */
(function () {
    'use strict';

    // Product Comparison Manager
    window.ProductComparison = {
        storageKey: 'ozlasteksan_comparison',
        compareList: [],
        maxProducts: 4, // Maksimum karşılaştırılacak ürün sayısı
        minProducts: 2, // Minimum karşılaştırılacak ürün sayısı

        /**
         * Initialize comparison system
         */
        init: function() {
            this.loadComparisonList();
            this.attachEventListeners();
            this.updateUI();
            this.createFloatingButton();
            console.log('✅ Product Comparison system initialized');
        },

        /**
         * Load comparison list from localStorage
         */
        loadComparisonList: function() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                this.compareList = stored ? JSON.parse(stored) : [];

                // Validate data
                if (!Array.isArray(this.compareList)) {
                    this.compareList = [];
                }

                // Limit to max products
                if (this.compareList.length > this.maxProducts) {
                    this.compareList = this.compareList.slice(0, this.maxProducts);
                    this.saveComparisonList();
                }
            } catch (error) {
                console.error('Error loading comparison list:', error);
                this.compareList = [];
            }
        },

        /**
         * Save comparison list to localStorage
         */
        saveComparisonList: function() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.compareList));
                this.notifyChange();
                this.updateFloatingButton();
            } catch (error) {
                console.error('Error saving comparison list:', error);
                if (window.Toast) {
                    window.Toast.error('Karşılaştırma listesi kaydedilemedi!');
                }
            }
        },

        /**
         * Create floating comparison button
         */
        createFloatingButton: function() {
            // Check if button already exists
            if (document.getElementById('comparisonFloatingBtn')) return;

            const buttonHTML = `
                <div id="comparisonFloatingBtn" class="comparison-floating-btn d-none">
                    <button type="button" class="btn btn-primary btn-lg shadow-lg" data-comparison-show>
                        <i class="fas fa-balance-scale me-2"></i>
                        Karşılaştır (<span data-comparison-count>0</span>)
                    </button>
                    <button type="button" class="btn btn-danger btn-sm ms-2" data-comparison-clear title="Listeyi Temizle">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', buttonHTML);
        },

        /**
         * Attach event listeners
         */
        attachEventListeners: function() {
            // Delegate events
            document.addEventListener('click', (e) => {
                // Compare toggle button
                if (e.target.closest('[data-compare-toggle]')) {
                    e.preventDefault();
                    const button = e.target.closest('[data-compare-toggle]');
                    const productId = button.getAttribute('data-compare-toggle');
                    this.toggle(productId);
                }

                // Show comparison
                if (e.target.closest('[data-comparison-show]')) {
                    e.preventDefault();
                    this.showComparisonModal();
                }

                // Clear comparison list
                if (e.target.closest('[data-comparison-clear]')) {
                    e.preventDefault();
                    this.clearAll();
                }

                // Remove single item from comparison
                if (e.target.closest('[data-comparison-remove]')) {
                    e.preventDefault();
                    const productId = e.target.closest('[data-comparison-remove]').getAttribute('data-comparison-remove');
                    this.remove(productId);
                }
            });

            // Listen for storage changes (other tabs)
            window.addEventListener('storage', (e) => {
                if (e.key === this.storageKey) {
                    this.loadComparisonList();
                    this.updateUI();
                }
            });
        },

        /**
         * Toggle product in comparison list
         * @param {string} productId - Product ID
         */
        toggle: function(productId) {
            if (!productId) return;

            productId = String(productId);

            if (this.isInComparison(productId)) {
                this.remove(productId);
            } else {
                this.add(productId);
            }
        },

        /**
         * Add product to comparison
         * @param {string} productId - Product ID
         */
        add: function(productId) {
            if (!productId) return;

            productId = String(productId);

            // Check if already exists
            if (this.isInComparison(productId)) {
                return;
            }

            // Check max limit
            if (this.compareList.length >= this.maxProducts) {
                if (window.Toast) {
                    window.Toast.warning(`En fazla ${this.maxProducts} ürün karşılaştırabilirsiniz!`);
                }
                return;
            }

            // Add to comparison list
            this.compareList.push(productId);
            this.saveComparisonList();
            this.updateButtonState(productId, true);

            // Show notification
            if (window.Toast) {
                window.Toast.info(`Karşılaştırma listesine eklendi (${this.compareList.length}/${this.maxProducts})`, 2000);
            }

            // Animate button
            this.animateButton(productId);
        },

        /**
         * Remove product from comparison
         * @param {string} productId - Product ID
         */
        remove: function(productId) {
            if (!productId) return;

            productId = String(productId);

            const index = this.compareList.indexOf(productId);
            if (index > -1) {
                this.compareList.splice(index, 1);
                this.saveComparisonList();
                this.updateButtonState(productId, false);

                // Show notification
                if (window.Toast) {
                    window.Toast.info('Karşılaştırma listesinden çıkarıldı', 2000);
                }

                // Update modal if open
                const modal = document.getElementById('comparisonModal');
                if (modal && bootstrap.Modal.getInstance(modal)) {
                    this.loadComparisonData();
                }
            }
        },

        /**
         * Clear all comparison list
         */
        clearAll: function() {
            if (this.compareList.length === 0) {
                if (window.Toast) {
                    window.Toast.info('Karşılaştırma listesi zaten boş.');
                }
                return;
            }

            this.compareList = [];
            this.saveComparisonList();
            this.updateUI();

            if (window.Toast) {
                window.Toast.success('Karşılaştırma listesi temizlendi!');
            }

            // Close modal if open
            const modal = document.getElementById('comparisonModal');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        },

        /**
         * Check if product is in comparison
         * @param {string} productId - Product ID
         * @returns {boolean}
         */
        isInComparison: function(productId) {
            if (!productId) return false;
            return this.compareList.includes(String(productId));
        },

        /**
         * Get comparison count
         * @returns {number}
         */
        getCount: function() {
            return this.compareList.length;
        },

        /**
         * Get all products in comparison
         * @returns {Array}
         */
        getAll: function() {
            return [...this.compareList];
        },

        /**
         * Update UI for all comparison buttons
         */
        updateUI: function() {
            // Update all compare toggle buttons
            document.querySelectorAll('[data-compare-toggle]').forEach(button => {
                const productId = button.getAttribute('data-compare-toggle');
                this.updateButtonState(productId, this.isInComparison(productId));
            });

            // Update counters
            this.updateCounters();

            // Update floating button
            this.updateFloatingButton();
        },

        /**
         * Update button state
         * @param {string} productId - Product ID
         * @param {boolean} inComparison - Is in comparison
         */
        updateButtonState: function(productId, inComparison) {
            const buttons = document.querySelectorAll(`[data-compare-toggle="${productId}"]`);

            buttons.forEach(button => {
                const icon = button.querySelector('i');
                const text = button.querySelector('.compare-text');

                if (inComparison) {
                    button.classList.add('is-comparing');
                    button.classList.remove('btn-outline-primary');
                    button.classList.add('btn-primary');

                    if (icon) {
                        icon.classList.add('fa-check');
                        icon.classList.remove('fa-balance-scale');
                    }

                    if (text) {
                        text.textContent = 'Karşılaştırmada';
                    }

                    button.setAttribute('aria-pressed', 'true');
                    button.setAttribute('title', 'Karşılaştırmadan çıkar');
                } else {
                    button.classList.remove('is-comparing');
                    button.classList.add('btn-outline-primary');
                    button.classList.remove('btn-primary');

                    if (icon) {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-balance-scale');
                    }

                    if (text) {
                        text.textContent = 'Karşılaştır';
                    }

                    button.setAttribute('aria-pressed', 'false');
                    button.setAttribute('title', 'Karşılaştırmaya ekle');
                }
            });
        },

        /**
         * Animate comparison button
         * @param {string} productId - Product ID
         */
        animateButton: function(productId) {
            const buttons = document.querySelectorAll(`[data-compare-toggle="${productId}"]`);

            buttons.forEach(button => {
                button.classList.add('compare-animation');
                setTimeout(() => {
                    button.classList.remove('compare-animation');
                }, 600);
            });
        },

        /**
         * Update counters
         */
        updateCounters: function() {
            const count = this.getCount();
            const counters = document.querySelectorAll('[data-comparison-count]');

            counters.forEach(counter => {
                counter.textContent = count;
            });
        },

        /**
         * Update floating button visibility
         */
        updateFloatingButton: function() {
            const button = document.getElementById('comparisonFloatingBtn');
            if (!button) return;

            const count = this.getCount();

            if (count > 0) {
                button.classList.remove('d-none');
                button.classList.add('comparison-btn-animate');
                setTimeout(() => {
                    button.classList.remove('comparison-btn-animate');
                }, 300);
            } else {
                button.classList.add('d-none');
            }
        },

        /**
         * Show comparison modal
         */
        showComparisonModal: function() {
            const count = this.getCount();

            // Check minimum products
            if (count < this.minProducts) {
                if (window.Toast) {
                    window.Toast.warning(`En az ${this.minProducts} ürün seçmelisiniz!`);
                }
                return;
            }

            // Create modal if doesn't exist
            if (!document.getElementById('comparisonModal')) {
                this.createComparisonModal();
            }

            // Load comparison data
            this.loadComparisonData();

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('comparisonModal'));
            modal.show();
        },

        /**
         * Create comparison modal
         */
        createComparisonModal: function() {
            const modalHTML = `
                <div class="modal fade" id="comparisonModal" tabindex="-1" aria-labelledby="comparisonModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="comparisonModalLabel">
                                    <i class="fas fa-balance-scale text-primary me-2"></i>Ürün Karşılaştırma
                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
                            </div>
                            <div class="modal-body">
                                <div id="comparisonContent">
                                    <!-- Comparison table will be loaded here -->
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-danger btn-sm" data-comparison-clear>
                                    <i class="fas fa-trash me-2"></i>Listeyi Temizle
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
         * Load comparison data into modal
         */
        loadComparisonData: function() {
            const container = document.getElementById('comparisonContent');
            if (!container) return;

            if (this.compareList.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-balance-scale fa-4x text-muted mb-3"></i>
                        <h5 class="text-muted">Karşılaştırma listesi boş</h5>
                        <p class="text-muted">Karşılaştırmak istediğiniz ürünleri seçin.</p>
                    </div>
                `;
                return;
            }

            // Mock product data (replace with API call)
            const mockProducts = {
                '1': {
                    name: 'NBR O-Ring Contalar',
                    category: 'Conta',
                    price: '₺150',
                    temperature: '-30°C ile +120°C',
                    material: 'NBR (Nitril Kauçuk)',
                    hardness: 'Shore A 70-90',
                    resistance: 'Yağ ve yakıt direnci',
                    application: 'Hidrolik, Pnömatik'
                },
                '2': {
                    name: 'Titreşim Emici Takozlar',
                    category: 'Takoz',
                    price: '₺250',
                    temperature: '-20°C ile +80°C',
                    material: 'EPDM Kauçuk',
                    hardness: 'Shore A 60',
                    resistance: 'Ozon ve UV direnci',
                    application: 'Makine, Kompresör'
                },
                '3': {
                    name: 'Silikon Levha',
                    category: 'Levha',
                    price: '₺450',
                    temperature: '-60°C ile +200°C',
                    material: 'Silikon Kauçuk',
                    hardness: 'Shore A 50-80',
                    resistance: 'Yüksek sıcaklık',
                    application: 'Gıda, Medikal'
                },
                '4': {
                    name: 'Viton Conta',
                    category: 'Conta',
                    price: '₺350',
                    temperature: '-20°C ile +200°C',
                    material: 'FKM (Viton)',
                    hardness: 'Shore A 75-95',
                    resistance: 'Kimyasal dayanım',
                    application: 'Kimya Endüstrisi'
                }
            };

            // Get products for comparison
            const productsToCompare = this.compareList.map(id => ({
                id: id,
                ...(mockProducts[id] || { name: `Ürün #${id}` })
            }));

            // Build comparison table
            const tableHTML = `
                <div class="table-responsive">
                    <table class="table table-bordered comparison-table">
                        <thead>
                            <tr>
                                <th class="comparison-feature">Özellik</th>
                                ${productsToCompare.map(product => `
                                    <th class="text-center position-relative">
                                        <button type="button"
                                                class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                                data-comparison-remove="${product.id}"
                                                title="Listeden Çıkar">
                                            <i class="fas fa-times"></i>
                                        </button>
                                        <div class="mt-4">
                                            <h6>${product.name}</h6>
                                            <span class="badge bg-secondary">${product.category || ''}</span>
                                        </div>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="fw-semibold">Fiyat</td>
                                ${productsToCompare.map(product => `
                                    <td class="text-center">
                                        <span class="text-primary fw-bold">${product.price || '-'}</span>
                                    </td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td class="fw-semibold">Sıcaklık Aralığı</td>
                                ${productsToCompare.map(product => `
                                    <td class="text-center">${product.temperature || '-'}</td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td class="fw-semibold">Malzeme</td>
                                ${productsToCompare.map(product => `
                                    <td class="text-center">${product.material || '-'}</td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td class="fw-semibold">Sertlik</td>
                                ${productsToCompare.map(product => `
                                    <td class="text-center">${product.hardness || '-'}</td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td class="fw-semibold">Dayanıklılık</td>
                                ${productsToCompare.map(product => `
                                    <td class="text-center">${product.resistance || '-'}</td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td class="fw-semibold">Kullanım Alanı</td>
                                ${productsToCompare.map(product => `
                                    <td class="text-center">${product.application || '-'}</td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td class="fw-semibold">İşlemler</td>
                                ${productsToCompare.map(product => `
                                    <td class="text-center">
                                        <a href="/Products/Details/${product.id}"
                                           class="btn btn-sm btn-primary"
                                           target="_blank">
                                            <i class="fas fa-eye me-1"></i>Detay
                                        </a>
                                    </td>
                                `).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="alert alert-info mt-3">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>İpucu:</strong> Tablonun üstündeki X butonları ile ürünleri listeden çıkarabilirsiniz.
                </div>
            `;

            container.innerHTML = tableHTML;
        },

        /**
         * Notify change to other components
         */
        notifyChange: function() {
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('comparisonChanged', {
                detail: {
                    compareList: this.compareList,
                    count: this.compareList.length
                }
            }));
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ProductComparison.init());
    } else {
        ProductComparison.init();
    }
})();