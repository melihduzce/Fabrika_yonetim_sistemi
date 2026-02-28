using System;
using System.ComponentModel.DataAnnotations;

namespace FabrikaBackend.Models
{
    public class Personnel
    {
        // Temel Bilgiler
        public int Id { get; set; }
        
        // MULTI-TENANT: Bu personel hangi fabrikada çalışıyor?
        public int CompanyId { get; set; } 

        [Required(ErrorMessage = "Ad zorunludur.")]
        public string FirstName { get; set; } // ad

        [Required(ErrorMessage = "Soyad zorunludur.")]
        public string LastName { get; set; } // soyad

        // TC KİMLİK KISITLAMASI (Tam 11 hane ve sadece rakam)
        [Required(ErrorMessage = "TC Kimlik No zorunludur.")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "TC Kimlik No tam 11 haneli olmalıdır.")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "TC Kimlik No sadece rakamlardan oluşmalıdır.")]
        public string TcNo { get; set; } 

        // TELEFON KISITLAMASI (0 ile başlar, tam 11 hane)
        [Required(ErrorMessage = "Telefon numarası zorunludur.")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "Telefon numarası 11 haneli olmalıdır (Örn: 05551234567).")]
        [RegularExpression("^0[0-9]{10}$", ErrorMessage = "Telefon numarası 0 ile başlamalı ve sadece rakam içermelidir.")]
        public string PhoneNumber { get; set; } // telefon

        // İş Bilgileri
        public string Department { get; set; } // departman
        public string Position { get; set; } // pozisyon
        public decimal Salary { get; set; } // maas
        public DateTime HireDate { get; set; } // ise_giris_tarihi

        // İzin Bilgileri
        public int TotalAnnualLeave { get; set; } // yillik_izin_hakki
        public int UsedLeave { get; set; } // kullanilan_izin
        public int RemainingLeave { get; set; } // kalan_izin

        // Performans ve Üretim
        public double PerformanceScore { get; set; } // performans_puani
        public double AverageDailyProduction { get; set; } // ortalama_gunluk_uretim
        public int AbsenteeismDays { get; set; } // devamsizlik_gun
        public double OvertimeHours { get; set; } // fazla_mesai_saat
        public string Certifications { get; set; } // egitim_sertifikalari

        // Acil Durum Bilgileri
        public string EmergencyContactName { get; set; } // acil_durum_kisi

        [StringLength(11, MinimumLength = 11, ErrorMessage = "Acil durum telefonu 11 haneli olmalıdır.")]
        [RegularExpression("^0[0-9]{10}$", ErrorMessage = "Acil durum telefonu geçerli bir formatta olmalıdır.")]
        public string EmergencyContactPhone { get; set; } // acil_durum_tel

        // Durum
        public bool IsActive { get; set; } = true; // aktif (Varsayılan olarak işe giren kişi aktiftir)
    }
}