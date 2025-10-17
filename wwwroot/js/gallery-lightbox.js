/**
 * Gallery & Lightbox Module
 * Advanced image gallery with zoom, pan, and keyboard navigation
 */

const GalleryLightbox = (() => {
    let lightbox = null;
    let currentIndex = 0;
    let images = [];
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let scale = 1;

    // =====================================================
    // INITIALIZATION
    // =====================================================
    const init = () => {
        createLightbox();
        attachGalleryListeners();
        setupKeyboardNavigation();
    };

    // =====================================================
    // LIGHTBOX CREATION
    // =====================================================
    const createLightbox = () => {
        if (lightbox) return;

        lightbox = document.createElement('div');
        lightbox.id = 'galleryLightbox';
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Görsel galerisi');

        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Kapat">
                    <i class="fas fa-times"></i>
                </button>
                <button class="lightbox-prev" aria-label="Önceki">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-next" aria-label="Sonraki">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="lightbox-image-container">
                    <img class="lightbox-image" src="" alt="">
                    <div class="lightbox-loader">
                        <div class="spinner"></div>
                    </div>
                </div>
                <div class="lightbox-toolbar">
                    <button class="lightbox-zoom-in" aria-label="Yakınlaştır">
                        <i class="fas fa-search-plus"></i>
                    </button>
                    <button class="lightbox-zoom-out" aria-label="Uzaklaştır">
                        <i class="fas fa-search-minus"></i>
                    </button>
                    <button class="lightbox-reset" aria-label="Sıfırla">
                        <i class="fas fa-redo"></i>
                    </button>
                    <div class="lightbox-counter">
                        <span class="lightbox-current">1</span> / <span class="lightbox-total">1</span>
                    </div>
                </div>
                <div class="lightbox-caption"></div>
            </div>
        `;

        document.body.appendChild(lightbox);
        attachLightboxListeners();
    };

    // =====================================================
    // GALLERY LISTENERS
    // =====================================================
    const attachGalleryListeners = () => {
        // Listen for clicks on gallery items
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('[data-lightbox]');
            if (galleryItem) {
                e.preventDefault();
                const galleryGroup = galleryItem.getAttribute('data-lightbox');
                openLightbox(galleryItem, galleryGroup);
            }
        });
    };

    // =====================================================
    // LIGHTBOX LISTENERS
    // =====================================================
    const attachLightboxListeners = () => {
        const overlay = lightbox.querySelector('.lightbox-overlay');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const zoomIn = lightbox.querySelector('.lightbox-zoom-in');
        const zoomOut = lightbox.querySelector('.lightbox-zoom-out');
        const reset = lightbox.querySelector('.lightbox-reset');
        const image = lightbox.querySelector('.lightbox-image');

        // Close
        overlay.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('click', closeLightbox);

        // Navigation
        prevBtn.addEventListener('click', showPrevious);
        nextBtn.addEventListener('click', showNext);

        // Zoom
        zoomIn.addEventListener('click', () => zoomImage(0.2));
        zoomOut.addEventListener('click', () => zoomImage(-0.2));
        reset.addEventListener('click', resetImage);

        // Mouse wheel zoom
        image.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            zoomImage(delta);
        }, { passive: false });

        // Drag to pan
        image.addEventListener('mousedown', startDrag);
        image.addEventListener('mousemove', drag);
        image.addEventListener('mouseup', endDrag);
        image.addEventListener('mouseleave', endDrag);

        // Touch support
        image.addEventListener('touchstart', handleTouchStart);
        image.addEventListener('touchmove', handleTouchMove);
        image.addEventListener('touchend', handleTouchEnd);
    };

    // =====================================================
    // KEYBOARD NAVIGATION
    // =====================================================
    const setupKeyboardNavigation = () => {
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    showPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    showNext();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    zoomImage(0.2);
                    break;
                case '-':
                    e.preventDefault();
                    zoomImage(-0.2);
                    break;
                case '0':
                    e.preventDefault();
                    resetImage();
                    break;
            }
        });
    };

    // =====================================================
    // OPEN/CLOSE LIGHTBOX
    // =====================================================
    const openLightbox = (clickedElement, galleryGroup) => {
        // Get all images in the same gallery group
        const selector = galleryGroup
            ? `[data-lightbox="${galleryGroup}"]`
            : '[data-lightbox]';

        const galleryElements = document.querySelectorAll(selector);
        images = Array.from(galleryElements).map(el => ({
            src: el.getAttribute('href') || el.getAttribute('data-lightbox-src') || el.src,
            caption: el.getAttribute('data-caption') || el.alt || ''
        }));

        // Find current index
        currentIndex = Array.from(galleryElements).indexOf(clickedElement);

        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Load image
        loadImage(currentIndex);

        // Update counter
        updateCounter();

        // Trap focus
        trapFocus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        resetImage();

        // Return focus
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.blur();
    };

    // =====================================================
    // IMAGE LOADING
    // =====================================================
    const loadImage = (index) => {
        if (index < 0 || index >= images.length) return;

        const imageEl = lightbox.querySelector('.lightbox-image');
        const loader = lightbox.querySelector('.lightbox-loader');
        const caption = lightbox.querySelector('.lightbox-caption');

        // Show loader
        loader.classList.add('visible');
        imageEl.style.opacity = '0';

        // Load image
        const img = new Image();
        img.onload = () => {
            imageEl.src = images[index].src;
            imageEl.alt = images[index].caption;
            caption.textContent = images[index].caption;

            // Hide loader
            setTimeout(() => {
                loader.classList.remove('visible');
                imageEl.style.opacity = '1';
            }, 200);
        };

        img.onerror = () => {
            loader.classList.remove('visible');
            if (window.Toast) {
                window.Toast.error('Görsel yüklenemedi');
            }
        };

        img.src = images[index].src;
        currentIndex = index;
        resetImage();
    };

    // =====================================================
    // NAVIGATION
    // =====================================================
    const showPrevious = () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        loadImage(newIndex);
        updateCounter();
    };

    const showNext = () => {
        const newIndex = (currentIndex + 1) % images.length;
        loadImage(newIndex);
        updateCounter();
    };

    const updateCounter = () => {
        lightbox.querySelector('.lightbox-current').textContent = currentIndex + 1;
        lightbox.querySelector('.lightbox-total').textContent = images.length;

        // Hide navigation if only one image
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    };

    // =====================================================
    // ZOOM & PAN
    // =====================================================
    const zoomImage = (delta) => {
        scale = Math.max(0.5, Math.min(3, scale + delta));
        applyTransform();
    };

    const resetImage = () => {
        scale = 1;
        currentX = 0;
        currentY = 0;
        applyTransform();
    };

    const applyTransform = () => {
        const image = lightbox.querySelector('.lightbox-image');
        image.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    };

    // =====================================================
    // DRAG HANDLERS
    // =====================================================
    const startDrag = (e) => {
        if (scale <= 1) return;
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        lightbox.querySelector('.lightbox-image').style.cursor = 'grabbing';
    };

    const drag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        applyTransform();
    };

    const endDrag = () => {
        isDragging = false;
        lightbox.querySelector('.lightbox-image').style.cursor = scale > 1 ? 'grab' : 'default';
    };

    // =====================================================
    // TOUCH HANDLERS
    // =====================================================
    let touchStartDistance = 0;
    let touchStartScale = 1;

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            // Pinch zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            touchStartDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            touchStartScale = scale;
        } else if (scale > 1) {
            // Pan
            startX = e.touches[0].clientX - currentX;
            startY = e.touches[0].clientY - currentY;
            isDragging = true;
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const touchDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            scale = touchStartScale * (touchDistance / touchStartDistance);
            scale = Math.max(0.5, Math.min(3, scale));
            applyTransform();
        } else if (isDragging && scale > 1) {
            e.preventDefault();
            currentX = e.touches[0].clientX - startX;
            currentY = e.touches[0].clientY - startY;
            applyTransform();
        }
    };

    const handleTouchEnd = () => {
        isDragging = false;
        touchStartDistance = 0;
    };

    // =====================================================
    // ACCESSIBILITY
    // =====================================================
    const trapFocus = () => {
        const focusableElements = lightbox.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });

        // Focus first element
        setTimeout(() => firstElement.focus(), 100);
    };

    // Public API
    return {
        init,
        open: openLightbox,
        close: closeLightbox
    };
})();

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', GalleryLightbox.init);
} else {
    GalleryLightbox.init();
}

// Expose to window
window.Lightbox = GalleryLightbox;
