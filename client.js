const trackingForm = document.querySelector("#tracking-form");
const trackingMessage = document.querySelector("#tracking-message");
const trackingInput = document.querySelector("#tracking-number");

function showTracking(reference) {
  const normalized = reference.trim().toUpperCase();
  if (!/^R227-\d{4}$/.test(normalized)) {
    trackingMessage.textContent = "Référence introuvable. Utilisez un numéro au format R227-1048.";
    trackingMessage.className = "tracking-message error";
    return;
  }
  trackingInput.value = normalized;
  trackingMessage.textContent = `Commande ${normalized} retrouvée · Dernière mise à jour il y a 12 min.`;
  trackingMessage.className = "tracking-message success";
}

trackingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showTracking(new FormData(trackingForm).get("tracking"));
});

document.querySelectorAll("[data-tracking]").forEach((button) => {
  button.addEventListener("click", () => {
    trackingInput.value = button.dataset.tracking;
    showTracking(button.dataset.tracking);
    document.querySelector("#tracking").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".client-header").classList.toggle("menu-open");
});
