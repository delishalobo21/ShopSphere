// =================================
// PRODUCTS PAGE
// =================================

const productsGrid =
    document.getElementById("productsGrid");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortProducts =
    document.getElementById("sortProducts");


// Store products loaded from Flask
let products = [];


// =================================
// LOAD PRODUCTS FROM FLASK API
// =================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                "https://shopsphere-nmcj.onrender.com/api/products"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load products"
            );

        }


        const data =
            await response.json();


        // Store API products
        products = data;


        // Display products
        displayProducts(products);


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        productsGrid.innerHTML = `
            <div class="no-products">

                <h3>
                    Unable to load products
                </h3>

                <p>
                    Please make sure the Flask server is running.
                </p>

            </div>
        `;

    }

}


// =================================
// DISPLAY PRODUCTS
// =================================

function displayProducts(productList) {

    productsGrid.innerHTML = "";


    // No products
    if (productList.length === 0) {

        productsGrid.innerHTML = `
            <div class="no-products">

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>
        `;

        return;
    }


    // Create product cards
    productList.forEach(product => {

        const productCard =
            document.createElement("div");


        productCard.className =
            "shop-product-card";


        productCard.innerHTML = `

            <!-- Product Image -->

            <div class="shop-product-image">
                ${product.image}
            </div>


            <!-- Product Information -->

            <div class="shop-product-info">

                <span class="shop-product-category">
                    ${product.category}
                </span>


                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${product.description}
                </p>


                <div class="shop-product-bottom">

                    <strong>
                        ₹${Number(product.price)
                            .toLocaleString("en-IN")}
                    </strong>


                    <a href="product-details.html?id=${product.id}">
                        View
                    </a>

                </div>

            </div>

        `;


        productsGrid.appendChild(
            productCard
        );

    });

}


// =================================
// SEARCH + FILTER + SORT
// =================================

function updateProducts() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value
            .toLowerCase()
            .trim();


    const sortValue =
        sortProducts.value;


    // =================================
    // FILTER PRODUCTS
    // =================================

    let filteredProducts =
        products.filter(product => {

            const name =
                String(product.name)
                    .toLowerCase()
                    .trim();


            const category =
                String(product.category)
                    .toLowerCase()
                    .trim();


            // Search
            const matchesSearch =
                name.includes(searchText);


            // Category
            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    // =================================
    // SORT PRODUCTS
    // =================================


    // Price: Low to High

    if (sortValue === "low") {

        filteredProducts.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    }


    // Price: High to Low

    if (sortValue === "high") {

        filteredProducts.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    }


    // Name: A-Z

    if (sortValue === "name") {

        filteredProducts.sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        );

    }


    // =================================
    // DISPLAY FILTERED PRODUCTS
    // =================================

    displayProducts(
        filteredProducts
    );

}


// =================================
// SEARCH
// =================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        updateProducts
    );

}


// =================================
// CATEGORY FILTER
// =================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        updateProducts
    );

}


// =================================
// SORT
// =================================

if (sortProducts) {

    sortProducts.addEventListener(
        "change",
        updateProducts
    );

}


// =================================
// LOAD PRODUCTS ON PAGE LOAD
// =================================

loadProducts();
