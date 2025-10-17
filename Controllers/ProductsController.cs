using Microsoft.AspNetCore.Mvc;
using OzlasteksanWeb.Models;

namespace OzlasteksanWeb.Controllers
{
    public class ProductsController : Controller
    {
        public IActionResult Index()
        {
            var products = GetProducts();
            return View(products);
        }

        public IActionResult Details(int id)
        {
            var product = GetProducts().FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        private List<Product> GetProducts()
        {
            return new List<Product>
            {
                new Product { Id = 1, Name = "O-ring Conta", Category = "Conta", Description = "Endüstriyel sızdırmazlık uygulamaları için yüksek dayanımlı O-ring contalar. Farklı ölçü ve elastomer seçenekleri mevcuttur.", Icon = "fa-circle" },
                new Product { Id = 2, Name = "Kauçuk Levhalar", Category = "Levha", Description = "SBR, NBR, EPDM, neopren ve silikon levhalar. 1 mm - 50 mm kalınlık aralığında plaka kesim desteği.", Icon = "fa-layer-group" },
                new Product { Id = 3, Name = "Kaplin Lastikleri", Category = "Kaplin", Description = "Yıldız, fışkı ve papatya tip kaplin lastikleri. Titreşim sönümleme ve yüksek tork aktarımı sağlar.", Icon = "fa-cog" },
                new Product { Id = 4, Name = "Kauçuk Takozlar", Category = "Takoz", Description = "Silindir, konik ve özel formda takozlar. Makine ve teçhizat montajlarında vibrasyon kontrolü sunar.", Icon = "fa-cube" },
                new Product { Id = 5, Name = "Kauçuk Körükler", Category = "Körük", Description = "Özel ölçülerde esnek körük sistemleri. Hareket ve genleşme kompanzasyonu için üretilir.", Icon = "fa-expand-arrows-alt" },
                new Product { Id = 6, Name = "Diyafram Lastikleri", Category = "Diyafram", Description = "Pompa ve vana sistemleri için uzun ömürlü diyafram lastikleri. Kimyasal dayanımı yüksek seçenekler.", Icon = "fa-record-vinyl" },
                new Product { Id = 7, Name = "Kablo Geçit Lastikleri", Category = "Geçit", Description = "Kablo ve boru geçişlerinde tam sızdırmazlık sağlayan contalar. Elektromekanik sistemlerle uyumlu.", Icon = "fa-plug" },
                new Product { Id = 8, Name = "Kauçuk Profil Boru", Category = "Profil", Description = "Özel kesit profilli kauçuk hortum ve borular. Tasarımınıza uygun ölçülerde üretim yapılır.", Icon = "fa-shapes" },
                new Product { Id = 9, Name = "Silikon Levhalar", Category = "Levha", Description = "Gıda onaylı silikon levhalar. 60-80 Shore A sertlik seçenekleri ve yüksek ısı dayanımı sunar.", Icon = "fa-layer-group" },
                new Product { Id = 10, Name = "Poliüretan Levhalar", Category = "Levha", Description = "Yüksek aşınma direncine sahip poliüretan levhalar. Darbe ve kesilme direncine ihtiyaç duyulan uygulamalar için.", Icon = "fa-layer-group" },
                new Product { Id = 11, Name = "Sünger Levhalar", Category = "Levha", Description = "Açık ve kapalı gözenekli sünger levhalar. Yalıtım, dolgu ve amortisör amaçlı kullanıma uygundur.", Icon = "fa-layer-group" },
                new Product { Id = 12, Name = "Yıldız Kaplin Lastikleri", Category = "Kaplin", Description = "Esnek yıldız kaplin elastomerleri. Çeşitli boyut ve shore sertliklerinde stoktan temin edilir.", Icon = "fa-star" },
                new Product { Id = 13, Name = "Fışkı Kaplin Lastikleri", Category = "Kaplin", Description = "Silindirik fışkı kaplin lastikleri. Yüksek moment aktarımı ve titreşim sönümleme sağlar.", Icon = "fa-cog" },
                new Product { Id = 14, Name = "Titreşim Kesen Lastikler", Category = "Takoz", Description = "Anti-vibrasyon lastik takozlar. Motor, kompresör ve makine montajları için geliştirilmiştir.", Icon = "fa-compress-arrows-alt" },
                new Product { Id = 15, Name = "U Tipi Lastikler", Category = "Conta", Description = "U profil kauçuk contalar. Şaft ve piston sızdırmazlığı için farklı malzeme seçenekleri.", Icon = "fa-square" },
                new Product { Id = 16, Name = "Vana Lastikleri", Category = "Diyafram", Description = "Kelebek vana ve endüstriyel vana lastikleri. Kimyasal dayanımı yüksek karışımlar ile üretilir.", Icon = "fa-circle-notch" },
                new Product { Id = 17, Name = "Vantuz Lastikleri", Category = "Özel", Description = "Endüstriyel vantuz sistemleri için elastomer parçalar. Vakum performansı yüksek çözümler.", Icon = "fa-dot-circle" },
                new Product { Id = 18, Name = "Özel Üretim Kauçuk", Category = "Özel", Description = "Projelerinize özel tasarım ve üretim kauçuk parçalar. CAD desteği ve numune üretimi dahildir.", Icon = "fa-tools" }
            };
        }
    }
}
