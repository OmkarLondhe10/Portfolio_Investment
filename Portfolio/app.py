from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load pre-trained models
risk_classifier = joblib.load('risk_classifier.pkl')
portfolio_regressor = joblib.load('portfolio_regressor.pkl')

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/index.html')
def index():
    return render_template('index.html')


@app.route('/login.html')
def login():
    return render_template('login.html')

@app.route('/signup.html')
def signup():
    return render_template('signup.html')

@app.route('/portfolio.html')
def portfolio():
    return render_template('portfolio.html')


@app.route('/investment.html')
def investment():
    return render_template('investment.html')


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    age = data['age']
    savings = data['savings']
    years = data['years']

    # Prepare input for models
    features = np.array([[age, savings, years]])

    # Predict Risk Profile (Classification)
    risk_prediction = risk_classifier.predict(features)

    # Predict Portfolio Value (Regression)
    portfolio_value = portfolio_regressor.predict(features)

    # Generate the table and chart data
    # Example fixed investment types for this simple demonstration:
    investments = {
        'equity': 0.3,
        'realEstate': 0.1,
        'gold': 0.05,
        'debt': 0.1,
        'fd': 0.15,
        'stockMarket': 0.2,
        'sip': 0.1
    }
    
    # Calculate values for table and chart
    table_data = []
    total_return = 0
    allocation_data = []
    returns_data = []

    for investment_type, allocation in investments.items():
        investment = savings * allocation
        estimated_return = investment * (1 + 0.12)**years  # Assuming 12% returns for simplicity
        total_return += estimated_return
        
        table_data.append({
            'type': investment_type,
            'allocation': allocation * 100,
            'investment': round(investment, 2),
            'estimated_return': round(estimated_return, 2),
            'avg_return': 12  # Fixed 12% return
        })

        allocation_data.append(investment)
        returns_data.append(estimated_return)

    final_amount = round(savings + total_return, 2)

    # Return data as JSON
    return jsonify({
        'risk': risk_prediction[0],
        'portfolio_value': portfolio_value[0],
        'table_data': table_data,
        'allocation_data': allocation_data,
        'returns_data': returns_data,
        'final_amount': final_amount,
        'total_return': total_return
    })

if __name__ == '__main__':
    app.run(debug=True)
