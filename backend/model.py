from datetime import datetime, timedelta
import random

VEGETABLE_PERISH_DAYS = {
    "Tomato": 7,
    "Potato": 20,
    "Onion": 30,
    "Carrot": 14,
    "Cabbage": 10,
    "Cauliflower": 7,
    "Spinach": 3,
    "Brinjal": 6,
    "Okra": 5
}

def ai_agent_predict(from_state, from_district, to_state, to_district, harvest_date, vegetable):

    # 1️⃣ Base perish days from vegetable
    perish_days = VEGETABLE_PERISH_DAYS.get(vegetable, 7)  # default = 7

    # 2️⃣ Distance-based delay logic
    if from_state == to_state and from_district == to_district:
        transport = "Short Distance"
        delay_days = 0

    elif from_state == to_state:
        transport = "Medium Distance"
        delay_days = random.randint(1, 2)

    else:
        transport = "Long Distance"
        delay_days = random.randint(0, 2)

    # 3️⃣ Risk calculation
    if delay_days == 0:
        risk = "Low"
    elif delay_days <= perish_days * 0.3:
        risk = "Medium"
    else:
        risk = "High"

    harvest = datetime.strptime(harvest_date, "%Y-%m-%d")

    return {
        "vegetable": vegetable,
        "transport_type": transport,
        "delay_days": delay_days,
        "perish_days": perish_days,
        "harvest_date": harvest_date,
        "delay_date": (harvest + timedelta(days=delay_days)).strftime("%Y-%m-%d"),
        "perish_date": (harvest + timedelta(days=perish_days)).strftime("%Y-%m-%d"),
        "risk": risk
    }
