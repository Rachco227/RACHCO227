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
renderRows();
