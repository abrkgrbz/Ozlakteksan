# Özlasteksan Kauçuk - Modern Web Sitesi

Modern ve profesyonel tasarıma sahip ASP.NET Core MVC tabanlı endüstriyel kauçuk ürünleri web sitesi.

## 🎨 Özellikler

### Tasarım & UX
- **Premium Modern Tasarım**: Gradient renkler, smooth animasyonlar ve modern UI elementleri
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Hover Efektleri**: 3D transform, shadow ve gradient efektleri
- **Animasyonlar**: Smooth transitions, fade-in ve float animasyonları
- **Modern Tipografi**: Inter font family ile profesyonel görünüm

### Teknik Özellikler
- **ASP.NET Core 9.0 MVC**: En güncel .NET teknolojisi
- **Bootstrap 5**: Responsive grid sistemi
- **Font Awesome 6**: Modern ikonlar
- **CSS Variables**: Kolay tema yönetimi
- **Form Validation**: Client-side ve server-side doğrulama

### Sayfalar
1. **Ana Sayfa**
   - Hero section (gradient background, animasyonlu badge)
   - İstatistikler (1000+ müşteri, 500+ ürün, 7/24 destek)
   - Özellikler bölümü (4 adet özellik kartı)
   - Ürün kategorileri (9 adet renkli kartlar)
   - CTA (Call-to-Action) bölümü

2. **Ürünler Sayfası**
   - 18 farklı ürün kategorisi
   - Kategori filtreleme sistemi
   - Detaylı ürün kartları
   - Smooth filtreleme animasyonları

3. **Ürün Detay Sayfası**
   - Breadcrumb navigasyon
   - Ürün özellikleri
   - Teklif alma butonu
   - Benzer ürünler önerisi

4. **İletişim Sayfası**
   - Responsive iletişim formu
   - İletişim bilgileri
   - Form validasyonu
   - Başarı mesajları

5. **Teklif Formu**
   - Detaylı teklif formu
   - Ürün seçimi dropdown
   - Miktar ve özellik girişi
   - 3 adet öne çıkan özellik kartı

## 🚀 Kurulum

### Gereksinimler
- .NET 9.0 SDK
- Visual Studio 2022 veya VS Code

### Adımlar

1. Projeyi klonlayın veya indirin
```bash
cd Ozlakteksan
```

2. Bağımlılıkları yükleyin
```bash
dotnet restore
```

3. Projeyi derleyin
```bash
dotnet build
```

4. Uygulamayı çalıştırın
```bash
dotnet run
```

5. Tarayıcınızda açın
```
http://localhost:5029
```

## 📁 Proje Yapısı

```
Ozlakteksan/
├── Controllers/
│   ├── HomeController.cs        # Ana sayfa, iletişim, teklif
│   └── ProductsController.cs    # Ürünler ve detaylar
├── Models/
│   ├── Product.cs               # Ürün modeli
│   ├── ContactForm.cs           # İletişim formu modeli
│   ├── QuoteForm.cs             # Teklif formu modeli
│   └── ErrorViewModel.cs        # Hata modeli
├── Views/
│   ├── Home/
│   │   ├── Index.cshtml         # Ana sayfa
│   │   ├── Contact.cshtml       # İletişim
│   │   └── Quote.cshtml         # Teklif formu
│   ├── Products/
│   │   ├── Index.cshtml         # Ürünler listesi
│   │   └── Details.cshtml       # Ürün detayı
│   └── Shared/
│       ├── _Layout.cshtml       # Ana layout
│       └── Error.cshtml         # Hata sayfası
├── wwwroot/
│   ├── css/
│   │   └── site.css            # Premium CSS tasarımı
│   └── lib/                    # Bootstrap, jQuery, vb.
└── Program.cs                  # Uygulama giriş noktası
```

## 🎨 Renk Paleti

```css
--primary-color: #e31e24      /* Ana kırmızı */
--primary-dark: #b71c1c       /* Koyu kırmızı */
--primary-light: #ff5252      /* Açık kırmızı */
--text-dark: #212121          /* Ana metin */
--text-light: #757575         /* İkincil metin */
--bg-light: #f5f5f5           /* Açık arkaplan */
```

## 💡 Öne Çıkan Özellikler

### Modern CSS Teknikleri
- CSS Variables (Custom Properties)
- CSS Grid & Flexbox
- Gradient backgrounds
- Box shadows (layered)
- Backdrop filters
- Transform animations
- Cubic-bezier timing functions

### Animasyonlar
```css
/* Float animasyonu */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Fade in animasyonu */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Hover Efektleri
- Card lift effect (translateY + scale)
- Icon rotation ve scale
- Shadow intensity artışı
- Gradient overlay
- Button ripple effect

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: > 992px

## 🔧 Geliştirme

### Yeni Ürün Ekleme
`ProductsController.cs` içindeki `GetProducts()` metoduna yeni ürün ekleyin:

```csharp
new Product {
    Id = 19,
    Name = "Yeni Ürün",
    Category = "Kategori",
    Description = "Açıklama",
    Icon = "fa-icon-name"
}
```

### CSS Özelleştirme
`wwwroot/css/site.css` dosyasındaki CSS variables değerlerini değiştirin:

```css
:root {
  --primary-color: #yeni-renk;
}
```

## 📞 İletişim Bilgileri

- **Telefon**: 0212 243 46 08
- **Çalışma Saatleri**: Pazartesi - Cuma, 08:00 - 18:00
- **Adres**: İstanbul, Türkiye

## 📄 Lisans

Bu proje Özlasteksan Kauçuk için geliştirilmiştir.

## 🛠️ Teknolojiler

- ASP.NET Core 9.0 MVC
- Bootstrap 5.3
- Font Awesome 6.5
- jQuery 3.7
- Modern CSS3
- HTML5

---

**Geliştirici Notu**: Bu proje modern web tasarım prensipleri ve best practices kullanılarak geliştirilmiştir. Premium kullanıcı deneyimi için gradient'ler, animasyonlar ve hover efektleri eklenmiştir.
