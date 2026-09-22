const rows = [
  { product: "Veste Signal", ref: "R227-VS-01", category: "vêtements", qty: 126, status: "good", label: "En stock" },
  { product: "Hoodie Transit", ref: "R227-HT-02", category: "vêtements", qty: 4, status: "low", label: "Stock faible" },
  { product: "Cargo 227", ref: "R227-CG-03", category: "vêtements", qty: 78, status: "good", label: "En stock" },
  { product: "T-shirt Ligne", ref: "R227-TL-04", category: "vêtements", qty: 0, status: "out", label: "Rupture" },
  { product: "Bonnet N°04", ref: "R227-BN-05", category: "accessoires", qty: 34, status: "good", label: "En stock" },
  { product: "Tote Unité", ref: "R227-TU-06", category: "accessoires", qty: 18, status: "low", label: "Stock faible" }
];
const activities = [
  ["Entrée enregistrée", "84 × Hoodie Transit · Atelier Textile", "09:40", ""],
  ["Sortie de stock", "12 × Veste Signal · Commande #1048", "08:55", "orange"],
  ["Entrée enregistrée", "40 × Tote Unité · Studio Dakar", "Hier", ""],
  ["Inventaire ajusté", "Bonnet N°04 · +6 unités", "Hier", "orange"]
];
const clients = [
  { name: "Amina Diop", email: "amina.diop@email.com", zone: "Dakar, Sénégal", order: "Aujourd’hui", status: "active", label: "Actif" },
  { name: "Koffi Mensah", email: "koffi.m@email.com", zone: "Abidjan, Côte d’Ivoire", order: "Hier", status: "active", label: "Actif" },
  { name: "Mariam Traoré", email: "mariam.t@email.com", zone: "Bamako, Mali", order: "18 sept. 2026", status: "pending", label: "À confirmer" },
  { name: "Jean Kouassi", email: "jean.k@email.com", zone: "Lomé, Togo", order: "15 sept. 2026", status: "active", label: "Actif" }
];
const orders = [
  { id: "#1048", client: "Amina Diop", destination: "Dakar, Sénégal", amount: "32 500 FCFA", status: "shipping", label: "En livraison" },
  { id: "#1047", client: "Koffi Mensah", destination: "Abidjan, Côte d’Ivoire", amount: "18 000 FCFA", status: "preparing", label: "À préparer" },
  { id: "#1046", client: "Mariam Traoré", destination: "Bamako, Mali", amount: "45 000 FCFA", status: "delivered", label: "Livrée" },
  { id: "#1045", client: "Jean Kouassi", destination: "Lomé, Togo", amount: "26 500 FCFA", status: "shipping", label: "En livraison" }
];
const table = document.querySelector("#stock-table");
function renderRows() {
  const query = document.querySelector("#stock-search").value.toLowerCase();
  const category = document.querySelector("#category-filter").value;
  const result = rows.filter((row) => (category === "all" || row.category === category) && `${row.product} ${row.ref}`.toLowerCase().includes(query));
  table.innerHTML = result.map((row) => `<tr><td><div class="stock-product"><span class="product-square">${row.product.slice(0, 1)}</span>${row.product}</div></td><td>${row.ref}</td><td>${row.category[0].toUpperCase() + row.category.slice(1)}</td><td><strong>${row.qty}</strong></td><td><span class="status ${row.status}">${row.label}</span></td><td><button class="row-menu" aria-label="Options pour ${row.product}">•••</button></td></tr>`).join("");
  document.querySelector("#result-count").textContent = `${result.length} références`;
}
document.querySelector("#stock-search").addEventListener("input", renderRows);
document.querySelector("#category-filter").addEventListener("change", renderRows);
document.querySelector("#activity-list").innerHTML = activities.map(([title, detail, time, tone]) => `<div class="activity"><span class="activity-icon ${tone}">${tone ? "↗" : "＋"}</span><div><strong>${title}</strong><p>${detail}</p></div><time>${time}</time></div>`).join("");
function renderClients() {
  const query = document.querySelector("#client-search").value.toLowerCase();
  const filter = document.querySelector("#client-filter").value;
  const result = clients.filter((client) => (filter === "all" || client.status === filter) && `${client.name} ${client.email} ${client.zone}`.toLowerCase().includes(query));
  document.querySelector("#client-table").innerHTML = result.map((client) => `<tr><td><div class="client-name"><span class="client-avatar">${client.name.split(" ").map((part) => part[0]).join("")}</span>${client.name}</div></td><td class="client-email">${client.email}</td><td>${client.zone}</td><td>${client.order}</td><td><span class="client-status ${client.status}">${client.label}</span></td><td><button class="row-menu" aria-label="Options pour ${client.name}">•••</button></td></tr>`).join("");
  document.querySelector("#client-result-count").textContent = `${result.length} client${result.length > 1 ? "s" : ""}`;
}
document.querySelector("#client-search").addEventListener("input", renderClients);
document.querySelector("#client-filter").addEventListener("change", renderClients);
function renderOrders() {
  const query = document.querySelector("#order-search").value.toLowerCase();
  const filter = document.querySelector("#order-filter").value;
  const result = orders.filter((order) => (filter === "all" || order.status === filter) && `${order.id} ${order.client} ${order.destination}`.toLowerCase().includes(query));
  document.querySelector("#order-table").innerHTML = result.map((order) => `<tr><td><strong>${order.id}</strong></td><td>${order.client}</td><td class="order-destination">${order.destination}</td><td>${order.amount}</td><td><span class="order-status ${order.status}">${order.label}</span></td><td><button class="row-menu" aria-label="Options ${order.id}">•••</button></td></tr>`).join("");
  document.querySelector("#order-result-count").textContent = `${result.length} commande${result.length > 1 ? "s" : ""}`;
}
document.querySelector("#order-search").addEventListener("input", renderOrders);
document.querySelector("#order-filter").addEventListener("change", renderOrders);
const modal = document.querySelector("#stock-modal");
document.querySelector("#open-stock-modal").addEventListener("click", () => modal.showModal());
document.querySelector(".close-modal").addEventListener("click", () => modal.close());
document.querySelector("#stock-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  rows.unshift({ product: form.get("product"), ref: form.get("reference"), category: form.get("category").toLowerCase(), qty: Number(form.get("quantity")), status: "good", label: "En stock" });
  renderRows();
  document.querySelector("#total-stock").textContent = "1 332";
  modal.close();
  event.target.reset();
});
const clientModal = document.querySelector("#client-modal");
document.querySelector("#open-client-modal").addEventListener("click", () => clientModal.showModal());
document.querySelector("#client-form .close-modal").addEventListener("click", () => clientModal.close());
document.querySelector("#client-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  clients.unshift({ name: form.get("name"), email: form.get("email"), zone: form.get("zone"), order: "Aucune commande", status: "pending", label: "À confirmer" });
  document.querySelector("#client-total").textContent = clients.length;
  document.querySelector("#nav-client-count").textContent = clients.length;
  renderClients();
  clientModal.close();
  event.target.reset();
});
const paymentModal = document.querySelector("#payment-modal");
document.querySelector("#open-payment-modal").addEventListener("click", () => paymentModal.showModal());
document.querySelector("#payment-form .close-modal").addEventListener("click", () => paymentModal.close());
document.querySelector("#payment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const account = new FormData(event.target).get("merchant");
  document.querySelector(".merchant-number strong").textContent = account;
  paymentModal.close();
});
const shippingModal = document.querySelector("#shipping-modal");
document.querySelector("#settings-link").addEventListener("click", (event) => { event.preventDefault(); shippingModal.showModal(); });
document.querySelector("#shipping-form .close-modal").addEventListener("click", () => shippingModal.close());
document.querySelector("#shipping-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(event.target);
  const address = `${values.get("address")}, ${values.get("city")}, ${values.get("country")}`;
  document.querySelector(".warehouse-status small").textContent = `Envoi depuis · ${values.get("city")}`;
  document.querySelector(".modal-copy").textContent = `Adresse enregistrée : ${address}`;
  shippingModal.close();
});
renderClients();
renderOrders();
renderRows();
