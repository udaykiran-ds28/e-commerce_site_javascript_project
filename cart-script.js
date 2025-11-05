const cartContainer = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');

function loadCart(){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  renderCart(cart);
}

function renderCart(cart){
  cartContainer.innerHTML = '';
  if(cart.length === 0){
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartSummary.innerHTML = '';
    return;
  }

  let subtotal = 0;
  cart.forEach((item, idx)=>{
    subtotal += item.price * (item.qty || 1);
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div class="info">
        <div style="font-weight:700">${item.title}</div>
        <div>$${Number(item.price).toFixed(2)} each</div>
      </div>
      <div class="controls">
        <input type="number" min="1" value="${item.qty||1}" data-idx="${idx}" class="qty-input" />
        <button class="remove-btn" data-idx="${idx}">Remove</button>
      </div>
    `;
    cartContainer.appendChild(el);
  });

  cartSummary.innerHTML = `
    <div style="font-size:18px;font-weight:700">Subtotal: $${subtotal.toFixed(2)}</div>
    <div style="margin-top:10px">
      <button class="checkout-btn">Proceed to Checkout</button>
      <button style="margin-left:8px;" class="clear-btn">Clear Cart</button>
    </div>
  `;

  attachCartListeners();
}

function attachCartListeners(){
  document.querySelectorAll('.qty-input').forEach(inp=>{
    inp.addEventListener('change', (e)=>{
      const idx = Number(e.target.dataset.idx);
      const val = Math.max(1, Number(e.target.value) || 1);
      updateQty(idx, val);
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn=> btn.addEventListener('click', (e)=>{
    const idx = Number(e.target.dataset.idx);
    removeItem(idx);
  }));
  const checkoutBtn = document.querySelector('.checkout-btn');
  if(checkoutBtn) checkoutBtn.addEventListener('click', checkout);
  const clearBtn = document.querySelector('.clear-btn');
  if(clearBtn) clearBtn.addEventListener('click', clearCart);
}

function updateQty(idx, qty){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  if(!cart[idx]) return;
  cart[idx].qty = qty;
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function removeItem(idx){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  cart.splice(idx,1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function clearCart(){
  if(confirm('Clear the cart?')){
    localStorage.removeItem('cart');
    loadCart();
  }
}

function checkout(){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  if(cart.length === 0) return alert('Cart empty');
  const subtotal = cart.reduce((s,i)=>s + i.price * (i.qty||1),0);
  alert('Checked out. Total: $'+subtotal.toFixed(2));
  localStorage.removeItem('cart');
  window.location.href = 'index.html';
}

loadCart();