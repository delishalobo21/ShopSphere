// ================================
// ORDER SUCCESS PAGE
// ================================

const order =
    JSON.parse(
        localStorage.getItem("shopSphereOrder")
    );


// Check whether an order exists
if (!order) {

    window.location.href =
        "index.html";

}


// Display Order ID
document.getElementById("orderId")
    .textContent =
    order.orderId;


// Display Order Date
document.getElementById("orderDate")
    .textContent =
    order.date;


// Display Total Amount
document.getElementById("orderTotal")
    .textContent =
    order.total;


// Cart is now empty
const cartCount =
    document.getElementById("cartCount");

if (cartCount) {

    cartCount.textContent = "0";

}