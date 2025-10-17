const initScrollAnimations = () => {
    const animatedItems = document.querySelectorAll('.fade-up');

    if (animatedItems.length === 0) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.25,
            rootMargin: '0px 0px -10% 0px'
        }
    );

    animatedItems.forEach((item) => observer.observe(item));
};

const initStickyHeader = () => {
    const navbar = document.querySelector('.site-navbar');
    if (!navbar) {
        return;
    }

    const toggleClass = () => {
        if (window.scrollY > 24) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', toggleClass, { passive: true });
    toggleClass();
};

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initStickyHeader();
});
