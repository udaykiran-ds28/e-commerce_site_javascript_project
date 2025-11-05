const apiURL = "https://fakestoreapi.com/products";
const container = document.getElementById("product-container");
const cartCountElem = document.getElementById("cart-count");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-filter");
let allProducts = [];

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  cartCountElem.textContent = count;
}

async function loadProducts() {
  try {
    const res = await fetch(apiURL);
    const products = await res.json();
    allProducts = products;
    applyFilters();
  } catch {
    container.innerHTML = "<p style='color:red'>Failed to load products.</p>";
  }
}

function renderProducts(products) {
  container.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="title">${product.title}</div>
      <div class="desc">${product.description}</div>
      <div class="meta">Category: ${product.category} | ⭐ ${product.rating.rate}</div>
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

function applyFilters() {
  const query = (searchInput?.value || "").toLowerCase().trim();
  const category = categorySelect?.value || "all";
  let filtered = allProducts.slice();
  if (category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }
  renderProducts(filtered);
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((p) => p.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.title} added to cart!`);
}

function viewProduct(product) {
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "product.html";
}

updateCartCount();
loadProducts();

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}
if (categorySelect) {
  categorySelect.addEventListener("change", applyFilters);
}
