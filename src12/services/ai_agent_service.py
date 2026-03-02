import openai

def run_risk_analysis(factory_state):

    prompt = f"""
    Sen bir üretim planlama asistanısın.

    Fabrika durumu:
    - Aylık kapasite: {factory_state['monthly_capacity']}
    - Açık sipariş: {factory_state['open_orders']}
    - Kapasite doluluk: %{factory_state['utilization']}

    Risk analizi yap ve kısa öneri üret.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content