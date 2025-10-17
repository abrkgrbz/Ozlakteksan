// Toast Debug Script
console.log('🔍 Toast Debug Script Yüklendi');

// DOM yüklendikten sonra test et
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM Yüklendi, test başlıyor...');

    // 1. UI Enhancements modülü yüklendi mi?
    if (typeof UIEnhancements !== 'undefined') {
        console.log('✅ UIEnhancements modülü bulundu');
    } else {
        console.error('❌ UIEnhancements modülü bulunamadı!');
        return;
    }

    // 2. window.Toast objesi var mı?
    if (typeof window.Toast !== 'undefined') {
        console.log('✅ window.Toast objesi mevcut');
        console.log('Toast metodları:', Object.keys(window.Toast));
    } else {
        console.error('❌ window.Toast objesi bulunamadı!');

        // Manuel olarak oluşturmayı dene
        console.log('🔧 Toast objesini manuel oluşturuluyor...');
        UIEnhancements.init();

        setTimeout(() => {
            if (window.Toast) {
                console.log('✅ window.Toast manuel olarak oluşturuldu');
            } else {
                console.error('❌ window.Toast hala yok!');
            }
        }, 100);
    }

    // 3. Toast container var mı?
    setTimeout(() => {
        const container = document.getElementById('toastContainer');
        if (container) {
            console.log('✅ Toast container DOM\'da mevcut');
            console.log('Container:', container);
        } else {
            console.error('❌ Toast container DOM\'da bulunamadı!');

            // Manuel olarak container oluştur
            console.log('🔧 Toast container manuel oluşturuluyor...');
            const newContainer = document.createElement('div');
            newContainer.id = 'toastContainer';
            newContainer.className = 'toast-container';
            document.body.appendChild(newContainer);
            console.log('✅ Toast container oluşturuldu');
        }
    }, 500);

    // 4. CSS yüklendi mi?
    const styles = getComputedStyle(document.body);
    console.log('🎨 CSS Variables kontrolü:');
    console.log('--primary-color:', styles.getPropertyValue('--primary-color'));
    console.log('--accent-color:', styles.getPropertyValue('--accent-color'));
});

// Basit toast fonksiyonu
function simpleToast(message, type = 'success') {
    console.log(`🍞 SimpleToast çağrıldı: ${type} - ${message}`);

    // Container kontrol
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
        console.log('✅ Container oluşturuldu');
    }

    // Toast element oluştur
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
        min-width: 300px;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
    `;

    // İçerik ekle
    toast.innerHTML = `
        <div style="flex: 1; color: #333; font-weight: 500;">${message}</div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: #999;">✕</button>
    `;

    container.appendChild(toast);

    // Animasyon
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 10);

    // Otomatik gizle
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);

    console.log('✅ Toast gösterildi');
}

// Global fonksiyonları ekle
window.testToast = function() {
    console.log('🧪 Test Toast çağrıldı');

    // window.Toast var mı?
    if (window.Toast && window.Toast.success) {
        console.log('📢 window.Toast.success kullanılıyor...');
        window.Toast.success('Bu bir test mesajıdır!');
    } else {
        console.warn('⚠️ window.Toast bulunamadı, simpleToast kullanılıyor...');
        simpleToast('Bu bir test mesajıdır (fallback)!', 'success');
    }
};

window.debugToast = function() {
    console.group('🔍 Toast Debug Bilgileri');
    console.log('UIEnhancements:', typeof UIEnhancements);
    console.log('window.Toast:', window.Toast);
    console.log('ToastContainer:', document.getElementById('toastContainer'));
    console.log('Document ready state:', document.readyState);
    console.groupEnd();

    // Manuel test
    simpleToast('Debug toast çalışıyor!', 'info');
};

console.log('✨ Toast test fonksiyonları hazır:');
console.log('- testToast() : Normal toast testi');
console.log('- debugToast() : Debug bilgileri ve test');
console.log('- simpleToast("mesaj", "type") : Basit toast');