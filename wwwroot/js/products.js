/**
 * Products Page Module
 * Handles product filtering, search, and interactive features
 */

const ProductsModule = (() => {
    // Private variables
    let filterButtons = null;
    let productItems = null;
    let searchInput = null;
    let resultsCounter = null;
    let emptyState = null;
    let activeFilters = new Set(['all']);
    let searchTerm = '';
    let totalProducts = 0;

    // Debounce helper
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Initialize module
    const init = () => {
        cacheElements();
        if (!productItems || productItems.length === 0) {
            console.warn('No products found on page');
            return;
        }

        totalProducts = productItems.length;
        setupEventListeners();
        showInitialProducts();
        updateResultsCounter();
    };

    // Cache DOM elements
    const cacheElements = () => {
        filterButtons = document.querySelectorAll('[data-filter]');
        productItems = document.querySelectorAll('[data-category]');
        searchInput = document.getElementById('productSearch');
        resultsCounter = document.getElementById('resultsCounter');
        emptyState = document.getElementById('emptyState');
    };

    // Setup all event listeners
    const setupEventListeners = () => {
        // Filter buttons with event delegation
        const filterContainer = document.getElementById('productFilters');
        if (filterContainer) {
            filterContainer.addEventListener('click', handleFilterClick);

            // Keyboard navigation for filters
            filterContainer.addEventListener('keydown', handleFilterKeyboard);
        }

        // Search input with debounce
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));

            // Clear search on Escape
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    handleSearch();
                }
            });
        }

        // Product cards keyboard navigation
        productItems.forEach(item => {
            const link = item.querySelector('a.btn');
            if (link) {
                link.addEventListener('keydown', handleProductKeyboard);
            }
        });
    };

    // Handle filter button clicks
    const handleFilterClick = (e) => {
        const button = e.target.closest('[data-filter]');
        if (!button) return;

        const filter = button.getAttribute('data-filter');
        setActiveFilter(filter);
        filterProducts();

        // Update ARIA
        updateFilterAria(button);
    };

    // Handle keyboard navigation for filters
    const handleFilterKeyboard = (e) => {
        const button = e.target.closest('[data-filter]');
        if (!button) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }

        // Arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const allButtons = Array.from(filterButtons);
            const currentIndex = allButtons.indexOf(button);
            const nextIndex = e.key === 'ArrowRight'
                ? (currentIndex + 1) % allButtons.length
                : (currentIndex - 1 + allButtons.length) % allButtons.length;
            allButtons[nextIndex].focus();
        }
    };

    // Handle product card keyboard navigation
    const handleProductKeyboard = (e) => {
        // Additional keyboard shortcuts can be added here
        if (e.key === 'Enter') {
            e.target.click();
        }
    };

    // Set active filter
    const setActiveFilter = (filter) => {
        activeFilters.clear();
        activeFilters.add(filter);

        // Update button states
        filterButtons.forEach(btn => {
            const btnFilter = btn.getAttribute('data-filter');
            if (btnFilter === filter) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    };

    // Handle search input
    const handleSearch = () => {
        searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        filterProducts();
    };

    // Main filter logic
    const filterProducts = () => {
        let visibleCount = 0;
        const hasActiveCategory = !activeFilters.has('all');

        productItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const name = item.querySelector('h5')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';

            // Check category match
            const categoryMatch = activeFilters.has('all') || activeFilters.has(category);

            // Check search match
            const searchMatch = !searchTerm ||
                name.includes(searchTerm) ||
                description.includes(searchTerm) ||
                category.toLowerCase().includes(searchTerm);

            const shouldShow = categoryMatch && searchMatch;

            if (shouldShow) {
                showProduct(item);
                visibleCount++;
            } else {
                hideProduct(item);
            }
        });

        updateResultsCounter(visibleCount);
        toggleEmptyState(visibleCount === 0);
        announceFilterResults(visibleCount);
    };

    // Show product with animation
    const showProduct = (item) => {
        item.classList.remove('d-none');
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                item.classList.add('visible');
            });
        });
        item.setAttribute('aria-hidden', 'false');
    };

    // Hide product with animation
    const hideProduct = (item) => {
        item.classList.remove('visible');
        item.setAttribute('aria-hidden', 'true');
        // Wait for CSS transition before hiding
        setTimeout(() => {
            if (!item.classList.contains('visible')) {
                item.classList.add('d-none');
            }
        }, 250);
    };

    // Show initial products with staggered animation
    const showInitialProducts = () => {
        productItems.forEach((item, index) => {
            setTimeout(() => {
                requestAnimationFrame(() => item.classList.add('visible'));
            }, index * 50); // Stagger by 50ms
        });
    };

    // Update results counter
    const updateResultsCounter = (visibleCount = null) => {
        if (!resultsCounter) return;

        const count = visibleCount !== null ? visibleCount : totalProducts;
        const text = searchTerm
            ? `"${searchTerm}" için ${count} ürün bulundu`
            : `${totalProducts} üründen ${count} tanesi gösteriliyor`;

        resultsCounter.textContent = text;
        resultsCounter.setAttribute('aria-live', 'polite');
    };

    // Toggle empty state
    const toggleEmptyState = (show) => {
        if (!emptyState) return;

        if (show) {
            emptyState.classList.remove('d-none');
            emptyState.setAttribute('role', 'status');
            emptyState.setAttribute('aria-live', 'polite');
        } else {
            emptyState.classList.add('d-none');
        }
    };

    // Update filter ARIA attributes
    const updateFilterAria = (activeButton) => {
        const filterName = activeButton.textContent.trim();
        const announcement = `${filterName} filtresi seçildi`;

        // Create live region announcement
        announceToScreenReader(announcement);
    };

    // Announce filter results to screen readers
    const announceFilterResults = (count) => {
        const message = count === 0
            ? 'Hiç ürün bulunamadı. Lütfen farklı bir filtre veya arama terimi deneyin.'
            : `${count} ürün gösteriliyor`;

        announceToScreenReader(message);
    };

    // Screen reader announcement helper
    const announceToScreenReader = (message) => {
        const announcement = document.getElementById('srAnnouncements');
        if (announcement) {
            announcement.textContent = message;
        }
    };

    // Public API
    return {
        init
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ProductsModule.init);
} else {
    ProductsModule.init();
}
