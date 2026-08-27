// =================================
// PRODUCT DETAILS
// =================================

const detailsImage =
    document.getElementById("detailsImage");

const detailsCategory =
    document.getElementById("detailsCategory");

const detailsName =
    document.getElementById("detailsName");

const detailsRating =
    document.getElementById("detailsRating");

const detailsPrice =
    document.getElementById("detailsPrice");

const detailsDescription =
    document.getElementById("detailsDescription");


// =================================
// QUANTITY ELEMENTS
// =================================

const quantityInput =
    document.getElementById("quantity");

const decreaseBtn =
    document.getElementById("decreaseBtn");

const increaseBtn =
    document.getElementById("increaseBtn");

const addCartBtn =
    document.getElementById("addCartBtn");


// =================================
// GET PRODUCT ID FROM URL
// =================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const productId =
    urlParams.get("id");


// =================================
// CURRENT PRODUCT
// =================================

let currentProduct = null;


// =================================
// LOAD PRODUCT FROM FLASK API
// =================================

async function loadProduct() {

    // Check product ID
    if (!productId) {

        showProductError(
            "Product ID is missing."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `https://shopsphere-nmcj.onrender.com/api/products/${productId}`
            );


        // Check API response
        if (!response.ok) {

            throw new Error(
                "Product not found"
            );

        }


        const product =
            await response.json();


        // Save current product
        currentProduct =
            product;


        window.currentProduct =
            product;


        // =================================
        // DISPLAY PRODUCT IMAGE
        // =================================

        if (detailsImage) {

            detailsImage.textContent =
                product.image || "🛍️";

        }


        // =================================
        // DISPLAY CATEGORY
        // =================================

        if (detailsCategory) {

            detailsCategory.textContent =
                product.category || "";

        }


        // =================================
        // DISPLAY NAME
        // =================================

        if (detailsName) {

            detailsName.textContent =
                product.name || "";

        }


        // =================================
        // DISPLAY PRICE
        // =================================

        if (detailsPrice) {

            const price =
                Number(product.price) || 0;


            detailsPrice.textContent =
                `₹${price.toLocaleString("en-IN")}`;

        }


        // =================================
        // DISPLAY DESCRIPTION
        // =================================

        if (detailsDescription) {

            detailsDescription.textContent =
                product.description || "";

        }


        // =================================
        // DISPLAY RATING
        // =================================

        if (detailsRating) {

            const rating =
                Number(product.rating) || 0;


            const reviews =
                Number(product.reviews) || 0;


            const fullStars =
                Math.round(rating);


            const stars =
                "⭐".repeat(fullStars);


            detailsRating.innerHTML = `
                ${stars}
                <span>
                    (${reviews} Reviews)
                </span>
            `;

        }


        // =================================
        // RESET QUANTITY
        // =================================

        if (quantityInput) {

            quantityInput.value = 1;

        }


        // =================================
        // UPDATE PAGE TITLE
        // =================================

        document.title =
            `ShopSphere | ${product.name}`;


    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );


        showProductError(
            "Unable to load this product."
        );

    }

}


// =================================
// SHOW PRODUCT ERROR
// =================================

function showProductError(message) {

    if (detailsCategory) {

        detailsCategory.textContent = "";

    }


    if (detailsName) {

        detailsName.textContent =
            "Product Not Found";

    }


    if (detailsPrice) {

        detailsPrice.textContent =
            "";

    }


    if (detailsDescription) {

        detailsDescription.textContent =
            message;

    }


    if (detailsRating) {

        detailsRating.innerHTML =
            "";

    }


    if (detailsImage) {

        detailsImage.textContent =
            "❌";

    }

}


// =================================
// DECREASE QUANTITY
// =================================

if (decreaseBtn) {

    decreaseBtn.addEventListener(
        "click",
        function () {

            let quantity =
                Number(quantityInput.value) || 1;


            if (quantity > 1) {

                quantity--;

            }


            quantityInput.value =
                quantity;

        }
    );

}


// =================================
// INCREASE QUANTITY
// =================================

if (increaseBtn) {

    increaseBtn.addEventListener(
        "click",
        function () {

            let quantity =
                Number(quantityInput.value) || 1;


            quantity++;


            quantityInput.value =
                quantity;

        }
    );

}


// =================================
// VALIDATE MANUAL QUANTITY
// =================================

if (quantityInput) {

    quantityInput.addEventListener(
        "change",
        function () {

            let quantity =
                Number(quantityInput.value);


            if (
                !quantity ||
                quantity < 1
            ) {

                quantity = 1;

            }


            quantityInput.value =
                Math.floor(quantity);

        }
    );

}


// =================================
// ADD TO CART
// =================================

if (addCartBtn) {

    addCartBtn.addEventListener(
        "click",
        function () {

            // Check product
            if (!currentProduct) {

                alert(
                    "Product is still loading. Please try again."
                );

                return;

            }


            // Get quantity
            let quantity =
                Number(quantityInput.value);


            if (
                !quantity ||
                quantity < 1
            ) {

                alert(
                    "Please select a valid quantity."
                );

                return;

            }


            quantity =
                Math.floor(quantity);


            // =================================
            // GET EXISTING CART
            // =================================

            let cart =
                JSON.parse(
                    localStorage.getItem(
                        "shopSphereCart"
                    )
                ) || [];


            // =================================
            // CHECK EXISTING PRODUCT
            // =================================

            const existingProduct =
                cart.find(
                    item =>
                        Number(item.id) ===
                        Number(currentProduct.id)
                );


            if (existingProduct) {

                existingProduct.quantity =
                    Number(existingProduct.quantity) +
                    quantity;

            } else {

                cart.push({

                    id:
                        currentProduct.id,

                    name:
                        currentProduct.name,

                    price:
                        Number(currentProduct.price),

                    image:
                        currentProduct.image,

                    category:
                        currentProduct.category,

                    quantity:
                        quantity

                });

            }


            // =================================
            // SAVE CART
            // =================================

            localStorage.setItem(
                "shopSphereCart",
                JSON.stringify(cart)
            );


            // =================================
            // SUCCESS MESSAGE
            // =================================

            alert(
                `${currentProduct.name} added to cart! 🛒`
            );


            // =================================
            // UPDATE CART COUNT
            // =================================

            if (
                typeof updateCartCount ===
                "function"
            ) {

                updateCartCount();

            }

        }
    );

}


// =================================
// LOAD PRODUCT WHEN PAGE OPENS
// =================================

loadProduct();