const trackingForm = document.querySelector("#tracking-form");
const trackingMessage = document.querySelector("#tracking-message");
const trackingInput = document.querySelector("#tracking-number");
const liveTrackingNumber = document.querySelector("#live-tracking-number");
const liveLocation = document.querySelector("#live-location");
const syncTime = document.querySelector("#sync-time");
const accountModal = document.querySelector("#account-modal");
const accountMessage = document.querySelector("#account-message");
const locations = ["Thiès · il y a 4 min", "Mbour · il y a 2 min", "Kaolack · à l'instant"];
let locationIndex = 0;

function showTracking(reference) {
  const normalized = reference.trim().toUpperCase();
  if (!/^R227-\d{4}$/.test(normalized)) {
    trackingMessage.textContent = "Référence introuvable. Utilisez un numéro au format R227-1048.";
    trackingMessage.className = "tracking-message error";
    return;
  }
  trackingInput.value = normalized;
  liveTrackingNumber.textContent = normalized;
  trackingMessage.textContent = `Commande ${normalized} retrouvée · Dernière mise à jour il y a 12 min.`;
  trackingMessage.className = "tracking-message success";
}

trackingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showTracking(new FormData(trackingForm).get("tracking"));
});

function refreshTracking() {
  locationIndex = (locationIndex + 1) % locations.length;
  liveLocation.textContent = `Dernière position : ${locations[locationIndex]}`;
  syncTime.textContent = "à l'instant";
}

document.querySelector("#refresh-tracking").addEventListener("click", refreshTracking);
setInterval(refreshTracking, 30000);

document.querySelectorAll("[data-tracking]").forEach((button) => {
  button.addEventListener("click", () => {
    trackingInput.value = button.dataset.tracking;
    showTracking(button.dataset.tracking);
    document.querySelector("#tracking").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll(".coverage-place").forEach((place) => {
  place.addEventListener("click", () => {
    document.querySelectorAll(".coverage-place").forEach((item) => item.classList.remove("active"));
    place.classList.add("active");
    document.querySelector("#coverage-selection strong").textContent = place.dataset.destination;
    document.querySelector("#account-modal").showModal();
    document.querySelector("#account-form [name='destination']").value = place.dataset.destination;
  });
});

document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".client-header").classList.toggle("menu-open");
});

document.querySelector("#open-account-modal").addEventListener("click", () => accountModal.showModal());
document.querySelector(".close-account").addEventListener("click", () => accountModal.close());
document.querySelector("#account-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  localStorage.setItem("rachco227-client", JSON.stringify({ name: form.get("name"), email: form.get("email"), destination: form.get("destination") }));
  accountMessage.textContent = `Compte créé pour ${form.get("name")} · livraison vers ${form.get("destination")}.`;
  accountMessage.className = "account-message success";
  event.target.reset();
});
