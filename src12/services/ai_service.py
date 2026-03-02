import google.generativeai as genai
import os

# API Anahtarını temizleyerek tanımlıyoruz
RAW_API_KEY = "SENIN_API_ANAHTARIN"
genai.configure(api_key=RAW_API_KEY.strip())


def run_ai_analysis(factory_state: dict) -> str:
    try:
        # Model ismini tam yol olarak güncelledik: models/gemini-1.5-flash
        model = genai.GenerativeModel('models/gemini-1.5-flash')

        prompt = f"""
        Rol: Kıdemli Endüstriyel Üretim Müdürü
        FABRİKA ACİL DURUM VERİLERİ:
        - Kapasite Doluluk: %{factory_state.get('utilization')} (TEHLİKELİ SEVİYE)
        - Arızalı Makine: {factory_state.get('broken_machines')}
        - Etkilenen Ürün Sayısı: {factory_state.get('affected_count')}
        - Personel Performans Skoru: {factory_state.get('avg_performance')}

        GÖREV: Bu verileri analiz et. %500'e yaklaşan bu devasa iş yükü ve makine arızası için 
        yönetime acil, sert ve uygulanabilir 2 çözüm önerisi sun.
        """

        # Generation_config ekleyerek daha stabil bir yanıt alabiliriz
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Gemini Analiz Hatası: {str(e)}"