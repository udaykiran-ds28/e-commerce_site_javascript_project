const product = JSON.parse(localStorage.getItem("selectedProduct"));
const container = document.getElementById("product-details");
const cartCountElem = document.getElementById("cart-count");

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  cartCountElem.textContent = count;
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

if (product) {
  container.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
    <button class="add-btn">Add to Cart</button>
    <a href="index.html" class="details-btn">⬅️ Back to Store</a>
  `;

  document.querySelector(".add-btn").addEventListener("click", () => addToCart(product));
} else {
  container.innerHTML = "<p>Product not found.</p>";
}

updateCartCount();
