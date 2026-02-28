using System;
using System.ComponentModel.DataAnnotations;

namespace FabrikaBackend.Models
{
    public class Stock
    {
        // Veritabanı için otomatik artan birincil anahtar
        public int Id { get; set; } 
        
        // MULTI-TENANT: Bu stok hangi fabrikaya ait?
        public int CompanyId { get; set; } 

        [Required(ErrorMessage = "Stok ID zorunludur.")]
        public string StockCode { get; set; } // stok_id (Örn: STK_D3043)

        [Required(ErrorMessage = "Stok kategorisi zorunludur.")]
        public string Category { get; set; } // stok_kategorisi (Örn: hammadde)

        [Required(ErrorMessage = "Ürün kodu zorunludur.")]
        public string ProductCode { get; set; } // urun_kodu (Örn: D3043)

        [Required(ErrorMessage = "Malzeme adı zorunludur.")]
        public string MaterialName { get; set; } // malzeme_adi (Örn: Rulo Demir)

        public string MaterialType { get; set; } // malzeme_tipi (Örn: cubuk)

        public string Dimensions { get; set; } // ebat (Örn: Ø22)

        // Soru işareti (?) bu alanların boş (null) bırakılabileceğini gösterir. Görseldeki boşluklar için şart!
        public double? ThicknessMm { get; set; } // kalinlik_mm (Örn: 22.0)
        
        public double? GrossWeightKg { get; set; } // brut_agirlik_kg (Örn: 0.87)
        
        public double? Quantity { get; set; } // miktar (Örn: 558)

        [Required(ErrorMessage = "Birim zorunludur.")]
        public string Unit { get; set; } // birim (Örn: kg)
    }
}