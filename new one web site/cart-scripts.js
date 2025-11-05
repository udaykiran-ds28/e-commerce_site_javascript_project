const cartItemsElem = document.getElementById("cart-items");
const cartSummaryElem = document.getElementById("cart-summary");

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    cartItemsElem.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
        cartItemsElem.innerHTML = "<p>Your cart is empty.</p>";
        cartSummaryElem.innerHTML = "";
        return;
    }
    cart.forEach((item, idx) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width:80px;height:80px;">
            <div>
                <h4>${item.title}</h4>
                <p>Category: ${item.category}</p>
                <p>Unit Price: $${item.price.toFixed(2)}</p>
                <label>Qty: 
                    <input type="number" class="qty-input" min="1" value="${item.qty}" data-idx="${idx}">
                </label>
                <button class="remove-btn" data-idx="${idx}">Remove</button>
            </div>
            <div class="item-total"><b>$${itemTotal.toFixed(2)}</b></div>
        `;
        cartItemsElem.appendChild(div);
    });

    cartSummaryElem.innerHTML = `
        <h3>Cart Total: $${total.toFixed(2)}</h3>
        <button class="checkout-btn">Checkout (Demo)</button>
    `;

    cartItemsElem.querySelectorAll(".qty-input").forEach(input => {
        input.addEventListener("change", () => {
            const idx = parseInt(input.dataset.idx);
            let cart = getCart();
            let val = parseInt(input.value);
            if (val < 1) val = 1;
            cart[idx].qty = val;
            saveCart(cart);
            renderCart();
        });
    });

    cartItemsElem.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.idx);
            let cart = getCart();
            cart.splice(idx, 1);
            saveCart(cart);
            renderCart();
        });
    });

    cartSummaryElem.querySelector(".checkout-btn").addEventListener("click", () => {
        alert("Order placed! Demo checkout complete.");
        localStorage.removeItem("cart");
        renderCart();
    });
}

renderCart();
