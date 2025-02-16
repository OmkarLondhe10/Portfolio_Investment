from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize Database
def init_db():
    with sqlite3.connect("portfolios.db") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS portfolios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                allocation TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

init_db()

# 🟢 Save Portfolio
@app.route('/save_portfolio', methods=['POST'])
def save_portfolio():
    data = request.json
    name = data.get('name')
    allocation = data.get('allocation')

    if not name or not allocation:
        return jsonify({"error": "Missing data"}), 400

    with sqlite3.connect("portfolios.db") as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO portfolios (name, allocation) VALUES (?, ?)", (name, str(allocation)))
        conn.commit()

    return jsonify({"message": "Portfolio saved successfully!"})

# 🟢 Get All Saved Portfolios
@app.route('/get_saved_portfolios', methods=['GET'])
def get_saved_portfolios():
    with sqlite3.connect("portfolios.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, allocation, created_at FROM portfolios")
        portfolios = [{"id": row[0], "name": row[1], "allocation": eval(row[2]), "created_at": row[3]} for row in cursor.fetchall()]
    
    return jsonify(portfolios)

# 🟢 Compare Portfolios
@app.route('/compare_portfolios', methods=['GET'])
def compare_portfolios():
    ids = request.args.get('ids')
    if not ids:
        return jsonify({"error": "No portfolio IDs provided"}), 400
    
    id_list = ids.split(',')
    
    with sqlite3.connect("portfolios.db") as conn:
        cursor = conn.cursor()
        cursor.execute(f"SELECT id, name, allocation FROM portfolios WHERE id IN ({','.join(['?'] * len(id_list))})", id_list)
        portfolios = [{"id": row[0], "name": row[1], "allocation": eval(row[2])} for row in cursor.fetchall()]
    
    return jsonify(portfolios)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
