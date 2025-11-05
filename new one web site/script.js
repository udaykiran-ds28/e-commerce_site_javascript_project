const apiURL = "https://fakestoreapi.com/products";
const container = document.getElementById("product-container");
const cartCountElem = document.getElementById("cart-count");
const searchInput = document.getElementById("searchBar");
const categoryFilter = document.getElementById("categoryFilter");

let products = [];

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCountElem.textContent = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
}

async function loadProducts() {
    try {
        const res = await fetch(apiURL);
        products = await res.json();
        renderCategoryOptions();
        renderProducts(products);
    } catch {
        container.innerHTML = '<p style="color:red">Failed to load products.</p>';
    }
}

function renderCategoryOptions() {
    const cats = Array.from(new Set(products.map(p => p.category)));
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        cats.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function renderProducts(productsToShow) {
    container.innerHTML = "";
    productsToShow.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="title">${product.title}</div>
            <div class="desc">${product.description.slice(0, 70)}...</div>
            <div class="meta">Category: ${product.category}</div>
            <div class="price">$${product.price.toFixed(2)}</div>
            <div class="actions">
                <button class="add-btn">Add to Cart</button>
                <button class="details-btn">View Product</button>
            </div>
        `;
        card.querySelector(".add-btn").addEventListener("click", () => addToCart(product));
        card.querySelector(".details-btn").addEventListener("click", () => viewProduct(product));
        container.appendChild(card);
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({...product, qty: 1});
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${product.title} added to cart!`);
}

function viewProduct(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
}

// Filtering logic
searchInput.addEventListener("input", () => {
    filterAndDisplay();
});
categoryFilter.addEventListener("change", () => {
    filterAndDisplay();
});

function filterAndDisplay() {
    const searchValue = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    let filtered = products.filter(
        p => (!categoryValue || p.category === categoryValue) &&
             (p.title.toLowerCase().includes(searchValue) || p.description.toLowerCase().includes(searchValue))
    );
    renderProducts(filtered);
}

updateCartCount();
loadProducts();
