const apiURL = "https://fakestoreapi.com/products";
const container = document.getElementById('users_data');
const cartCountElem = document.getElementById('cart-count');

function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const count = cart.reduce((s,i)=>s + (i.qty||1), 0);
  cartCountElem.textContent = count;
}

async function fetchallusere(){
  try{
    const res = await fetch(apiURL);
    const jsondata = await res.json();
    renderProducts(jsondata);
  }catch(err){
    console.error('Error fetching products:', err);
    container.innerHTML = '<p style="color:red">Failed to load products. Try again later.</p>';
  }
}

function renderProducts(products){
  container.innerHTML = '';
  products.forEach(product =>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="title">${product.title}</div>
      <div class="desc">${product.description}</div>
      <div class="meta">Category: ${product.category} | Rating: ${product.rating?.rate || 0} (${product.rating?.count || 0})</div>
      <div class="price">$${Number(product.price).toFixed(2)}</div>
      <div class="actions">
        <button class="add-btn">Add to Cart</button>
        <button class="details-btn" onclick="window.open('${apiURL}/${product.id}','_blank')">View API</button>
      </div>
    `;

    const addBtn = card.querySelector('.add-btn');
    addBtn.addEventListener('click', ()=> addToCart(product));
    container.appendChild(card);
  });
  updateCartCount();
}

function addToCart(product){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const existing = cart.find(i=>i.id === product.id);
  if(existing){ existing.qty = (existing.qty||1) + 1; }
  else{ cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, qty: 1 }); }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${product.title} added to cart!`);
}

fetchallusere();