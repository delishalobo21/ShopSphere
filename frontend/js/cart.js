// =========================
// SHOPSPHERE CART
// =========================

// Get existing cart from localStorage
let cart = JSON.parse(
    localStorage.getItem("shopSphereCart")
) || [];


// =========================
// SAVE CART
// =========================

function saveCart() {

    localStorage.setItem(
        "shopSphereCart",
        JSON.stringify(cart)
    );

}


// =========================
// DISPLAY CART
// =========================

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartSubtotal =
        document.getElementById("cartSubtotal");

    const cartShipping =
        document.getElementById("cartShipping");

    const cartTotal =
        document.getElementById("cartTotal");


    // This page is Product Details,
    // so cartItems won't exist.
    if (!cartItems) {
        return;
    }


    // Empty cart
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <h3>Your cart is empty</h3>

                <p>
                    Add some products to your cart
                    and they will appear here.
                </p>

                <a
                    href="products.html"
                    class="checkout-btn"
                >
                    Explore Products
                </a>

            </div>
        `;

        cartSubtotal.textContent = "₹0";
        cartShipping.textContent = "₹0";
        cartTotal.textContent = "₹0";

        return;
    }


    // Clear cart
    cartItems.innerHTML = "";


    let subtotal = 0;


    // Display every product
    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        subtotal += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">
                ${item.image}
            </div>

            <div class="cart-item-info">

                <div class="cart-item-category">
                    ${item.category}
                </div>

                <h3>
                    ${item.name}
                </h3>

                <div class="cart-item-price">
                    ₹${item.price.toLocaleString("en-IN")}
                </div>

                <div class="cart-item-quantity">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>

            </div>

            <div>

                <strong>
                    ₹${itemTotal.toLocaleString("en-IN")}
                </strong>

                <br><br>

                <button
                    class="remove-cart-item"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>
        `;


        cartItems.appendChild(cartItem);

    });


    // Shipping
    const shipping =
        subtotal >= 3000 ? 0 : 100;


    const total =
        subtotal + shipping;


    cartSubtotal.textContent =
        `₹${subtotal.toLocaleString("en-IN")}`;

    cartShipping.textContent =
        shipping === 0
            ? "FREE"
            : `₹${shipping}`;

    cartTotal.textContent =
        `₹${total.toLocaleString("en-IN")}`;

}


// =========================
// INCREASE QUANTITY
// =========================

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();

displayCart();

updateCartCount();

}


// =========================
// DECREASE QUANTITY
// =========================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

        saveCart();

displayCart();

updateCartCount();

    }

}


// =========================
// REMOVE PRODUCT
// =========================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

displayCart();

updateCartCount();

}


// =========================
// ADD TO CART
// =========================

// =========================
// ADD TO CART
// =========================

const addCartBtn =
    document.getElementById("addCartBtn");


if (addCartBtn) {

    addCartBtn.addEventListener("click", function () {

        const quantityInput =
            document.getElementById("quantity");

        let quantity =
            parseInt(quantityInput.value) || 1;


        // Get product details from page
        const name =
            document.querySelector(".details-info h1")
                .textContent
                .trim();

        const category =
            document.querySelector(".details-category")
                .textContent
                .trim();

        const priceText =
            document.querySelector(".details-price")
                .textContent
                .trim();

        const price =
            Number(
                priceText.replace(/[₹,]/g, "")
            );


        // Get product image
        const image =
            document.querySelector(".details-image-box")
                .textContent
                .trim();


        // Create product
        const product = {

            name: name,

            category: category,

            price: price,

            image: image,

            quantity: quantity

        };


        // Check if product already exists
        const existingProduct =
            cart.find(
                item =>
                    item.name === product.name
            );


        if (existingProduct) {

            existingProduct.quantity += quantity;

        } else {

            cart.push(product);

        }


        // Save cart
        saveCart();

updateCartCount();

alert(
    `${name} added to cart!`
);

    });

}

// =========================
// LOAD CART
// =========================

displayCart();
// =========================
// CART COUNT
// =========================

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }


    const totalItems =
        cart.reduce(
            (total, item) => total + item.quantity,
            0
        );


    cartCount.textContent = totalItems;

}


// Update count when page loads
updateCartCount();