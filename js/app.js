import { SYSTEMS, systemByCore, detectSystem, ACCEPT } from "./systems.js";
import { saveRom, listRoms, deleteRom } from "./store.js";

const $ = (sel) => document.querySelector(sel);
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Load your own game ---------- */
const input = $("#file-input");
const dropzone = $("#dropzone");
const picker = $("#system-picker");
const select = $("#system-select");
let pendingFile = null;

input.accept = ACCEPT;
select.innerHTML = SYSTEMS.map((s) => `<option value="${s.core}">${s.label}</option>`).join("");

input.addEventListener("change", () => input.files[0] && handleFile(input.files[0]));
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
});
["dragenter", "dragover"].forEach((t) =>
  dropzone.addEventListener(t, (e) => { e.preventDefault(); dropzone.classList.add("over"); })
);
["dragleave", "drop"].forEach((t) =>
  dropzone.addEventListener(t, (e) => { e.preventDefault(); dropzone.classList.remove("over"); })
);
dropzone.addEventListener("drop", (e) => {
  const f = e.dataTransfer.files[0];
  if (f) handleFile(f);
});

function handleFile(file) {
  const sys = detectSystem(file.name);
  if (sys) return launchLocal(file, sys.core);
  // Ambiguous file type (.zip, .7z): ask which system.
  pendingFile = file;
  $("#picker-file").textContent = file.name;
  picker.hidden = false;
  select.focus();
}

$("#picker-go").addEventListener("click", () => {
  if (pendingFile) launchLocal(pendingFile, select.value);
});

async function launchLocal(file, core) {
  const rec = await saveRom({ name: file.name, core, blob: file });
  location.href = "play.html?local=" + encodeURIComponent(rec.id);
}

/* ---------- Recent games (this browser only) ---------- */
async function renderRecent() {
  const roms = await listRoms().catch(() => []);
  $("#recent-wrap").hidden = roms.length === 0;
  $("#recent").innerHTML = roms
    .map((r) => {
      const sys = systemByCore(r.core);
      return `<li class="card">
        <a href="play.html?local=${encodeURIComponent(r.id)}">
          <div class="cover cover-${r.core}"><span>${sys ? sys.short : r.core}</span></div>
          <div class="card-body"><b>${escapeHtml(stripExt(r.name))}</b><small>${sys ? sys.label : ""}</small></div>
        </a>
        <button class="remove" data-id="${escapeHtml(r.id)}" aria-label="Remove ${escapeHtml(r.name)}">✕</button>
      </li>`;
    })
    .join("");
}
$("#recent").addEventListener("click", async (e) => {
  const btn = e.target.closest(".remove");
  if (!btn) return;
  await deleteRom(btn.dataset.id);
  renderRecent();
});
renderRecent();

/* ---------- Free library from games.json ---------- */
let catalog = [];
let activeFilter = "all";

fetch("games.json")
  .then((r) => r.json())
  .then((data) => {
    catalog = data.games || [];
    renderFilters();
    renderCatalog();
  })
  .catch(() => renderCatalog());

function renderFilters() {
  const cores = [...new Set(catalog.map((g) => g.system))];
  if (cores.length < 2) return;
  $("#filters").innerHTML = ["all", ...cores]
    .map((c) => {
      const label = c === "all" ? "All" : systemByCore(c)?.short || c;
      return `<button data-f="${c}" class="${c === activeFilter ? "on" : ""}">${label}</button>`;
    })
    .join("");
}
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  activeFilter = b.dataset.f;
  renderFilters();
  renderCatalog();
});

function renderCatalog() {
  const list = catalog.filter((g) => activeFilter === "all" || g.system === activeFilter);
  $("#catalog-empty").hidden = list.length > 0;
  $("#catalog").innerHTML = list
    .map((g) => {
      const sys = systemByCore(g.system);
      const cover = g.cover
        ? `<div class="cover" style="background-image:url('${encodeURI(g.cover)}')"></div>`
        : `<div class="cover cover-${g.system}"><span>${sys ? sys.short : g.system}</span></div>`;
      return `<li class="card">
        <a href="play.html?game=${encodeURIComponent(g.id)}">
          ${cover}
          <div class="card-body"><b>${escapeHtml(g.title)}</b><small>${sys ? sys.label : ""}${g.author ? " · " + escapeHtml(g.author) : ""}</small></div>
        </a>
      </li>`;
    })
    .join("");
}

function stripExt(n) { return n.replace(/\.[^.]+$/, ""); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
