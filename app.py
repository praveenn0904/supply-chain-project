from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)

MODEL_FILE = "model.pkl"
ENCODER_FILE = "encoder.pkl"

# Function to train model if files don't exist
def train_model():
    data = {
        "perish_days":[7,7,30,30,20,20,5,5,10,10,15,15],
        "delay_days":[1,4,2,8,3,10,2,5,4,9,5,12],
        "risk":[
            "Low","High","Low","Medium",
            "Low","High","Medium","High",
            "Low","High","Medium","High"
        ]
    }

    df = pd.read_csv("train_data.csv")

    X = df[["perish_days","delay_days"]]
    y = df["risk"]

    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    model = RandomForestClassifier()
    model.fit(X, y_encoded)

    joblib.dump(model, MODEL_FILE)
    joblib.dump(encoder, ENCODER_FILE)

    return model, encoder


# Load model or train if missing
if os.path.exists(MODEL_FILE) and os.path.exists(ENCODER_FILE):
    model = joblib.load(MODEL_FILE)
    encoder = joblib.load(ENCODER_FILE)
else:
    print("⚠ Model not found. Training new model...")
    model, encoder = train_model()
    print("✅ Model trained and saved")


from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    perish = data["perish_days"]
    delay = data["delay_days"]

    ratio = delay / perish

    if ratio < 0.3:
        risk = "Low"
    elif ratio < 0.6:
        risk = "Medium"
    else:
        risk = "High"

    return jsonify({
        "risk": risk
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)