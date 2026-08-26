/* =================================
   CHECKOUT PAGE
================================= */

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutShipping =
    document.getElementById("checkoutShipping");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const placeOrderBtn =
    document.getElementById("placeOrderBtn");

const checkoutCartCount =
    document.getElementById("cartCount");


// =================================
// GET CART
// =================================

const checkoutCart =
    JSON.parse(
        localStorage.getItem("shopSphereCart")
    ) || [];


// =================================
// CART COUNT
// =================================

function updateCheckoutCartCount() {

    if (!checkoutCartCount) {
        return;
    }

    const totalQuantity =
        checkoutCart.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );

    checkoutCartCount.textContent =
        totalQuantity;
}


// =================================
// DISPLAY CHECKOUT ITEMS
// =================================

function displayCheckoutItems() {

    if (!checkoutItems) {
        return;
    }

    checkoutItems.innerHTML = "";


    // Empty cart
    if (checkoutCart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="no-checkout-items">
                <p>Your cart is empty.</p>
            </div>
        `;

        checkoutSubtotal.textContent =
            "₹0";

        checkoutShipping.textContent =
            "₹0";

        checkoutTotal.textContent =
            "₹0";

        return;
    }


    // Display products
    checkoutCart.forEach(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        const itemElement =
            document.createElement("div");

        itemElement.className =
            "checkout-item";


        itemElement.innerHTML = `

            <div>

                <div class="checkout-item-name">
                    ${item.name}
                </div>

                <div class="checkout-item-quantity">
                    Quantity: ${item.quantity}
                </div>

            </div>

            <div class="checkout-item-price">
                ₹${itemTotal.toLocaleString("en-IN")}
            </div>

        `;


        checkoutItems.appendChild(
            itemElement
        );

    });


    calculateCheckoutTotals();

}


// =================================
// CALCULATE TOTALS
// =================================

function calculateCheckoutTotals() {

    let subtotal = 0;


    checkoutCart.forEach(item => {

        subtotal +=
            Number(item.price) *
            Number(item.quantity);

    });


    // Same shipping rule as cart page
    const shipping =
        subtotal >= 3000
            ? 0
            : 100;


    const total =
        subtotal + shipping;


    checkoutSubtotal.textContent =
        `₹${subtotal.toLocaleString("en-IN")}`;


    checkoutShipping.textContent =
        shipping === 0
            ? "FREE"
            : `₹${shipping}`;


    checkoutTotal.textContent =
        `₹${total.toLocaleString("en-IN")}`;

}


// =================================
// PLACE ORDER
// =================================

if (placeOrderBtn) {

    placeOrderBtn.addEventListener(
        "click",
        async function () {


            // =================================
            // CUSTOMER DETAILS
            // =================================

            const fullName =
                document.getElementById("fullName")
                    .value.trim();


            const email =
                document.getElementById("email")
                    .value.trim();


            const phone =
                document.getElementById("phone")
                    .value.trim();


            const address =
                document.getElementById("address")
                    .value.trim();


            const city =
                document.getElementById("city")
                    .value.trim();


            const pincode =
                document.getElementById("pincode")
                    .value.trim();


            // =================================
            // CHECK CART
            // =================================

            if (checkoutCart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            // =================================
            // CHECK CUSTOMER DETAILS
            // =================================

            if (
                !fullName ||
                !email ||
                !phone ||
                !address ||
                !city ||
                !pincode
            ) {

                alert(
                    "Please fill in all required details."
                );

                return;
            }


            // =================================
            // PAYMENT METHOD
            // =================================

            const paymentElement =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            const paymentMethod =
                paymentElement
                    ? paymentElement.value
                    : "cod";


            // =================================
            // CALCULATE TOTALS
            // =================================

            let subtotal = 0;


            checkoutCart.forEach(item => {

                subtotal +=
                    Number(item.price) *
                    Number(item.quantity);

            });


            const shipping =
                subtotal >= 3000
                    ? 0
                    : 100;


            const total =
                subtotal + shipping;


            // =================================
            // PREPARE ORDER DATA
            // =================================

            const orderData = {

                fullName:
                    fullName,

                email:
                    email,

                phone:
                    phone,

                address:
                    address,

                city:
                    city,

                pincode:
                    pincode,

                paymentMethod:
                    paymentMethod,

                subtotal:
                    subtotal,

                shipping:
                    shipping,

                total:
                    total,

                items:
                    checkoutCart

            };


            // =================================
            // DISABLE BUTTON
            // =================================

            placeOrderBtn.disabled =
                true;

            placeOrderBtn.textContent =
                "Placing Order...";


            try {

                // =================================
                // SEND ORDER TO FLASK
                // =================================

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/api/orders",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )
                        }
                    );


                const result =
                    await response.json();


                // =================================
                // CHECK RESPONSE
                // =================================

                if (!response.ok ||
                    !result.success) {

                    throw new Error(
                        result.message ||
                        "Order could not be placed."
                    );

                }


                // =================================
                // SAVE ORDER FOR SUCCESS PAGE
                // =================================

                const localOrderData = {

                    orderId:
                        result.orderId,

                    customerName:
                        fullName,

                    email:
                        email,

                    phone:
                        phone,

                    address:
                        address,

                    city:
                        city,

                    pincode:
                        pincode,

                    paymentMethod:
                        paymentMethod,

                    subtotal:
                        subtotal,

                    shipping:
                        shipping,

                    total:
                        total,

                    date:
                        new Date()
                            .toLocaleDateString(
                                "en-IN"
                            )

                };


                localStorage.setItem(
                    "shopSphereOrder",
                    JSON.stringify(
                        localOrderData
                    )
                );


                // =================================
                // CLEAR CART
                // =================================

                localStorage.removeItem(
                    "shopSphereCart"
                );


                // =================================
                // SUCCESS MESSAGE
                // =================================

                alert(
                    `Order placed successfully! 🎉\n\n` +
                    `Thank you, ${fullName}!\n` +
                    `Order ID: ${result.orderId}\n` +
                    `Payment: ${paymentMethod.toUpperCase()}`
                );


                // =================================
                // OPEN SUCCESS PAGE
                // =================================

                window.location.href =
                    "order-success.html";


            } catch (error) {

                console.error(
                    "Order error:",
                    error
                );


                alert(
                    "Unable to place the order.\n\n" +
                    "Please make sure the Flask server is running and try again."
                );


                // Enable button again
                placeOrderBtn.disabled =
                    false;

                placeOrderBtn.textContent =
                    "Place Order";

            }

        }
    );

}


// =================================
// INITIALIZE
// =================================

updateCheckoutCartCount();

displayCheckoutItems();