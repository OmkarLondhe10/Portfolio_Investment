from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load pre-trained models
risk_classifier = joblib.load('risk_classifier.pkl')
portfolio_regressor = joblib.load('portfolio_regressor.pkl')

# Store portfolio comparisons
saved_portfolios = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/portfolio.html')
def portfolio():
    return render_template('portfolio.html')

@app.route('/compare.html')
def compare():
    return render_template('compare.html')


def get_dynamic_allocation(age, savings):
    """ Reduce equity & debt, increase other assets dynamically """
    if age < 35:
        investment_types = {
            'equity': {'allocation': 0.15, 'return_rate': 0.16},
            'realEstate': {'allocation': 0.20, 'return_rate': 0.09},
            'gold': {'allocation': 0.10, 'return_rate': 0.05},
            'debt': {'allocation': 0.08, 'return_rate': 0.06},
            'fd': {'allocation': 0.18, 'return_rate': 0.05},
            'stockMarket': {'allocation': 0.15, 'return_rate': 0.13},
            'sip': {'allocation': 0.14, 'return_rate': 0.11}
        }
    else:
        investment_types = {
            'equity': {'allocation': 0.10, 'return_rate': 0.14},
            'realEstate': {'allocation': 0.25, 'return_rate': 0.08},
            'gold': {'allocation': 0.12, 'return_rate': 0.06},
            'debt': {'allocation': 0.08, 'return_rate': 0.07},
            'fd': {'allocation': 0.20, 'return_rate': 0.05},
            'stockMarket': {'allocation': 0.12, 'return_rate': 0.10},
            'sip': {'allocation': 0.13, 'return_rate': 0.09}
        }
    return investment_types

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    age, savings, years = data['age'], data['savings'], data['years']
    
    features = np.array([[age, savings, years]])
    risk_prediction = risk_classifier.predict(features)
    portfolio_value = portfolio_regressor.predict(features)

    investment_types = get_dynamic_allocation(age, savings)
    
    table_data, total_return, allocation_data, returns_data = [], 0, [], []
    
    for investment_type, data in investment_types.items():
        allocation = data['allocation']
        return_rate = data['return_rate']
        investment = savings * allocation
        estimated_return = investment * ((1 + return_rate) ** years)
        total_return += estimated_return - investment

        table_data.append({
            'type': investment_type,
            'allocation': allocation * 100,
            'investment': round(investment, 2),
            'estimated_return': round(estimated_return, 2),
            'avg_return': round(return_rate * 100, 2)
        })

        allocation_data.append(investment)
        returns_data.append(estimated_return)

    final_amount = round(savings + total_return, 2)
    
    return jsonify({
        'risk': risk_prediction[0],
        'portfolio_value': round(portfolio_value[0], 2),
        'table_data': table_data,
        'allocation_data': allocation_data,
        'returns_data': returns_data,
        'final_amount': final_amount,
        'total_return': round(total_return, 2)
    })

@app.route('/save_portfolio', methods=['POST'])
def save_portfolio():
    data = request.get_json()
    saved_portfolios.append(data)
    return jsonify({'message': 'Portfolio saved successfully!'})

@app.route('/compare_portfolios', methods=['GET'])
def compare_portfolios():
    return jsonify(saved_portfolios)

if __name__ == '__main__':
    app.run(debug=True)
