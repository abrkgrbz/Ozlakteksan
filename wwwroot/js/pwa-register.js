/**
 * PWA Registration and Update Handler
 * Manages service worker registration and app installation
 */

(function() {
    'use strict';

    // Check if browser supports service workers
    if (!('serviceWorker' in navigator)) {
        console.log('Service Workers not supported');
        return;
    }

    let deferredPrompt;
    let installButton = null;

    /**
     * Register Service Worker
     */
    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered successfully:', registration);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('Service Worker update found!');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker available
                        showUpdateNotification();
                    }
                });
            });

            // Check for updates every hour
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000);

        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    /**
     * Show update notification
     */
    function showUpdateNotification() {
        if (window.Toast) {
            window.Toast.info(
                'Yeni sürüm mevcut! Güncellemek için sayfayı yenileyin.',
                10000
            );
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = 'pwa-update-notification';
            notification.innerHTML = `
                <div style="position: fixed; bottom: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999; max-width: 300px;">
                    <p style="margin: 0 0 10px 0;">Yeni sürüm mevcut!</p>
                    <button onclick="window.location.reload()" style="background: white; color: #4CAF50; border: none; padding: 5px 15px; border-radius: 3px; cursor: pointer; font-weight: bold;">
                        Güncelle
                    </button>
                </div>
            `;
            document.body.appendChild(notification);
        }
    }

    /**
     * Handle app installation
     */
    function handleInstallPrompt() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();

            // Stash the event so it can be triggered later
            deferredPrompt = e;

            // Show install button
            showInstallButton();

            console.log('Install prompt ready');
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            hideInstallButton();

            if (window.Toast) {
                window.Toast.success('Uygulama başarıyla yüklendi!');
            }
        });
    }

    /**
     * Show install button
     */
    function showInstallButton() {
        // Create install button if it doesn't exist
        if (!installButton) {
            installButton = document.createElement('button');
            installButton.id = 'pwa-install-button';
            installButton.className = 'btn btn-primary shadow-lg';
            installButton.innerHTML = `
                <i class="fas fa-download me-2"></i>Uygulamayı Yükle
            `;
            installButton.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                z-index: 1000;
                padding: 12px 24px;
                border-radius: 50px;
                font-weight: 600;
                transition: all 0.3s ease;
                display: none;
            `;

            installButton.addEventListener('click', installApp);
            document.body.appendChild(installButton);
        }

        // Show the button with animation
        setTimeout(() => {
            installButton.style.display = 'block';
            installButton.style.animation = 'slideInRight 0.5s ease';
        }, 2000);

        // Hide after 10 seconds if not clicked
        setTimeout(() => {
            if (installButton && installButton.style.display === 'block') {
                hideInstallButton();
            }
        }, 12000);
    }

    /**
     * Hide install button
     */
    function hideInstallButton() {
        if (installButton) {
            installButton.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                installButton.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Install the app
     */
    async function installApp() {
        if (!deferredPrompt) {
            console.log('Install prompt not available');
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response to install prompt: ${outcome}`);

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        deferredPrompt = null;

        // Hide the install button
        hideInstallButton();
    }

    /**
     * Check if app is installed
     */
    function isAppInstalled() {
        // Check if running in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }

        // Check for iOS
        if (window.navigator.standalone === true) {
            return true;
        }

        return false;
    }

    /**
     * Show iOS install instructions
     */
    function showiOSInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        if (isIOS && !isAppInstalled()) {
            // Check if already shown in this session
            if (sessionStorage.getItem('iosInstallShown')) {
                return;
            }

            setTimeout(() => {
                const instructions = document.createElement('div');
                instructions.className = 'ios-install-instructions';
                instructions.innerHTML = `
                    <div style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: white; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 9999; max-width: 90%; width: 350px; text-align: center;">
                        <button onclick="this.parentElement.remove()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                        <div style="font-size: 40px; margin-bottom: 10px;">📲</div>
                        <h4 style="margin: 0 0 10px 0; color: #333;">Uygulamayı Yükle</h4>
                        <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                            Ana ekranınıza eklemek için:
                        </p>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; color: #007AFF;">
                            <span style="font-size: 24px;">⬆️</span>
                            <span>Paylaş butonuna</span>
                        </div>
                        <div style="margin-top: 10px; color: #666;">
                            sonra "Ana Ekrana Ekle" seçin
                        </div>
                    </div>
                `;
                document.body.appendChild(instructions);

                // Mark as shown
                sessionStorage.setItem('iosInstallShown', 'true');

                // Remove after 8 seconds
                setTimeout(() => {
                    instructions.remove();
                }, 8000);
            }, 5000);
        }
    }

    /**
     * Initialize PWA features
     */
    function initPWA() {
        registerServiceWorker();
        handleInstallPrompt();
        showiOSInstallInstructions();

        // Log install state
        if (isAppInstalled()) {
            console.log('App is installed');
        } else {
            console.log('App is not installed');
        }

        // Add online/offline indicator
        updateOnlineStatus();
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }

    /**
     * Update online/offline status
     */
    function updateOnlineStatus() {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
            console.log('Online');
        } else {
            document.body.classList.add('offline');
            console.log('Offline');

            if (window.Toast) {
                window.Toast.warning('İnternet bağlantısı kesildi. Çevrimdışı moddasınız.');
            }
        }
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        body.offline::before {
            content: 'Çevrimdışı';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #f44336;
            color: white;
            text-align: center;
            padding: 5px;
            font-size: 14px;
            z-index: 9999;
        }

        #pwa-install-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPWA);
    } else {
        initPWA();
    }
})();