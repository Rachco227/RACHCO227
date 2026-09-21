const products = [
  { id: 1, name: "Veste Signal", category: "outerwear", type: "Veste en nylon", price: 145, tag: "Nouveau", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=82" },
  { id: 2, name: "Hoodie Transit", category: "tops", type: "Molleton 480g", price: 95, tag: "Best-seller", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=82" },
  { id: 3, name: "Cargo 227", category: "outerwear", type: "Coton ripstop", price: 120, tag: "", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=82" },
  { id: 4, name: "T-shirt Ligne", category: "tops", type: "Jersey 240g", price: 45, tag: "", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=82" },
  { id: 5, name: "Bonnet N°04", category: "accessories", type: "Laine mérinos", price: 38, tag: "", image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=82" },
  { id: 6, name: "Tote Unité", category: "accessories", type: "Toile épaisse", price: 28, tag: "Essentiel", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=82" },
  { id: 7, name: "Sweat Studio", category: "tops", type: "Coton brossé", price: 88, tag: "", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=82" },
  { id: 8, name: "Casquette 227", category: "accessories", type: "Coton canvas", price: 32, tag: "", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=82" }
];

let cart = JSON.parse(localStorage.getItem("rachco-cart") || "[]");
let activeFilter = "all";
const grid = document.querySelector("#product-grid");
const euro = (value) => `${value.toFixed(2).replace(".", ",")} €`;

function visibleProducts() {
  const query = document.querySelector("#search-input")?.value.toLowerCase().trim() || "";
  return products.filter((p) => (activeFilter === "all" || p.category === activeFilter) && `${p.name} ${p.type}`.toLowerCase().includes(query));
}

function renderProducts() {
  const selected = visibleProducts();
  grid.innerHTML = selected.length ? selected.map((p) => `
    <article class="product-card">
      <div class="product-photo">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <button class="add-button" data-add="${p.id}" aria-label="Ajouter ${p.name} au panier">+</button>
      </div>
      <div class="product-info"><div><h3 class="product-name">${p.name}</h3><p class="product-meta">${p.type}</p></div><p class="product-price">${euro(p.price)}</p></div>
    </article>`).join("") : `<p class="empty-cart">Aucune pièce ne correspond à votre recherche.</p>`;
  document.querySelector("#search-result").textContent = selected.length ? `${selected.length} pièce${selected.length > 1 ? "s" : ""} trouvée${selected.length > 1 ? "s" : ""}.` : "Aucune pièce trouvée.";
}

function saveCart() { localStorage.setItem("rachco-cart", JSON.stringify(cart)); }
function renderCart() {
  const items = document.querySelector("#cart-items");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector("#cart-count").textContent = count;
  if (!cart.length) {
    items.innerHTML = `<p class="empty-cart">Votre panier est encore vide.<br /><a href="#shop" id="empty-shop-link">Voir la sélection →</a></p>`;
  } else {
    items.innerHTML = cart.map((item) => `<div class="cart-line">
      <img src="${item.image}" alt="${item.name}" />
      <div><h3>${item.name}</h3><p>${euro(item.price)}</p><div class="qty-control"><button data-decrease="${item.id}" aria-label="Retirer une unité">−</button><span>${item.quantity}</span><button data-increase="${item.id}" aria-label="Ajouter une unité">+</button></div></div>
      <button class="remove-item" data-remove="${item.id}" aria-label="Supprimer ${item.name}">×</button>
    </div>`).join("");
  }
  document.querySelector("#cart-total").textContent = euro(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
}
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart(); renderCart(); document.body.classList.add("drawer-open");
}
function updateQuantity(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);
  saveCart(); renderCart();
}

document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  if (add) addToCart(Number(add.dataset.add));
  const increase = event.target.closest("[data-increase]");
  if (increase) updateQuantity(Number(increase.dataset.increase), 1);
  const decrease = event.target.closest("[data-decrease]");
  if (decrease) updateQuantity(Number(decrease.dataset.decrease), -1);
  const remove = event.target.closest("[data-remove]");
  if (remove) { cart = cart.filter((item) => item.id !== Number(remove.dataset.remove)); saveCart(); renderCart(); }
  if (event.target.id === "empty-shop-link") document.body.classList.remove("drawer-open");
});

document.querySelectorAll(".filter-tab").forEach((button) => button.addEventListener("click", () => {
  document.querySelector(".filter-tab.active").classList.remove("active");
  button.classList.add("active"); activeFilter = button.dataset.filter; renderProducts();
}));
document.querySelector("#sort-select").addEventListener("change", (event) => {
  const sorted = [...visibleProducts()].sort((a, b) => event.target.value === "low" ? a.price - b.price : event.target.value === "high" ? b.price - a.price : a.id - b.id);
  const original = products.slice();
  products.splice(0, products.length, ...sorted, ...original.filter((p) => !sorted.includes(p)));
  renderProducts();
});

const searchPanel = document.querySelector("#search-panel");
document.querySelector("#search-toggle").addEventListener("click", () => { searchPanel.classList.add("open"); searchPanel.setAttribute("aria-hidden", "false"); document.querySelector("#search-input").focus(); });
document.querySelector("#search-close").addEventListener("click", () => { searchPanel.classList.remove("open"); searchPanel.setAttribute("aria-hidden", "true"); });
document.querySelector("#search-input").addEventListener("input", renderProducts);
document.querySelector("#cart-toggle").addEventListener("click", () => document.body.classList.add("drawer-open"));
document.querySelector("#cart-close").addEventListener("click", () => document.body.classList.remove("drawer-open"));
document.querySelector("#overlay").addEventListener("click", () => document.body.classList.remove("drawer-open"));
document.querySelector("#checkout-button").addEventListener("click", () => alert(cart.length ? "Merci ! Le paiement sera bientôt disponible." : "Votre panier est vide."));
document.querySelector("#newsletter-form").addEventListener("submit", (event) => { event.preventDefault(); document.querySelector("#newsletter-status").textContent = "C’est noté. Bienvenue dans la boucle."; document.querySelector("#email").value = ""; });

renderProducts();
renderCart();
