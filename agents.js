const missions = [
  {
    id: "DEMO-TR-001",
    type: "transfer",
    title: "Transfert entre deux centres",
    origin: "Centre de tri (exemple)",
    destination: "Dépôt régional (exemple)",
    instruction: "Confirmer la prise en charge du colis fictif.",
    clientPhone: "+221 70 000 00 01",
    withdrawalMethod: "client",
    identityType: "national-id",
    status: "À prendre en charge",
    nextAction: "Simuler la prise en charge"
  },
  {
    id: "DEMO-RT-002",
    type: "pickup",
    title: "Retrait au point relais",
    origin: "Point relais (exemple)",
    destination: "Dépôt régional (exemple)",
    instruction: "Vérifier le code fictif DEMO-204 avant la remise.",
    clientPhone: "+221 70 000 00 02",
    withdrawalMethod: "relay",
    identityType: "passport",
    status: "Retrait à confirmer",
    nextAction: "Simuler le retrait"
  },
  {
    id: "DEMO-TR-003",
    type: "transfer",
    title: "Acheminement vers le centre local",
    origin: "Dépôt régional (exemple)",
    destination: "Centre local (exemple)",
    instruction: "Parcours de démonstration sans colis réel.",
    clientPhone: "+221 70 000 00 03",
    withdrawalMethod: "client",
    identityType: "driver-license",
    status: "En cours",
    nextAction: "Simuler la fin du transfert"
  }
];

const missionList = document.querySelector("#mission-list");
const missionFilter = document.querySelector("#mission-filter");
const feedback = document.querySelector("#action-feedback");
const editDialog = document.querySelector("#mission-edit-dialog");
const editForm = document.querySelector("#mission-edit-form");
const withdrawalMethod = document.querySelector("#withdrawal-method");
const identityTypeField = document.querySelector("#identity-type-field");
const identityType = document.querySelector("#identity-type");
const editFeedback = document.querySelector("#mission-edit-feedback");
let editingMissionId = "";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function withdrawalMethodLabel(method) {
  return ({
    client: "Par le client",
    proxy: "Par une personne autorisée",
    relay: "Au point relais"
  })[method] || "Non précisé";
}

function identityTypeLabel(type) {
  return ({
    "national-id": "Carte nationale d’identité",
    "driver-license": "Permis de conduire",
    passport: "Passeport"
  })[type] || "Non précisé";
}

function renderMissions() {
  const filter = missionFilter.value;
  const visibleMissions = missions.filter((mission) => filter === "all" || mission.type === filter);
  missionList.innerHTML = visibleMissions.length
    ? visibleMissions.map((mission) => {
      const missionType = mission.type === "pickup" ? "Retrait" : "Transfert";
      const statusClass = mission.status === "Terminée" ? "done" : mission.status === "En cours" ? "active" : "";
      return `<article class="mission-card">
        <div class="mission-topline"><span class="mission-kind ${mission.type}">${missionType}</span><span class="mission-reference">${escapeHtml(mission.id)}</span></div>
        <h3>${escapeHtml(mission.title)}</h3>
        <dl class="mission-details">
          <div><dt>Départ / point de retrait</dt><dd>${escapeHtml(mission.origin)}</dd></div>
          <div><dt>Destination</dt><dd>${escapeHtml(mission.destination)}</dd></div>
          <div><dt>Contact client fictif</dt><dd>${escapeHtml(mission.clientPhone)}</dd></div>
          <div><dt>Mode de retrait</dt><dd>${withdrawalMethodLabel(mission.withdrawalMethod)}</dd></div>
          ${mission.type === "pickup" ? `<div><dt>Pièce à vérifier</dt><dd>${identityTypeLabel(mission.identityType)}</dd></div>` : ""}
          <div><dt>Consigne</dt><dd>${escapeHtml(mission.instruction)}</dd></div>
        </dl>
        <div class="mission-actions"><span class="mission-status ${statusClass}">${escapeHtml(mission.status)}</span><div class="mission-action-buttons"><button class="secondary-button edit-mission-button" type="button" data-edit-mission="${escapeHtml(mission.id)}">Modifier destination et retrait</button>${mission.nextAction ? `<button class="action-button" type="button" data-mission-id="${escapeHtml(mission.id)}">${escapeHtml(mission.nextAction)}</button>` : ""}</div></div>
      </article>`;
    }).join("")
    : `<p class="mission-empty">Aucune mission de ce type dans cet aperçu.</p>`;
}

function updateIdentityField() {
  const isPickup = missions.find((mission) => mission.id === editingMissionId)?.type === "pickup";
  identityTypeField.hidden = !isPickup;
  identityType.required = Boolean(isPickup);
}

function openMissionEditor(missionId) {
  const mission = missions.find((item) => item.id === missionId);
  if (!mission) return;
  editingMissionId = mission.id;
  editForm.elements.destination.value = mission.destination;
  editForm.elements.clientPhone.value = mission.clientPhone;
  withdrawalMethod.value = mission.withdrawalMethod;
  identityType.value = mission.identityType;
  editFeedback.textContent = "";
  updateIdentityField();
  editDialog.showModal();
}

function closeMissionEditor() {
  editDialog.close();
  editingMissionId = "";
  editForm.reset();
  editFeedback.textContent = "";
  updateIdentityField();
}

withdrawalMethod.addEventListener("change", updateIdentityField);
document.querySelector("#close-mission-dialog").addEventListener("click", closeMissionEditor);
document.querySelector("#cancel-mission-edit").addEventListener("click", closeMissionEditor);

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const mission = missions.find((item) => item.id === editingMissionId);
  if (!mission) {
    editFeedback.textContent = "Mission introuvable. Fermez cette fenêtre et réessayez.";
    return;
  }
  const form = new FormData(editForm);
  const destination = String(form.get("destination")).trim();
  const clientPhone = String(form.get("clientPhone")).trim();
  const method = String(form.get("withdrawalMethod"));
  const documentType = String(form.get("identityType"));
  if (!destination || !clientPhone || !["client", "proxy", "relay"].includes(method)) {
    editFeedback.textContent = "Renseignez une destination, un téléphone fictif et un mode de retrait valide.";
    return;
  }
  if (mission.type === "pickup" && !["national-id", "driver-license", "passport"].includes(documentType)) {
    editFeedback.textContent = "Choisissez le type de pièce à présenter pour ce retrait.";
    return;
  }
  mission.destination = destination;
  mission.clientPhone = clientPhone;
  mission.withdrawalMethod = method;
  mission.identityType = documentType;
  feedback.textContent = `Informations de ${mission.id} modifiées uniquement dans la démonstration.`;
  closeMissionEditor();
  renderMissions();
});

missionFilter.addEventListener("change", () => {
  feedback.textContent = "";
  renderMissions();
});

missionList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-mission]");
  if (editButton) {
    openMissionEditor(editButton.dataset.editMission);
    return;
  }
  const button = event.target.closest("[data-mission-id]");
  if (!button) return;
  const mission = missions.find((item) => item.id === button.dataset.missionId);
  if (!mission) return;
  mission.status = mission.status === "À prendre en charge" || mission.status === "Retrait à confirmer"
    ? "En cours"
    : "Terminée";
  mission.nextAction = mission.status === "En cours" ? "Simuler la fin de mission" : "";
  feedback.textContent = `Étape simulée pour ${mission.id}. Aucune donnée réelle n’a été modifiée.`;
  renderMissions();
});

renderMissions();
