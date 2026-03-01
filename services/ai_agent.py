"""
AI Agent Servis Katmanı
-----------------------
Provider-agnostic yapı: LLM_PROVIDER env değişkeni ile
"openai" | "anthropic" | "gemini" | "groq" | "mock" seçilir.
"""

import json
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from config import LLM_PROVIDER, LLM_API_KEY, LLM_MODEL
from models import AIAnalysisLog, RiskLevel
from schemas import AIAnalyzeResponse, AIRecommendation
from services.capacity_service import get_capacity_summary


# ─── LLM Adapter ─────────────────────────────────────────────────────────────

class LLMAdapter:

    def __init__(self, provider: str, api_key: str, model: str):
        self.provider = provider
        self.api_key = api_key
        self.model = model

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        if self.provider == "openai":
            return self._openai(system_prompt, user_prompt)
        elif self.provider == "anthropic":
            return self._anthropic(system_prompt, user_prompt)
        elif self.provider == "gemini":
            return self._gemini(system_prompt, user_prompt)
        elif self.provider == "groq":
            return self._groq(system_prompt, user_prompt)
        else:
            return self._mock(system_prompt, user_prompt)

    def _openai(self, system: str, user: str) -> str:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)
            model = self.model or "gpt-4o-mini"
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content
        except Exception as e:
            return self._error_response(str(e))

    def _anthropic(self, system: str, user: str) -> str:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=self.api_key)
            model = self.model or "claude-sonnet-4-20250514"
            message = client.messages.create(
                model=model,
                max_tokens=1024,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
            return message.content[0].text
        except Exception as e:
            return self._error_response(str(e))

    def _gemini(self, system: str, user: str) -> str:
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            model_name = self.model or "gemini-1.5-flash"
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system,
            )
            response = model.generate_content(user)
            return response.text
        except Exception as e:
            return self._error_response(str(e))

    def _groq(self, system: str, user: str) -> str:
        try:
            from openai import OpenAI
            client = OpenAI(
                api_key=self.api_key,
                base_url="https://api.groq.com/openai/v1",
            )
            model = self.model or "llama-3.3-70b-versatile"
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content
        except Exception as e:
            return self._error_response(str(e))

    def _mock(self, system: str, user: str) -> str:
        utilization = 75.0
        if "utilization" in user.lower():
            import re
            match = re.search(r'"utilization_percent":\s*([\d.]+)', user)
            if match:
                utilization = float(match.group(1))

        if utilization >= 110:
            risk = "CRITICAL"
            recs = [
                {"action": "emergency_shift", "priority": "high",
                 "description": "Acil ek vardiya planlanmalı, kapasite kritik seviyede aşıldı."},
                {"action": "postpone_low_margin", "priority": "high",
                 "description": "Düşük marjlı siparişler ertelenebilir."},
                {"action": "outsource", "priority": "medium",
                 "description": "Bazı ürünler fason üreticilere verilebilir."},
            ]
            analysis = (
                f"Kapasite kullanımı %{utilization:.1f} ile kritik seviyede. "
                "Acil aksiyon alınmazsa teslim gecikmeleri kaçınılmazdır."
            )
        elif utilization >= 90:
            risk = "HIGH"
            recs = [
                {"action": "add_shift", "priority": "high",
                 "description": "Ek vardiya veya fazla mesai planlanması önerilir."},
                {"action": "reorder_priority", "priority": "medium",
                 "description": "Sipariş öncelik sırası yüksek marjlı ürünler lehine revize edilebilir."},
            ]
            analysis = (
                f"Kapasite kullanımı %{utilization:.1f}. "
                "Yeni sipariş alımında dikkatli olunmalı."
            )
        elif utilization >= 85:
            risk = "MEDIUM"
            recs = [
                {"action": "monitor_closely", "priority": "medium",
                 "description": "Kapasite yakından izlenmeli, yeni büyük sipariş kabul edilmemeli."},
            ]
            analysis = (
                f"Kapasite kullanımı %{utilization:.1f}, uyarı eşiğinde. "
                "Mevcut siparişler planlandığı gibi tamamlanabilir."
            )
        else:
            risk = "LOW"
            recs = [
                {"action": "accept_orders", "priority": "low",
                 "description": "Kapasite müsait, yeni sipariş alımı sorunsuz devam edebilir."},
            ]
            analysis = f"Kapasite kullanımı %{utilization:.1f}, sistem normal çalışıyor."

        return json.dumps({
            "risk_level": risk,
            "analysis": analysis,
            "recommendations": recs,
        }, ensure_ascii=False)

    def _error_response(self, error: str) -> str:
        return json.dumps({
            "risk_level": "MEDIUM",
            "analysis": f"AI analiz sırasında hata oluştu: {error}",
            "recommendations": [
                {"action": "check_api_key", "priority": "high",
                 "description": "LLM API bağlantısını kontrol edin."}
            ],
        }, ensure_ascii=False)


# ─── Prompt Builder ──────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
Sen bir üretim fabrikası yönetim asistanısın. Türkçe yanıt veriyorsun.

Analiz edeceğin veriler:
- Kapasite doluluk oranı ve risk seviyesi
- Aktif siparişler ve kâr marjları
- Personel performansı ve devamsızlık oranı
- Kritik hammadde stok durumu

Görevin:
1. Risk seviyesini belirle (LOW / MEDIUM / HIGH / CRITICAL)
2. Tüm verileri göz önünde bulundurarak net bir analiz yaz
3. Öncelikli somut aksiyon önerileri üret

Önemli kurallar:
- Yanıtın tamamen Türkçe olmalı, İngilizce kelime kullanma
- action alanları snake_case olmalı ve başında/sonunda boşluk olmamalı
- priority alanı sadece: high, medium, low olabilir
- analysis kısa ve net olmalı, 3-4 cümle yeterli

SADECE JSON formatında yanıt ver, başka hiçbir şey yazma:
{
  "risk_level": "HIGH",
  "analysis": "...",
  "recommendations": [
    {"action": "ek_vardiya_planla", "priority": "high", "description": "..."},
    ...
  ]
}
"""


def build_risk_prompt(factory_state: dict) -> str:
    return f"""
Aşağıdaki fabrika verilerini analiz et. Yanıtın TAMAMEN TÜRKÇE olmalı.
Yabancı dil kelime kullanma. Action değerleri Türkçe snake_case olmalı.

Fabrika Durumu:
{json.dumps(factory_state, ensure_ascii=False, indent=2)}

Analiz kriterleri:
- Kapasite %85 üzerindeyse risk artıyor
- Düşük marjlı sipariş varsa karlılık uyarısı ver
- Kritik stok varsa tedarik uyarısı ver
- Personel devamsızlığı %5 üzerindeyse üretim riski var

Yanıtı sadece bu JSON formatında ver:
{{
  "risk_level": "LOW",
  "analysis": "Türkçe analiz metni buraya",
  "recommendations": [
    {{"action": "turkce_aksiyon_adi", "priority": "high", "description": "Türkçe açıklama"}}
  ]
}}
"""


# ─── AI Agent ────────────────────────────────────────────────────────────────

llm = LLMAdapter(
    provider=LLM_PROVIDER,
    api_key=LLM_API_KEY,
    model=LLM_MODEL,
)


def run_ai_analysis(
    db: Session,
    trigger_event: str = "manual",
    order_id: Optional[int] = None,
) -> AIAnalyzeResponse:

    capacity = get_capacity_summary(db)
    factory_state = _collect_factory_state(db, capacity)

    prompt = build_risk_prompt(factory_state)
    raw_response = llm.complete(SYSTEM_PROMPT, prompt)

    result = _parse_llm_response(raw_response)

    recommendations_json = json.dumps(result.get("recommendations", []), ensure_ascii=False)
    log = AIAnalysisLog(
        trigger_event=trigger_event,
        risk_level=result.get("risk_level", RiskLevel.MEDIUM),
        capacity_utilization=capacity.utilization_percent,
        analysis_text=result.get("analysis", ""),
        recommendations=recommendations_json,
    )
    db.add(log)
    db.commit()

    recommendations = [
        AIRecommendation(**r) for r in result.get("recommendations", [])
    ]

    return AIAnalyzeResponse(
        risk_level=result.get("risk_level", RiskLevel.MEDIUM),
        capacity_utilization=capacity.utilization_percent,
        analysis=result.get("analysis", ""),
        recommendations=recommendations,
        trigger_event=trigger_event,
        timestamp=datetime.now(),
    )


def _collect_factory_state(db: Session, capacity) -> dict:
    from models import Order, OrderStatus, Personnel, StockRaw

    active_orders = db.query(Order).filter(
        Order.status.in_([OrderStatus.PENDING, OrderStatus.IN_PRODUCTION])
    ).all()

    low_margin_count = sum(1 for o in active_orders if o.margin_percent < 10)
    avg_margin = (
        sum(o.margin_percent for o in active_orders) / len(active_orders)
        if active_orders else 0
    )

    # Personel verisi
    total_personnel = db.query(Personnel).filter(Personnel.is_active == True).count()
    avg_performance = db.query(Personnel).filter(Personnel.is_active == True).all()
    avg_perf_score = (
        sum(p.performans_puani for p in avg_performance if p.performans_puani) / len(avg_performance)
        if avg_performance else 0
    )
    # devamsizlik_gun / yillik_izin_hakki ile oran hesapla
    avg_absenteeism = (
        sum(
            (p.devamsizlik_gun / p.yillik_izin_hakki if p.yillik_izin_hakki else 0)
            for p in avg_performance
        ) / len(avg_performance)
        if avg_performance else 0
    )

    # Stok verisi
    all_stock = db.query(StockRaw).all()
    critical_stock = [s for s in all_stock if s.is_critical]
    critical_stock_names = [s.material_name for s in critical_stock]

    return {
        "capacity": {
            "utilization_percent": capacity.utilization_percent,
            "risk_level": capacity.risk_level,
            "active_order_count": capacity.active_order_count,
            "available_days": capacity.available_days,
        },
        "orders": {
            "total_active": len(active_orders),
            "low_margin_count": low_margin_count,
            "average_margin_percent": round(avg_margin, 2),
        },
        "personnel": {
            "total_active": total_personnel,
            "average_performance_score": round(avg_perf_score, 1),
            "average_absenteeism_rate": round(avg_absenteeism * 100, 2),
        },
        "stock": {
            "total_materials": len(all_stock),
            "critical_stock_count": len(critical_stock),
            "critical_materials": critical_stock_names,
        },
    }


def _parse_llm_response(raw: str) -> dict:
    try:
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            cleaned = "\n".join(lines[1:-1])
        result = json.loads(cleaned)

        # Action değerlerini normalize et
        for rec in result.get("recommendations", []):
            if "action" in rec:
                rec["action"] = (
                    rec["action"]
                    .strip()
                    .lower()
                    .replace(" ", "_")
                )

        return result
    except json.JSONDecodeError:
        return {
            "risk_level": RiskLevel.MEDIUM,
            "analysis": raw[:500],
            "recommendations": [],
        }