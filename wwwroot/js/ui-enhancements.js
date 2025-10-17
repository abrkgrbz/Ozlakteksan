/**
 * UI Enhancements Module
 * Comprehensive UI improvements for Ozlasteksan website
 * - Loading states & skeletons
 * - Toast notifications
 * - Scroll-to-top button
 * - Enhanced scroll animations
 */

const UIEnhancements = (() => {
    // =====================================================
    // TOAST NOTIFICATION SYSTEM
    // =====================================================
    const ToastManager = {
        container: null,
        queue: [],
        isProcessing: false,

        init() {
            this.createContainer();
        },

        createContainer() {
            if (this.container) return;

            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.container);
        },

        show(message, type = 'info', duration = 4000) {
            const toast = {
                id: Date.now() + Math.random(),
                message,
                type, // success, error, warning, info
                duration
            };

            this.queue.push(toast);
            if (!this.isProcessing) {
                this.processQueue();
            }

            return toast.id;
        },

        processQueue() {
            if (this.queue.length === 0) {
                this.isProcessing = false;
                return;
            }

            this.isProcessing = true;
            const toast = this.queue.shift();
            this.renderToast(toast);
        },

        renderToast(toast) {
            const icons = {
                success: '<i class="fas fa-check-circle"></i>',
                error: '<i class="fas fa-exclamation-circle"></i>',
                warning: '<i class="fas fa-exclamation-triangle"></i>',
                info: '<i class="fas fa-info-circle"></i>'
            };

            const toastEl = document.createElement('div');
            toastEl.className = `toast toast-${toast.type}`;
            toastEl.setAttribute('role', 'alert');
            toastEl.setAttribute('aria-live', 'assertive');
            toastEl.innerHTML = `
                <div class="toast-icon">${icons[toast.type] || icons.info}</div>
                <div class="toast-content">
                    <div class="toast-message">${this.escapeHtml(toast.message)}</div>
                </div>
                <button class="toast-close" aria-label="Kapat">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // Close button handler
            const closeBtn = toastEl.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.hideToast(toastEl));

            // Add to container
            this.container.appendChild(toastEl);

            // Trigger animation
            requestAnimationFrame(() => {
                toastEl.classList.add('toast-show');
            });

            // Auto-hide
            setTimeout(() => {
                this.hideToast(toastEl);
            }, toast.duration);
        },

        hideToast(toastEl) {
            toastEl.classList.remove('toast-show');
            toastEl.classList.add('toast-hide');

            setTimeout(() => {
                if (toastEl.parentNode) {
                    toastEl.remove();
                }
                this.processQueue(); // Process next toast
            }, 300);
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // Convenience methods
        success(message, duration) {
            return this.show(message, 'success', duration);
        },
        error(message, duration) {
            return this.show(message, 'error', duration);
        },
        warning(message, duration) {
            return this.show(message, 'warning', duration);
        },
        info(message, duration) {
            return this.show(message, 'info', duration);
        }
    };

    // =====================================================
    // SCROLL TO TOP BUTTON
    // =====================================================
    const ScrollToTop = {
        button: null,
        isVisible: false,
        scrollThreshold: 400,

        init() {
            this.createButton();
            this.setupListeners();
        },

        createButton() {
            this.button = document.createElement('button');
            this.button.id = 'scrollToTop';
            this.button.className = 'scroll-to-top';
            this.button.setAttribute('aria-label', 'Sayfanın başına dön');
            this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(this.button);
        },

        setupListeners() {
            // Scroll listener with throttle
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            // Click handler
            this.button.addEventListener('click', () => this.scrollToTop());

            // Keyboard handler
            this.button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.scrollToTop();
                }
            });
        },

        handleScroll() {
            const shouldShow = window.scrollY > this.scrollThreshold;

            if (shouldShow && !this.isVisible) {
                this.show();
            } else if (!shouldShow && this.isVisible) {
                this.hide();
            }
        },

        show() {
            this.button.classList.add('visible');
            this.button.setAttribute('tabindex', '0');
            this.isVisible = true;
        },

        hide() {
            this.button.classList.remove('visible');
            this.button.setAttribute('tabindex', '-1');
            this.isVisible = false;
        },

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = 'Sayfanın başına dönüldü';
            document.body.appendChild(announcement);

            setTimeout(() => announcement.remove(), 1000);
        }
    };

    // =====================================================
    // ENHANCED SCROLL ANIMATIONS
    // =====================================================
    const EnhancedAnimations = {
        observer: null,
        animatedElements: [],

        init() {
            this.setupObserver();
            this.observeElements();
        },

        setupObserver() {
            const options = {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: '0px 0px -10% 0px'
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target, entry.intersectionRatio);
                    }
                });
            }, options);
        },

        observeElements() {
            // Observe fade-up elements
            const fadeUpElements = document.querySelectorAll('.fade-up:not(.visible)');
            fadeUpElements.forEach(el => {
                this.observer.observe(el);
            });

            // Observe new animation classes
            const slideInElements = document.querySelectorAll('[data-animate]');
            slideInElements.forEach(el => {
                this.observer.observe(el);
            });
        },

        animateElement(element, ratio) {
            if (ratio >= 0.25) {
                const animationType = element.getAttribute('data-animate') || 'fade-up';
                const delay = element.getAttribute('data-animate-delay') || 0;

                setTimeout(() => {
                    element.classList.add('visible');

                    // Add specific animation class
                    if (animationType !== 'fade-up') {
                        element.classList.add(`animate-${animationType}`);
                    }

                    // Unobserve after animation
                    this.observer.unobserve(element);
                }, delay);
            }
        },

        // Manually trigger animation for specific element
        triggerAnimation(element) {
            if (element) {
                element.classList.add('visible');
            }
        }
    };

    // =====================================================
    // LOADING STATES & SKELETONS
    // =====================================================
    const LoadingManager = {
        init() {
            // Placeholder for future AJAX loading implementations
            console.log('LoadingManager initialized');
        },

        showSkeleton(container) {
            if (!container) return;

            const skeletonHTML = this.generateSkeletonHTML(container);
            container.innerHTML = skeletonHTML;
            container.classList.add('loading-skeleton');
        },

        hideSkeleton(container, content) {
            if (!container) return;

            container.classList.remove('loading-skeleton');
            if (content) {
                container.innerHTML = content;
            }
        },

        generateSkeletonHTML(container) {
            // Generate skeleton based on container type
            const type = container.getAttribute('data-skeleton-type') || 'card';

            switch (type) {
                case 'card':
                    return `
                        <div class="skeleton-card">
                            <div class="skeleton skeleton-image"></div>
                            <div class="skeleton skeleton-text"></div>
                            <div class="skeleton skeleton-text" style="width: 80%;"></div>
                            <div class="skeleton skeleton-button"></div>
                        </div>
                    `;
                case 'list':
                    return `
                        <div class="skeleton-list">
                            ${Array(3).fill('<div class="skeleton skeleton-text"></div>').join('')}
                        </div>
                    `;
                case 'form':
                    return `
                        <div class="skeleton-form">
                            <div class="skeleton skeleton-input"></div>
                            <div class="skeleton skeleton-input"></div>
                            <div class="skeleton skeleton-button"></div>
                        </div>
                    `;
                default:
                    return '<div class="skeleton skeleton-text"></div>';
            }
        },

        // Show loading overlay
        showOverlay(message = 'Yükleniyor...') {
            const overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.classList.add('visible');
            });

            return overlay;
        },

        hideOverlay() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.remove('visible');
                setTimeout(() => overlay.remove(), 300);
            }
        }
    };

    // =====================================================
    // FORM ENHANCEMENTS
    // =====================================================
    const FormEnhancements = {
        init() {
            this.enhanceFormValidation();
            this.setupFormListeners();
        },

        enhanceFormValidation() {
            const forms = document.querySelectorAll('form[data-enhance]');

            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                        ToastManager.error('Lütfen tüm gerekli alanları doldurun');
                    }
                    form.classList.add('was-validated');
                });
            });
        },

        setupFormListeners() {
            // Real-time validation
            const inputs = document.querySelectorAll('input[data-validate], textarea[data-validate]');

            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });

                input.addEventListener('input', () => {
                    if (input.classList.contains('is-invalid')) {
                        this.validateInput(input);
                    }
                });
            });
        },

        validateInput(input) {
            if (input.checkValidity()) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
            }
        }
    };

    // =====================================================
    // MAIN INITIALIZATION
    // =====================================================
    const init = () => {
        // Initialize all modules
        ToastManager.init();
        ScrollToTop.init();
        EnhancedAnimations.init();
        LoadingManager.init();
        FormEnhancements.init();

        // Expose public API to window
        window.Toast = {
            show: (msg, type, duration) => ToastManager.show(msg, type, duration),
            success: (msg, duration) => ToastManager.success(msg, duration),
            error: (msg, duration) => ToastManager.error(msg, duration),
            warning: (msg, duration) => ToastManager.warning(msg, duration),
            info: (msg, duration) => ToastManager.info(msg, duration)
        };

        window.Loading = {
            show: (msg) => LoadingManager.showOverlay(msg),
            hide: () => LoadingManager.hideOverlay(),
            skeleton: {
                show: (el) => LoadingManager.showSkeleton(el),
                hide: (el, content) => LoadingManager.hideSkeleton(el, content)
            }
        };

        console.log('✨ UI Enhancements initialized successfully');
    };

    // Public API
    return {
        init,
        Toast: ToastManager,
        ScrollToTop,
        Animations: EnhancedAnimations,
        Loading: LoadingManager
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UIEnhancements.init);
} else {
    UIEnhancements.init();
}
