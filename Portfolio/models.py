import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
import joblib

# Example dataset (you can replace this with actual data)
data = {
    "age": [25, 30, 35, 40, 45],
    "savings": [10000, 20000, 30000, 40000, 50000],
    "years": [10, 15, 10, 20, 5],
    "risk": ['Medium', 'High', 'Low', 'Medium', 'Low'],
    "portfolio_value": [20000, 35000, 50000, 70000, 60000]
}

df = pd.DataFrame(data)

# 1. Classification: Risk Prediction
X_class = df[["age", "savings", "years"]]
y_class = df["risk"]

classifier = RandomForestClassifier()
classifier.fit(X_class, y_class)

# 2. Regression: Portfolio Value Prediction
X_reg = df[["age", "savings", "years"]]
y_reg = df["portfolio_value"]

regressor = LinearRegression()
regressor.fit(X_reg, y_reg)

# Save models
joblib.dump(classifier, 'risk_classifier.pkl')
joblib.dump(regressor, 'portfolio_regressor.pkl')

print("Models have been saved successfully.")
