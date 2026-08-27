/* =================================
   SHOPSPHERE ADMIN DASHBOARD
================================= */


const ordersTableBody =
    document.getElementById("ordersTableBody");

const totalOrders =
    document.getElementById("totalOrders");

const totalRevenue =
    document.getElementById("totalRevenue");

const pendingOrders =
    document.getElementById("pendingOrders");

const totalCustomers =
    document.getElementById("totalCustomers");

const refreshOrdersBtn =
    document.getElementById("refreshOrdersBtn");


// =================================
// LOAD ORDERS
// =================================

async function loadOrders() {

    if (!ordersTableBody) {
        return;
    }


    ordersTableBody.innerHTML = `
        <tr>
            <td
                colspan="8"
                class="loading-orders"
            >
                Loading orders...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                "https://shopsphere-nmcj.onrender.com/api/orders"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load orders."
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.orders)
        ) {

            throw new Error(
                "Invalid order data."
            );

        }


        const orders =
            data.orders;


        // =================================
        // UPDATE STATISTICS
        // =================================

        updateStatistics(orders);


        // =================================
        // DISPLAY ORDERS
        // =================================

        displayOrders(orders);


    } catch (error) {

        console.error(
            "Admin orders error:",
            error
        );


        ordersTableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="orders-error"
                >
                    Unable to load orders.
                    <br>
                    Make sure the Flask server is running.
                </td>
            </tr>
        `;

    }

}


// =================================
// UPDATE STATISTICS
// =================================

function updateStatistics(orders) {

    // Total orders
    totalOrders.textContent =
        orders.length;


    // Total revenue
    const revenue =
        orders.reduce(
            (total, order) =>
                total +
                Number(order.total || 0),
            0
        );


    totalRevenue.textContent =
        `₹${revenue.toLocaleString("en-IN")}`;


    // Pending orders
    const pendingCount =
        orders.filter(
            order =>
                (order.status || "Pending") ===
                "Pending"
        ).length;


    pendingOrders.textContent =
        pendingCount;


    // Unique customers
    const customers =
        new Set(
            orders.map(
                order =>
                    order.email
            )
        );


    totalCustomers.textContent =
        customers.size;

}


// =================================
// DISPLAY ORDERS
// =================================

function displayOrders(orders) {

    // Empty orders
    if (orders.length === 0) {

        ordersTableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="no-orders"
                >
                    No orders found.
                </td>
            </tr>
        `;

        return;
    }


    ordersTableBody.innerHTML = "";


    orders.forEach(order => {

        const row =
            document.createElement("tr");


        const orderDate =
            formatDate(
                order.order_date
            );


        // Default status
        const status =
            order.status || "Pending";


        row.innerHTML = `

            <td>
                #${order.id}
            </td>


            <td>
                ${escapeHTML(
                    order.full_name
                )}
            </td>


            <td>
                ${escapeHTML(
                    order.email
                )}
            </td>


            <td>
                ₹${Number(
                    order.total || 0
                ).toLocaleString("en-IN")}
            </td>


            <td>
                ${escapeHTML(
                    order.payment_method
                )}
            </td>


            <td>
                ${orderDate}
            </td>


            <td>

                <select
                    class="order-status-select"
                    onchange="updateOrderStatus(
                        ${order.id},
                        this.value
                    )"
                >

                    <option
                        value="Pending"
                        ${status === "Pending"
                            ? "selected"
                            : ""}
                    >
                        Pending
                    </option>


                    <option
                        value="Confirmed"
                        ${status === "Confirmed"
                            ? "selected"
                            : ""}
                    >
                        Confirmed
                    </option>


                    <option
                        value="Shipped"
                        ${status === "Shipped"
                            ? "selected"
                            : ""}
                    >
                        Shipped
                    </option>


                    <option
                        value="Delivered"
                        ${status === "Delivered"
                            ? "selected"
                            : ""}
                    >
                        Delivered
                    </option>

                </select>

            </td>


            <td>

                <button
                    class="view-order-btn"
                    onclick="viewOrder(${order.id})"
                >
                    View
                </button>

            </td>

        `;


        ordersTableBody.appendChild(
            row
        );

    });

}


// =================================
// VIEW ORDER
// =================================

async function viewOrder(orderId) {

    try {

        const response =
            await fetch(
                `https://shopsphere-nmcj.onrender.com/api/orders/${orderId}`
            );


        if (!response.ok) {

            throw new Error(
                "Order not found."
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                "Unable to load order."
            );

        }


        const order =
            data.order;


        // =================================
        // FILL MODAL
        // =================================

        document.getElementById(
            "modalOrderId"
        ).textContent =
            `Order #${order.id}`;


        document.getElementById(
            "modalCustomerName"
        ).textContent =
            order.full_name || "-";


        document.getElementById(
            "modalCustomerEmail"
        ).textContent =
            order.email || "-";


        document.getElementById(
            "modalCustomerPhone"
        ).textContent =
            order.phone || "-";


        document.getElementById(
            "modalAddress"
        ).textContent =
            order.address || "-";


        document.getElementById(
            "modalCity"
        ).textContent =
            order.city || "-";


        document.getElementById(
            "modalPincode"
        ).textContent =
            order.pincode || "-";


        document.getElementById(
            "modalPayment"
        ).textContent =
            order.payment_method || "-";


        document.getElementById(
            "modalSubtotal"
        ).textContent =
            `₹${Number(
                order.subtotal || 0
            ).toLocaleString("en-IN")}`;


        document.getElementById(
            "modalShipping"
        ).textContent =
            Number(order.shipping || 0) === 0
                ? "FREE"
                : `₹${Number(
                    order.shipping || 0
                ).toLocaleString("en-IN")}`;


        document.getElementById(
            "modalTotal"
        ).textContent =
            `₹${Number(
                order.total || 0
            ).toLocaleString("en-IN")}`;


        // =================================
        // OPEN MODAL
        // =================================

        const orderModal =
            document.getElementById(
                "orderModal"
            );


        if (orderModal) {

            orderModal.classList.add(
                "active"
            );

        }


    } catch (error) {

        console.error(
            "View order error:",
            error
        );


        alert(
            "Unable to load order details."
        );

    }

}


// =================================
// FORMAT DATE
// =================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return dateValue;
    }


    return date.toLocaleDateString(
        "en-IN"
    );

}


// =================================
// ESCAPE HTML
// =================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =================================
// UPDATE ORDER STATUS
// =================================

async function updateOrderStatus(
    orderId,
    newStatus
) {

    try {

        const response =
            await fetch(
                `https://shopsphere-nmcj.onrender.com/api/orders/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to update status."
            );

        }


        alert(
            `Order #${orderId} status updated to ${newStatus}.`
        );


        // Reload orders
        loadOrders();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            "Unable to update order status."
        );


        // Reload to restore previous value
        loadOrders();

    }

}


// =================================
// REFRESH
// =================================

if (refreshOrdersBtn) {

    refreshOrdersBtn.addEventListener(
        "click",
        loadOrders
    );

}


// =================================
// ORDER MODAL CONTROLS
// =================================

const orderModal =
    document.getElementById(
        "orderModal"
    );


const closeOrderModal =
    document.getElementById(
        "closeOrderModal"
    );


const closeOrderModalBottom =
    document.getElementById(
        "closeOrderModalBottom"
    );


// Close using X button

if (closeOrderModal) {

    closeOrderModal.addEventListener(
        "click",
        function () {

            if (orderModal) {

                orderModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// Close using bottom button

if (closeOrderModalBottom) {

    closeOrderModalBottom.addEventListener(
        "click",
        function () {

            if (orderModal) {

                orderModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// Close when clicking outside modal

if (orderModal) {

    orderModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                orderModal
            ) {

                orderModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =================================
// INITIALIZE
// =================================

loadOrders();