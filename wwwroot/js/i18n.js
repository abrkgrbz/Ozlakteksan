/**
 * Internationalization (i18n) System
 * Multi-language support for Turkish and English
 */

(function() {
    'use strict';

    // Language translations
    const translations = {
        tr: {
            // Navigation
            'nav.home': 'Anasayfa',
            'nav.about': 'Hakkımızda',
            'nav.products': 'Ürünler',
            'nav.contact': 'İletişim',
            'nav.quote': 'Teklif Al',
            'nav.favorites': 'Favorilerim',

            // Common
            'common.readMore': 'Devamını Oku',
            'common.viewDetails': 'Detayları Gör',
            'common.close': 'Kapat',
            'common.save': 'Kaydet',
            'common.cancel': 'İptal',
            'common.search': 'Ara',
            'common.filter': 'Filtrele',
            'common.all': 'Tümü',
            'common.loading': 'Yükleniyor...',
            'common.error': 'Hata',
            'common.success': 'Başarılı',
            'common.warning': 'Uyarı',
            'common.info': 'Bilgi',

            // Hero Section
            'hero.title': 'Endüstriyel Kauçuk Çözümleri',
            'hero.subtitle': '30 Yıllık Tecrübe ile Güvenilir Çözüm Ortağınız',
            'hero.cta': 'Hemen Teklif Alın',

            // Products
            'products.title': 'Ürün Portföyümüz',
            'products.searchPlaceholder': 'Ürün adı veya açıklama ile ara...',
            'products.categoryFilter': 'Kategori Filtresi',
            'products.noResults': 'Ürün Bulunamadı',
            'products.quickView': 'Hızlı Bak',
            'products.compare': 'Karşılaştır',
            'products.addToFavorites': 'Favorilere Ekle',
            'products.removeFromFavorites': 'Favorilerden Çıkar',

            // About
            'about.mission': 'Misyonumuz',
            'about.vision': 'Vizyonumuz',
            'about.values': 'Değerlerimiz',
            'about.history': 'Tarihçemiz',
            'about.team': 'Yönetim Kadromuz',
            'about.certificates': 'Sertifikalarımız',

            // Contact
            'contact.title': 'İletişime Geçin',
            'contact.address': 'Adres',
            'contact.phone': 'Telefon',
            'contact.email': 'E-posta',
            'contact.workingHours': 'Çalışma Saatleri',
            'contact.form.name': 'Adınız Soyadınız',
            'contact.form.email': 'E-posta Adresiniz',
            'contact.form.subject': 'Konu',
            'contact.form.message': 'Mesajınız',
            'contact.form.send': 'Gönder',

            // Footer
            'footer.quickLinks': 'Hızlı Linkler',
            'footer.products': 'Ürün Grupları',
            'footer.contact': 'İletişim',
            'footer.followUs': 'Bizi Takip Edin',
            'footer.rights': 'Tüm hakları saklıdır.',

            // PWA
            'pwa.install': 'Uygulamayı Yükle',
            'pwa.updateAvailable': 'Yeni sürüm mevcut!',
            'pwa.offline': 'Çevrimdışı',
            'pwa.online': 'Çevrimiçi'
        },
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.about': 'About Us',
            'nav.products': 'Products',
            'nav.contact': 'Contact',
            'nav.quote': 'Get Quote',
            'nav.favorites': 'My Favorites',

            // Common
            'common.readMore': 'Read More',
            'common.viewDetails': 'View Details',
            'common.close': 'Close',
            'common.save': 'Save',
            'common.cancel': 'Cancel',
            'common.search': 'Search',
            'common.filter': 'Filter',
            'common.all': 'All',
            'common.loading': 'Loading...',
            'common.error': 'Error',
            'common.success': 'Success',
            'common.warning': 'Warning',
            'common.info': 'Info',

            // Hero Section
            'hero.title': 'Industrial Rubber Solutions',
            'hero.subtitle': '30 Years of Experience as Your Reliable Solution Partner',
            'hero.cta': 'Get Quote Now',

            // Products
            'products.title': 'Our Product Portfolio',
            'products.searchPlaceholder': 'Search by product name or description...',
            'products.categoryFilter': 'Category Filter',
            'products.noResults': 'No Products Found',
            'products.quickView': 'Quick View',
            'products.compare': 'Compare',
            'products.addToFavorites': 'Add to Favorites',
            'products.removeFromFavorites': 'Remove from Favorites',

            // About
            'about.mission': 'Our Mission',
            'about.vision': 'Our Vision',
            'about.values': 'Our Values',
            'about.history': 'Our History',
            'about.team': 'Management Team',
            'about.certificates': 'Our Certificates',

            // Contact
            'contact.title': 'Contact Us',
            'contact.address': 'Address',
            'contact.phone': 'Phone',
            'contact.email': 'Email',
            'contact.workingHours': 'Working Hours',
            'contact.form.name': 'Your Name',
            'contact.form.email': 'Your Email',
            'contact.form.subject': 'Subject',
            'contact.form.message': 'Your Message',
            'contact.form.send': 'Send',

            // Footer
            'footer.quickLinks': 'Quick Links',
            'footer.products': 'Product Groups',
            'footer.contact': 'Contact',
            'footer.followUs': 'Follow Us',
            'footer.rights': 'All rights reserved.',

            // PWA
            'pwa.install': 'Install App',
            'pwa.updateAvailable': 'New version available!',
            'pwa.offline': 'Offline',
            'pwa.online': 'Online'
        }
    };

    // i18n Manager
    window.i18n = {
        currentLang: 'tr',
        translations: translations,

        /**
         * Initialize i18n system
         */
        init: function() {
            // Get saved language from localStorage or browser language
            this.currentLang = localStorage.getItem('language') || this.detectBrowserLanguage();

            // Create language switcher
            this.createLanguageSwitcher();

            // Apply translations
            this.applyTranslations();

            // Update HTML lang attribute
            document.documentElement.lang = this.currentLang;

            console.log('i18n initialized with language:', this.currentLang);
        },

        /**
         * Detect browser language
         */
        detectBrowserLanguage: function() {
            const browserLang = navigator.language || navigator.userLanguage;
            return browserLang.startsWith('tr') ? 'tr' : 'en';
        },

        /**
         * Get translation for a key
         */
        t: function(key, lang) {
            lang = lang || this.currentLang;
            return this.translations[lang] && this.translations[lang][key]
                ? this.translations[lang][key]
                : key;
        },

        /**
         * Change language
         */
        changeLanguage: function(lang) {
            if (!this.translations[lang]) {
                console.error('Language not supported:', lang);
                return;
            }

            this.currentLang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;

            // Apply translations
            this.applyTranslations();

            // Update language switcher
            this.updateLanguageSwitcher();

            // Dispatch language change event
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));

            console.log('Language changed to:', lang);
        },

        /**
         * Apply translations to DOM elements
         */
        applyTranslations: function() {
            // Translate elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.t(key);

                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            });

            // Translate elements with data-i18n-title attribute (for tooltips)
            document.querySelectorAll('[data-i18n-title]').forEach(element => {
                const key = element.getAttribute('data-i18n-title');
                element.title = this.t(key);
            });

            // Translate elements with data-i18n-aria attribute (for accessibility)
            document.querySelectorAll('[data-i18n-aria]').forEach(element => {
                const key = element.getAttribute('data-i18n-aria');
                element.setAttribute('aria-label', this.t(key));
            });
        },

        /**
         * Create language switcher UI
         */
        createLanguageSwitcher: function() {
            // Check if switcher already exists
            if (document.getElementById('language-switcher')) {
                return;
            }

            const switcher = document.createElement('div');
            switcher.id = 'language-switcher';
            switcher.className = 'language-switcher';
            switcher.innerHTML = `
                <button class="btn btn-sm btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-globe me-1"></i>
                    <span class="lang-text">${this.currentLang.toUpperCase()}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <a class="dropdown-item ${this.currentLang === 'tr' ? 'active' : ''}" href="#" data-lang="tr">
                            <img src="/images/flags/tr.svg" alt="TR" class="flag-icon me-2">
                            Türkçe
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item ${this.currentLang === 'en' ? 'active' : ''}" href="#" data-lang="en">
                            <img src="/images/flags/en.svg" alt="EN" class="flag-icon me-2">
                            English
                        </a>
                    </li>
                </ul>
            `;

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .language-switcher {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 1000;
                }

                .language-switcher .dropdown-toggle {
                    background: rgba(31, 42, 68, 0.95);
                    border-color: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                }

                .language-switcher .dropdown-toggle:hover {
                    background: rgba(31, 42, 68, 1);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .language-switcher .dropdown-menu {
                    min-width: 150px;
                    border: none;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                }

                .language-switcher .dropdown-item {
                    padding: 10px 15px;
                    transition: all 0.3s ease;
                }

                .language-switcher .dropdown-item:hover {
                    background: #f8f9fa;
                }

                .language-switcher .dropdown-item.active {
                    background: var(--accent-color);
                    color: white;
                }

                .flag-icon {
                    width: 20px;
                    height: 15px;
                    object-fit: cover;
                    border-radius: 2px;
                }

                @media (max-width: 767.98px) {
                    .language-switcher {
                        top: 70px;
                        right: 15px;
                    }
                }
            `;
            document.head.appendChild(style);

            // Add to DOM
            document.body.appendChild(switcher);

            // Attach event listeners
            switcher.querySelectorAll('[data-lang]').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = e.currentTarget.getAttribute('data-lang');
                    this.changeLanguage(lang);
                });
            });
        },

        /**
         * Update language switcher UI
         */
        updateLanguageSwitcher: function() {
            const switcher = document.getElementById('language-switcher');
            if (!switcher) return;

            // Update button text
            const langText = switcher.querySelector('.lang-text');
            if (langText) {
                langText.textContent = this.currentLang.toUpperCase();
            }

            // Update active state
            switcher.querySelectorAll('.dropdown-item').forEach(item => {
                const lang = item.getAttribute('data-lang');
                if (lang === this.currentLang) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        },

        /**
         * Translate dynamic content
         */
        translateContent: function(content, lang) {
            lang = lang || this.currentLang;

            // Simple translation for known patterns
            const translationMap = {
                'tr': {
                    'Products': 'Ürünler',
                    'About': 'Hakkımızda',
                    'Contact': 'İletişim',
                    'Home': 'Anasayfa'
                },
                'en': {
                    'Ürünler': 'Products',
                    'Hakkımızda': 'About',
                    'İletişim': 'Contact',
                    'Anasayfa': 'Home'
                }
            };

            if (translationMap[lang] && translationMap[lang][content]) {
                return translationMap[lang][content];
            }

            return content;
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => i18n.init());
    } else {
        i18n.init();
    }
})();