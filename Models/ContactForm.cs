using System.ComponentModel.DataAnnotations;

namespace OzlasteksanWeb.Models
{
    public class ContactForm
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

        [Display(Name = "Şirket")]
        public string? Company { get; set; }

        [Required(ErrorMessage = "Konu alanı zorunludur")]
        [Display(Name = "Konu")]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mesaj alanı zorunludur")]
        [Display(Name = "Mesajınız")]
        [StringLength(1000, ErrorMessage = "Mesajınız en fazla 1000 karakter olabilir")]
        public string Message { get; set; } = string.Empty;
    }
}
