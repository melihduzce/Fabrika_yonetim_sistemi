import math


def calculate_production_days(quantity: int, daily_capacity: int, has_heat_treatment: bool) -> float:
    """
    MVP belgesindeki resmi formüle göre üretim süresini hesaplar.
    """
    # 1. Adım: Verimlilik Çarpanı (%85) ile Net Kapasiteyi Bul
    net_daily_capacity = daily_capacity * 0.85

    # Sıfıra bölünme hatasını engellemek için ufak bir güvenlik kontrolü
    if net_daily_capacity <= 0:
        return 0.0

    # 2. Adım: Temel Üretim Süresini Hesapla
    estimated_days = quantity / net_daily_capacity

    # 3. Adım: Isıl İşlem Kuralı (+1 Gün)
    if has_heat_treatment:
        estimated_days += 1.0

    # Sonucu virgülden sonra 2 haneli olacak şekilde yuvarlayıp döndür
    return round(estimated_days, 2)