const itemsContainer = document.getElementById("cart-items");
const summaryContainer = document.getElementById("cart-summary");

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}

function renderCart() {
  const cart = getCart();

  if (!cart.length) {
    itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    summaryContainer.innerHTML = "";
    return;
  }

  itemsContainer.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" />
        <div class="info">
          <div class="title">${item.title}</div>
          <div class="price">${formatPrice(item.price)} × ${item.qty} = <strong>${formatPrice(
            item.price * (item.qty || 1)
          )}</strong></div>
        </div>
        <div class="actions">
          <button class="dec" data-id="${item.id}">-</button>
          <span class="qty">${item.qty}</span>
          <button class="inc" data-id="${item.id}">+</button>
          <button class="remove" data-id="${item.id}">Remove</button>
        </div>
      </div>`
    )
    .join("");

  // Wire up buttons
  itemsContainer.querySelectorAll(".inc").forEach((btn) =>
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), 1))
  );
  itemsContainer.querySelectorAll(".dec").forEach((btn) =>
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), -1))
  );
  itemsContainer.querySelectorAll(".remove").forEach((btn) =>
    btn.addEventListener("click", () => removeItem(Number(btn.dataset.id)))
  );

  renderSummary();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find((p) => p.id === id);
  if (!item) return;
  item.qty = Math.max(0, (item.qty || 1) + delta);
  const next = item.qty === 0 ? cart.filter((p) => p.id !== id) : cart;
  setCart(next);
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter((p) => p.id !== id);
  setCart(cart);
  renderCart();
}

function renderSummary() {
  const cart = getCart();
  const totalItems = cart.reduce((s, it) => s + (it.qty || 1), 0);
  const totalPrice = cart.reduce((s, it) => s + it.price * (it.qty || 1), 0);

  summaryContainer.innerHTML = `
    <div class="summary-row"><span>Items:</span><span>${totalItems}</span></div>
    <div class="summary-row"><span>Total:</span><span><strong>${formatPrice(totalPrice)}</strong></span></div>
    <div class="summary-actions">
      <button id="buy-now" class="add-btn">Buy Products</button>
      <a href="index.html" class="details-btn">⬅️ Continue Shopping</a>
    </div>
  `;

  const buyBtn = document.getElementById("buy-now");
  if (buyBtn) {
    buyBtn.addEventListener("click", buyNow);
  }
}

renderCart();

function buyNow() {
  const cart = getCart();
  if (!cart.length) return;
  // Simulate purchase and clear cart
  setCart([]);
  alert("Thank you for your purchase! Your cart has been cleared.");
  renderCart();
}
