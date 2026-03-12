import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Dataset
data = {

"perish_days":[
7,7,30,30,20,20,5,5,
10,10,14,14,6,6,8,8,
12,12,25,25,3,3,4,4,
15,15,18,18,9,9,
7,7,30,30,20,20,5,5,
10,10,14,14,6,6,8,8
],

"delay_days":[
1,4,2,8,3,10,2,5,
2,7,3,9,2,6,3,7,
4,9,3,12,1,4,2,5,
5,10,4,11,3,8,
2,6,3,9,4,12,3,7,
2,6,3,8,2,5,3,7
],

"risk":[
"Low","High","Low","Medium","Low","High","Medium","High",
"Low","High","Low","Medium","Low","Medium","Low","High",
"Low","High","Low","High","Low","Medium","Low","Medium",
"Low","High","Low","High","Medium","High",
"Low","Medium","Low","High","Medium","High","Medium","High",
"Low","Medium","Low","High","Low","Medium","Low","High"
]

}

df = pd.DataFrame(data)

X = df[["perish_days","delay_days"]]
y = df["risk"]

encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

model = RandomForestClassifier()
model.fit(X, y_encoded)

joblib.dump(model,"model.pkl")
joblib.dump(encoder,"encoder.pkl")

print("Model created successfully")