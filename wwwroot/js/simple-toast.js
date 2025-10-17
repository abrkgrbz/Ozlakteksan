/**
 * Simple Toast System - Guaranteed to Work!
 * Bağımlılık yok, kesinlikle çalışacak
 */

(function() {
    'use strict';

    console.log('🍞 Simple Toast System yükleniyor...');

    // Toast container oluştur
    function createToastContainer() {
        let container = document.getElementById('simpleToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'simpleToastContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    // Toast göster
    function showToast(message, type = 'info') {
        console.log(`📢 Toast gösteriliyor: ${type} - ${message}`);

        const container = createToastContainer();
        const toast = document.createElement('div');
        const id = 'toast-' + Date.now();

        // Renkler
        const colors = {
            success: { bg: '#10b981', icon: '✅' },
            error: { bg: '#ef4444', icon: '❌' },
            warning: { bg: '#f59e0b', icon: '⚠️' },
            info: { bg: '#3b82f6', icon: 'ℹ️' }
        };

        const color = colors[type] || colors.info;

        toast.id = id;
        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            background: white;
            color: #333;
            padding: 16px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid ${color.bg};
            min-width: 300px;
            max-width: 500px;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
        `;

        toast.innerHTML = `
            <span style="font-size: 20px;">${color.icon}</span>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 2px;">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div style="font-size: 14px;">${message}</div>
            </div>
            <button style="
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 20px;
                padding: 0;
                margin-left: 10px;
            " onclick="document.getElementById('${id}').remove()">×</button>
        `;

        // Click ile kapat
        toast.onclick = function() {
            this.style.opacity = '0';
            this.style.transform = 'translateX(400px)';
            setTimeout(() => this.remove(), 300);
        };

        container.appendChild(toast);

        // Animasyon
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        // Otomatik kapat
        setTimeout(() => {
            if (document.getElementById(id)) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (document.getElementById(id)) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 4000);

        return id;
    }

    // Global API
    window.SimpleToast = {
        show: showToast,
        success: (msg) => showToast(msg, 'success'),
        error: (msg) => showToast(msg, 'error'),
        warning: (msg) => showToast(msg, 'warning'),
        info: (msg) => showToast(msg, 'info')
    };

    // Eski Toast sistemini override et
    window.Toast = window.SimpleToast;

    // Test fonksiyonu
    window.toastTest = function() {
        console.log('🧪 Toast Test Başladı...');
        SimpleToast.success('Success toast çalışıyor! 🎉');
        setTimeout(() => SimpleToast.error('Error toast çalışıyor! 🔴'), 500);
        setTimeout(() => SimpleToast.warning('Warning toast çalışıyor! ⚠️'), 1000);
        setTimeout(() => SimpleToast.info('Info toast çalışıyor! ℹ️'), 1500);
    };

    // DOM hazır olduğunda
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ Simple Toast System hazır!');
            console.log('🎯 Kullanım: window.Toast.success("Mesaj")');
            console.log('🧪 Test için: toastTest()');
        });
    } else {
        console.log('✅ Simple Toast System hazır!');
        console.log('🎯 Kullanım: window.Toast.success("Mesaj")');
        console.log('🧪 Test için: toastTest()');
    }

})();

// Sayfa yüklendiğinde otomatik test
window.addEventListener('load', function() {
    console.log('📋 Toast sistemi kontrol ediliyor...');
    if (window.Toast && window.Toast.success) {
        console.log('✅ Toast sistemi aktif ve çalışıyor!');
        // Otomatik hoşgeldin mesajı
        setTimeout(() => {
            window.Toast.info('UI özellikleri yüklendi! Test sayfasına hoş geldiniz.');
        }, 1000);
    } else {
        console.error('❌ Toast sistemi yüklenemedi!');
    }
});