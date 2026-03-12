import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
import joblib
import os

# =========================
# ABSOLUTE PATH (VS CODE SAFE)
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "train_data.csv")

# 🔴 HARD CHECK (THIS WILL TELL US THE TRUTH)
if not os.path.exists(csv_path):
    raise FileNotFoundError(f"❌ train_data.csv NOT FOUND at {csv_path}")

print("✅ Found train_data.csv at:", csv_path)

# =========================
# LOAD DATA
# =========================
df = pd.read_csv(csv_path)

# =========================
# ENCODE FEATURES
# =========================
encoders = {}
for col in ["from_state", "to_state", "distance", "vegetable"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

X = df[["from_state", "to_state", "distance", "vegetable"]]

# =========================
# ENCODE TARGET
# =========================
risk_encoder = LabelEncoder()
df["risk_encoded"] = risk_encoder.fit_transform(df["risk"])

# =========================
# TRAIN MODELS
# =========================
delay_model = RandomForestRegressor(random_state=42)
perish_model = RandomForestRegressor(random_state=42)
risk_model = RandomForestClassifier(random_state=42)

delay_model.fit(X, df["delay_days"])
perish_model.fit(X, df["perish_days"])
risk_model.fit(X, df["risk_encoded"])

# =========================
# SAVE MODELS
# =========================
joblib.dump(delay_model, os.path.join(BASE_DIR, "delay_model.pkl"))
joblib.dump(perish_model, os.path.join(BASE_DIR, "perish_model.pkl"))
joblib.dump(risk_model, os.path.join(BASE_DIR, "risk_model.pkl"))
joblib.dump(encoders, os.path.join(BASE_DIR, "encoders.pkl"))
joblib.dump(risk_encoder, os.path.join(BASE_DIR, "risk_encoder.pkl"))

print("✅ ML models trained and saved successfully")
