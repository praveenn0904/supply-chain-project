from flask import Flask, request, jsonify
from flask_cors import CORS
from model import ai_agent_predict
from blockchain import store_on_blockchain

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    result = ai_agent_predict(
        data["from_state"],
        data["from_district"],
        data["to_state"],
        data["to_district"],
        data["harvest_date"],
        data["vegetable"]
    )

    store_on_blockchain({**data, **result})
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
