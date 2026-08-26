from flask import Flask, jsonify, request
from flask_cors import CORS

from database import get_db_connection


app = Flask(__name__)

CORS(app)


# =================================
# HOME
# =================================

@app.route("/")
def home():

    return {
        "message": "ShopSphere Flask API is running!"
    }


# =================================
# GET ALL PRODUCTS
# =================================

@app.route("/api/products", methods=["GET"])
def get_products():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            name,
            category,
            price,
            description,
            image,
            rating,
            reviews
        FROM products
        ORDER BY id
    """)

    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(products)


# =================================
# GET SINGLE PRODUCT
# =================================

@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            name,
            category,
            price,
            description,
            image,
            rating,
            reviews
        FROM products
        WHERE id = %s
    """, (product_id,))

    product = cursor.fetchone()

    cursor.close()
    connection.close()

    if product is None:

        return jsonify({
            "error": "Product not found"
        }), 404

    return jsonify(product)


# =================================
# CREATE ORDER
# =================================

@app.route("/api/orders", methods=["POST"])
def create_order():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "No order data received."
        }), 400


    # =================================
    # GET CUSTOMER DETAILS
    # =================================

    full_name = data.get("fullName")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")
    city = data.get("city")
    pincode = data.get("pincode")
    payment_method = data.get("paymentMethod")


    # =================================
    # GET TOTALS
    # =================================

    subtotal = float(
        data.get("subtotal", 0)
    )

    shipping = float(
        data.get("shipping", 0)
    )

    total = float(
        data.get("total", 0)
    )


    # =================================
    # GET CART ITEMS
    # =================================

    items = data.get("items", [])


    # =================================
    # VALIDATION
    # =================================

    if not all([
        full_name,
        email,
        phone,
        address,
        city,
        pincode,
        payment_method
    ]):

        return jsonify({
            "success": False,
            "message": "All customer details are required."
        }), 400


    if not items:

        return jsonify({
            "success": False,
            "message": "Order must contain at least one product."
        }), 400


    connection = None
    cursor = None


    try:

        connection = get_db_connection()

        cursor = connection.cursor()


        # =================================
        # INSERT ORDER
        # =================================

        cursor.execute("""
            INSERT INTO orders (
                full_name,
                email,
                phone,
                address,
                city,
                pincode,
                payment_method,
                subtotal,
                shipping,
                total
            )
            VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s
            )
        """, (
            full_name,
            email,
            phone,
            address,
            city,
            pincode,
            payment_method,
            subtotal,
            shipping,
            total
        ))


        # Get generated order ID
        order_id = cursor.lastrowid


        # =================================
        # INSERT ORDER ITEMS
        # =================================

        for item in items:

            product_id = item.get("id")

            product_name = item.get("name")

            quantity = int(
                item.get("quantity", 1)
            )

            price = float(
                item.get("price", 0)
            )


            cursor.execute("""
                INSERT INTO order_items (
                    order_id,
                    product_id,
                    product_name,
                    quantity,
                    price
                )
                VALUES (
                    %s, %s, %s, %s, %s
                )
            """, (
                order_id,
                product_id,
                product_name,
                quantity,
                price
            ))


        # =================================
        # SAVE CHANGES
        # =================================

        connection.commit()


        # =================================
        # RESPONSE
        # =================================

        return jsonify({

            "success": True,

            "message":
                "Order placed successfully.",

            "orderId":
                order_id

        }), 201


    except Exception as error:

        if connection:

            connection.rollback()


        print(
            "Order error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to place order."

        }), 500


    finally:

        if cursor:

            cursor.close()

        if connection:

            connection.close()
# =================================
# GET ALL ORDERS
# =================================
# =================================
# GET ALL ORDERS
# =================================

@app.route("/api/orders", methods=["GET"])
def get_orders():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                full_name,
                email,
                phone,
                address,
                city,
                pincode,
                payment_method,
                subtotal,
                shipping,
                total,
                status,
                order_date
            FROM orders
            ORDER BY order_date DESC
        """)

        orders = cursor.fetchall()

        return jsonify({
            "success": True,
            "orders": orders
        })

    except Exception as error:

        print(
            "Get orders error:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Unable to load orders."
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
        

        
        
# =================================
# GET SINGLE ORDER
# =================================

@app.route("/api/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                full_name,
                email,
                phone,
                address,
                city,
                pincode,
                payment_method,
                subtotal,
                shipping,
                total,
                status,
                order_date
            FROM orders
            WHERE id = %s
        """, (order_id,))

        order = cursor.fetchone()


        if order is None:

            return jsonify({
                "success": False,
                "message": "Order not found."
            }), 404


        return jsonify({
            "success": True,
            "order": order
        })


    except Exception as error:

        print(
            "Get single order error:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Unable to load order."
        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

    # =================================
# UPDATE ORDER STATUS
# =================================

@app.route("/api/orders/<int:order_id>/status", methods=["PUT"])
def update_order_status(order_id):

    connection = None
    cursor = None

    try:

        data = request.get_json()

        new_status = data.get("status")


        # Allowed statuses
        allowed_statuses = [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered"
        ]


        # Validate status
        if new_status not in allowed_statuses:

            return jsonify({
                "success": False,
                "message": "Invalid order status."
            }), 400


        connection = get_db_connection()

        cursor = connection.cursor()


        # Check order exists
        cursor.execute("""
            SELECT id
            FROM orders
            WHERE id = %s
        """, (order_id,))


        order = cursor.fetchone()


        if order is None:

            return jsonify({
                "success": False,
                "message": "Order not found."
            }), 404


        # Update status
        cursor.execute("""
            UPDATE orders
            SET status = %s
            WHERE id = %s
        """, (
            new_status,
            order_id
        ))


        connection.commit()


        return jsonify({
            "success": True,
            "message": "Order status updated successfully.",
            "status": new_status
        })


    except Exception as error:

        if connection:
            connection.rollback()


        print(
            "Update order status error:",
            error
        )


        return jsonify({
            "success": False,
            "message": "Unable to update order status."
        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =================================
# RUN SERVER
# =================================

if __name__ == "__main__":

    app.run(
        debug=True
    )