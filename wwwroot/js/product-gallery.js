// Product Image Gallery
class ProductGallery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.images = JSON.parse(this.container.dataset.images || '[]');
        this.currentIndex = 0;

        this.init();
    }

    init() {
        if (this.images.length === 0) {
            this.showPlaceholder();
            return;
        }

        this.render();
        this.attachEvents();
    }

    showPlaceholder() {
        this.container.innerHTML = `
            <div class="gallery-placeholder">
                <i class="fas fa-image"></i>
                <p>Bu ürün için henüz görsel bulunmamaktadır</p>
            </div>
        `;
    }

    render() {
        const mainImage = this.images[this.currentIndex];

        let html = `
            <div class="product-gallery">
                <div class="gallery-main" data-gallery="main">
                    <img src="${mainImage}" alt="Ürün görseli ${this.currentIndex + 1}">
                    <button class="gallery-zoom-btn" data-gallery="zoom">
                        <i class="fas fa-search-plus"></i>
                    </button>
                </div>
        `;

        if (this.images.length > 1) {
            html += `<div class="gallery-thumbnails">`;
            this.images.forEach((image, index) => {
                const activeClass = index === this.currentIndex ? 'active' : '';
                html += `
                    <div class="gallery-thumbnail ${activeClass}" data-gallery="thumbnail" data-index="${index}">
                        <img src="${image}" alt="Ürün görseli ${index + 1}">
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `</div>`;

        // Lightbox
        html += `
            <div class="gallery-lightbox" data-gallery="lightbox">
                <div class="lightbox-content">
                    <button class="lightbox-close" data-gallery="close">
                        <i class="fas fa-times"></i>
                    </button>
                    ${this.images.length > 1 ? `
                        <button class="lightbox-nav prev" data-gallery="prev">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="lightbox-nav next" data-gallery="next">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    ` : ''}
                    <img src="${mainImage}" alt="Ürün görseli" data-gallery="lightbox-img">
                    ${this.images.length > 1 ? `
                        <div class="lightbox-counter" data-gallery="counter">
                            <span data-gallery="current">1</span> / <span data-gallery="total">${this.images.length}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    attachEvents() {
        // Thumbnail clicks
        const thumbnails = this.container.querySelectorAll('[data-gallery="thumbnail"]');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.changeImage(index);
            });
        });

        // Zoom button
        const zoomBtn = this.container.querySelector('[data-gallery="zoom"]');
        if (zoomBtn) {
            zoomBtn.addEventListener('click', () => this.openLightbox());
        }

        // Main image click
        const mainImage = this.container.querySelector('[data-gallery="main"]');
        if (mainImage) {
            mainImage.addEventListener('click', () => this.openLightbox());
        }

        // Lightbox controls
        const lightbox = this.container.querySelector('[data-gallery="lightbox"]');
        const closeBtn = this.container.querySelector('[data-gallery="close"]');
        const prevBtn = this.container.querySelector('[data-gallery="prev"]');
        const nextBtn = this.container.querySelector('[data-gallery="next"]');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevImage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lightbox = this.container.querySelector('[data-gallery="lightbox"]');
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                this.closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                this.prevImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });
    }

    changeImage(index) {
        this.currentIndex = index;

        // Update main image
        const mainImg = this.container.querySelector('[data-gallery="main"] img');
        if (mainImg) {
            mainImg.src = this.images[index];
        }

        // Update lightbox image
        const lightboxImg = this.container.querySelector('[data-gallery="lightbox-img"]');
        if (lightboxImg) {
            lightboxImg.src = this.images[index];
        }

        // Update thumbnails
        const thumbnails = this.container.querySelectorAll('[data-gallery="thumbnail"]');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Update counter
        const currentCounter = this.container.querySelector('[data-gallery="current"]');
        if (currentCounter) {
            currentCounter.textContent = index + 1;
        }
    }

    openLightbox() {
        const lightbox = this.container.querySelector('[data-gallery="lightbox"]');
        if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        const lightbox = this.container.querySelector('[data-gallery="lightbox"]');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    prevImage() {
        const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
        this.changeImage(newIndex);
    }

    nextImage() {
        const newIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
        this.changeImage(newIndex);
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('productGallery');
    if (galleryContainer) {
        new ProductGallery('productGallery');
    }
});
