from datetime import datetime, timedelta
import joblib

# Load models
delay_model = joblib.load("delay_model.pkl")
perish_model = joblib.load("perish_model.pkl")
risk_model = joblib.load("risk_model.pkl")
encoders = joblib.load("encoders.pkl")

def ai_agent_predict(from_state, from_district, to_state, to_district, harvest_date, vegetable):

    # Distance logic → input feature
    if from_state != to_state:
        distance = "long"
    elif from_district != to_district:
        distance = "medium"
    else:
        distance = "short"

    # Encode inputs
    X = [[
        encoders["from_state"].transform([from_state])[0],
        encoders["to_state"].transform([to_state])[0],
        encoders["distance"].transform([distance])[0],
        encoders["vegetable"].transform([vegetable])[0]
    ]]

    # ML predictions
    delay_days = int(delay_model.predict(X)[0])
    perish_days = int(perish_model.predict(X)[0])
    risk = risk_model.predict(X)[0]

    harvest = datetime.strptime(harvest_date, "%Y-%m-%d")

    return {
        "vegetable": vegetable,
        "transport_type": distance.capitalize() + " Distance",
        "delay_days": delay_days,
        "perish_days": perish_days,
        "perish_date": (harvest + timedelta(days=perish_days)).strftime("%Y-%m-%d"),
        "delay_date": (harvest + timedelta(days=delay_days)).strftime("%Y-%m-%d"),
        "risk": risk
    }
