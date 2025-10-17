using System.ComponentModel.DataAnnotations;

namespace OzlasteksanWeb.Models
{
    public class QuoteForm
    {
        [Required(ErrorMessage = "Ad Soyad alanı zorunludur")]
        [Display(Name = "Ad Soyad")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta alanı zorunludur")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz")]
        [Display(Name = "E-posta")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon alanı zorunludur")]
        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz")]
        [Display(Name = "Telefon")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Şirket alanı zorunludur")]
        [Display(Name = "Şirket")]
        public string Company { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ürün alanı zorunludur")]
        [Display(Name = "Ürün / Kategori")]
        public string Product { get; set; } = string.Empty;

        [Display(Name = "Miktar")]
        public string? Quantity { get; set; }

        [Display(Name = "Ölçü / Özellikler")]
        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir")]
        public string? Specifications { get; set; }

        [Display(Name = "Ek Notlar")]
        [StringLength(1000, ErrorMessage = "Notlar en fazla 1000 karakter olabilir")]
        public string? AdditionalNotes { get; set; }
    }
}
