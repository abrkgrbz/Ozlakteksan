/**
 * Cookie Consent Manager
 * GDPR/KVKK compliant cookie consent system
 */
(function() {
    'use strict';

    const CookieConsent = {
        cookieName: 'ozlasteksan_cookie_consent',
        cookieExpiry: 365, // days

        // Cookie categories
        categories: {
            necessary: {
                name: 'Gerekli Çerezler',
                description: 'Web sitesinin temel işlevlerinin çalışması için gereklidir. Bu çerezler olmadan web sitesi düzgün çalışmaz.',
                required: true
            },
            analytics: {
                name: 'Analiz Çerezleri',
                description: 'Web sitesi trafiğini ve ziyaretçi davranışlarını analiz etmemize yardımcı olur. Bu bilgiler hizmet kalitemizi artırmak için kullanılır.',
                required: false
            },
            marketing: {
                name: 'Pazarlama Çerezleri',
                description: 'İlgi alanlarınıza göre kişiselleştirilmiş reklamlar göstermek için kullanılır.',
                required: false
            },
            preferences: {
                name: 'Tercih Çerezleri',
                description: 'Dil seçimi ve bölge ayarları gibi tercihlerinizi hatırlamak için kullanılır.',
                required: false
            }
        },

        // Initialize
        init: function() {
            console.log('Cookie Consent: Initializing...');
            const consent = this.getConsent();
            console.log('Cookie Consent: Existing consent:', consent);

            if (!consent) {
                // First visit - show banner
                console.log('Cookie Consent: No consent found, showing banner...');
                this.showBanner();
            } else {
                // Apply saved preferences
                console.log('Cookie Consent: Applying saved preferences...');
                this.applyPreferences(consent);
            }

            // Add settings button listener
            this.addSettingsListener();
        },

        // Show cookie banner
        showBanner: function() {
            console.log('Cookie Consent: Creating banner...');

            // Check if banner already exists
            const existingBanner = document.getElementById('cookie-consent-banner');
            if (existingBanner) {
                console.log('Cookie Consent: Banner already exists, removing...');
                existingBanner.remove();
            }

            const banner = document.createElement('div');
            banner.id = 'cookie-consent-banner';
            banner.className = 'cookie-consent-banner';

            const isEnglish = window.i18n && window.i18n.currentLang === 'en';

            banner.innerHTML = `
                <div class="cookie-consent-container">
                    <div class="cookie-consent-content">
                        <div class="cookie-icon">🍪</div>
                        <div class="cookie-text">
                            <h4>${isEnglish ? 'We Use Cookies' : 'Çerez Kullanımı'}</h4>
                            <p>${isEnglish ?
                                'We use cookies to improve your experience on our website. For detailed information, please review our <a href="/Home/CookiePolicy" target="_blank">Cookie Policy</a> and <a href="/Home/Privacy" target="_blank">Privacy Policy</a> in accordance with GDPR.' :
                                'Web sitemizde size daha iyi hizmet verebilmek ve deneyiminizi iyileştirmek için çerezler kullanıyoruz. Detaylı bilgi için KVKK kapsamında hazırlanmış <a href="/Home/CookiePolicy" target="_blank">Çerez Politikamızı</a> ve <a href="/Home/Privacy" target="_blank">Gizlilik Politikamızı</a> inceleyebilirsiniz.'}</p>
                            <p class="cookie-kvkk-notice">${isEnglish ?
                                'By continuing to use our website, you accept the use of cookies.' :
                                '<strong>6698 sayılı KVKK uyarınca:</strong> Sitemizi kullanmaya devam ederek çerezlerin kullanımını kabul etmiş olursunuz.'}</p>
                        </div>
                    </div>
                    <div class="cookie-consent-actions">
                        <button type="button" class="btn-cookie-settings" onclick="CookieConsent.showSettings()">
                            <i class="fas fa-cog"></i>
                            ${isEnglish ? 'Cookie Settings' : 'Çerez Ayarları'}
                        </button>
                        <button type="button" class="btn-cookie-reject" onclick="CookieConsent.rejectAll()">
                            ${isEnglish ? 'Reject Optional' : 'Zorunlu Olmayanları Reddet'}
                        </button>
                        <button type="button" class="btn-cookie-accept" onclick="CookieConsent.acceptAll()">
                            ${isEnglish ? 'Accept All' : 'Tüm Çerezleri Kabul Et'}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(banner);
            console.log('Cookie Consent: Banner appended to body');

            // Force reflow before animation
            banner.offsetHeight;

            // Animate in
            setTimeout(() => {
                banner.classList.add('show');
                console.log('Cookie Consent: Banner shown with animation');
            }, 100);
        },

        // Show settings modal
        showSettings: function() {
            const existingModal = document.getElementById('cookie-settings-modal');
            if (existingModal) {
                existingModal.remove();
            }

            const isEnglish = window.i18n && window.i18n.currentLang === 'en';
            const consent = this.getConsent() || {};

            const modal = document.createElement('div');
            modal.id = 'cookie-settings-modal';
            modal.className = 'cookie-settings-modal';

            let categoriesHtml = '';
            for (const [key, category] of Object.entries(this.categories)) {
                const isChecked = consent[key] !== false;
                const isDisabled = category.required ? 'disabled' : '';
                const checkedAttr = (category.required || isChecked) ? 'checked' : '';

                categoriesHtml += `
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <label class="cookie-switch">
                                <input type="checkbox"
                                       id="cookie-${key}"
                                       data-category="${key}"
                                       ${checkedAttr}
                                       ${isDisabled}>
                                <span class="cookie-slider"></span>
                            </label>
                            <div class="cookie-category-info">
                                <h5>${category.name}</h5>
                                <p>${category.description}</p>
                                ${category.required ? `<span class="badge-required">${isEnglish ? 'Always Active' : 'Her Zaman Aktif'}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }

            modal.innerHTML = `
                <div class="cookie-settings-backdrop" onclick="CookieConsent.closeSettings()"></div>
                <div class="cookie-settings-content">
                    <div class="cookie-settings-header">
                        <h3>${isEnglish ? 'Cookie Settings' : 'Çerez Ayarları'}</h3>
                        <button type="button" class="btn-close" onclick="CookieConsent.closeSettings()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="cookie-settings-body">
                        <p class="cookie-settings-intro">
                            ${isEnglish ?
                                'Cookies are small text files that are placed on your device to help the website provide a better user experience. You can manage your cookie preferences below.' :
                                'Çerezler, web sitesinin daha iyi bir kullanıcı deneyimi sağlamasına yardımcı olmak için cihazınıza yerleştirilen küçük metin dosyalarıdır. Çerez tercihlerinizi aşağıdan yönetebilirsiniz.'}
                        </p>
                        <div class="cookie-categories">
                            ${categoriesHtml}
                        </div>
                    </div>
                    <div class="cookie-settings-footer">
                        <button type="button" class="btn-cookie-save" onclick="CookieConsent.saveSettings()">
                            ${isEnglish ? 'Save Settings' : 'Ayarları Kaydet'}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Animate in
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        },

        // Close settings modal
        closeSettings: function() {
            const modal = document.getElementById('cookie-settings-modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        },

        // Save settings
        saveSettings: function() {
            const settings = {};

            for (const key of Object.keys(this.categories)) {
                const checkbox = document.getElementById(`cookie-${key}`);
                settings[key] = checkbox ? checkbox.checked : false;
            }

            this.setConsent(settings);
            this.closeSettings();
            this.hideBanner();
            this.applyPreferences(settings);

            // Show toast notification
            if (window.showToast) {
                const isEnglish = window.i18n && window.i18n.currentLang === 'en';
                window.showToast(
                    isEnglish ? 'Cookie settings saved' : 'Çerez ayarları kaydedildi',
                    'success'
                );
            }
        },

        // Accept all cookies
        acceptAll: function() {
            const settings = {};
            for (const key of Object.keys(this.categories)) {
                settings[key] = true;
            }

            this.setConsent(settings);
            this.hideBanner();
            this.applyPreferences(settings);

            // Show toast notification
            if (window.showToast) {
                const isEnglish = window.i18n && window.i18n.currentLang === 'en';
                window.showToast(
                    isEnglish ? 'All cookies accepted' : 'Tüm çerezler kabul edildi',
                    'success'
                );
            }
        },

        // Reject all non-essential cookies
        rejectAll: function() {
            const settings = {};
            for (const [key, category] of Object.entries(this.categories)) {
                settings[key] = category.required;
            }

            this.setConsent(settings);
            this.hideBanner();
            this.applyPreferences(settings);

            // Show toast notification
            if (window.showToast) {
                const isEnglish = window.i18n && window.i18n.currentLang === 'en';
                window.showToast(
                    isEnglish ? 'Non-essential cookies rejected' : 'Zorunlu olmayan çerezler reddedildi',
                    'info'
                );
            }
        },

        // Hide banner
        hideBanner: function() {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.classList.remove('show');
                setTimeout(() => {
                    banner.remove();
                }, 300);
            }
        },

        // Apply preferences (enable/disable cookies)
        applyPreferences: function(settings) {
            // Here you would enable/disable various tracking scripts based on settings
            console.log('Cookie preferences applied:', settings);

            // Example: Google Analytics
            if (settings.analytics) {
                // Enable analytics
                window.dataLayer = window.dataLayer || [];
                // Load GA script if needed
            } else {
                // Disable analytics
                window['ga-disable-GA_MEASUREMENT_ID'] = true;
            }

            // Example: Marketing cookies
            if (settings.marketing) {
                // Enable marketing cookies
            }

            // Trigger custom event
            window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: settings }));
        },

        // Get consent from cookie
        getConsent: function() {
            const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith(this.cookieName + '='));

            if (cookie) {
                try {
                    return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
                } catch (e) {
                    return null;
                }
            }
            return null;
        },

        // Set consent cookie
        setConsent: function(settings) {
            const expires = new Date();
            expires.setDate(expires.getDate() + this.cookieExpiry);

            document.cookie = `${this.cookieName}=${encodeURIComponent(JSON.stringify(settings))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        },

        // Add settings button listener
        addSettingsListener: function() {
            // Add floating cookie settings button
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'cookie-settings-btn';
            settingsBtn.className = 'cookie-settings-btn';
            settingsBtn.innerHTML = '<i class="fas fa-cookie-bite"></i>';
            settingsBtn.title = window.i18n && window.i18n.currentLang === 'en' ? 'Cookie Settings' : 'Çerez Ayarları';
            settingsBtn.onclick = () => this.showSettings();

            document.body.appendChild(settingsBtn);
        },

        // Clear consent (for testing)
        clearConsent: function() {
            document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
            console.log('Cookie Consent: Consent cleared');
            window.location.reload();
        }
    };

    // Make globally available
    window.CookieConsent = CookieConsent;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CookieConsent.init());
    } else {
        CookieConsent.init();
    }
})();