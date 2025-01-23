
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from config import DB_CONFIG

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Connect to MySQL
def get_db_connection():
    return mysql.connector.connect(
            host=DB_CONFIG['host'],
        user=DB_CONFIG['user'],
        password=DB_CONFIG['password'],
        database=DB_CONFIG['database'],
        port=DB_CONFIG['port']
    )



@app.route('/add-order', methods=['POST'])
def add_order():
    try:
        # Connect to the database
        connection = get_db_connection()
        if connection is None:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = connection.cursor()

        # Get JSON data from the request
        order_data = request.json

        # Insert order into `orders` table
        query = """
            INSERT INTO orders (order_id, date, partyName, purity, orderType, orderBy, deliveryDate, advanceMetal, totalWt, balance)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            order_data["orderId"],
            order_data["date"],
            order_data["partyName"],
            order_data["purity"],
            order_data["orderType"],
            order_data["orderBy"],
            order_data["deliveryDate"],
            order_data["advanceMetal"],
            order_data["totalWt"],
            order_data["balance"]
        ))

        # Insert items into `order_items` table
        for item in order_data["items"]:
            item_query = """
                INSERT INTO order_items (order_id, serialNumber, itemName, category, purity, size, color, quantity, grossWt, stoneWt, netWt, remark, image)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(item_query, (
                order_data["orderId"],
                item["serialNumber"],
                item["itemName"],
                item["category"],
                item["purity"],
                item["size"],
                item["color"],
                item["quantity"],
                item["grossWt"],
                item["stoneWt"],
                item["netWt"],
                item["remark"],
                item["image"]
            ))

        connection.commit()
        return jsonify({"message": "Order added successfully!"}), 200

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return jsonify({"error": str(err)}), 500

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection:
            connection.close()



# API to fetch orders
@app.route('/orders', methods=['GET'])
def get_orders():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Get all orders
        cursor.execute("SELECT * FROM orders")
        orders = cursor.fetchall()

        return jsonify(orders), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
