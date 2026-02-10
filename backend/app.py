from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_agent import ai_agent_predict

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    result = ai_agent_predict(
        from_state=data["from_state"],
        from_district=data["from_district"],
        to_state=data["to_state"],
        to_district=data["to_district"],
        harvest_date=data["harvest_date"],
        vegetable=data["vegetable"]
    )

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
