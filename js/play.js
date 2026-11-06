import { systemByCore } from "./systems.js";
import { getRom, touchRom } from "./store.js";

// Which EmulatorJS release to load. "stable" tracks the current release;
// pin to a version number (e.g. "4.2.3") if you want updates to never surprise you.
const EJS_VERSION = "stable";
const EJS_DATA = `https://cdn.emulatorjs.org/${EJS_VERSION}/data/`;

const params = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);

function fail(msg) {
  $("title").textContent = "Couldn't start the game";
  $("error").textContent = msg;
  $("error").hidden = false;
}

async function resolveGame() {
  if (params.has("local")) {
    const rec = await getRom(params.get("local"));
    if (!rec) throw new Error("That game isn't saved in this browser anymore. Go back and load the file again.");
    touchRom(rec);
    return { title: rec.name.replace(/\.[^.]+$/, ""), core: rec.core, url: URL.createObjectURL(rec.blob), name: rec.name };
  }
  if (params.has("game")) {
    const data = await fetch("games.json").then((r) => r.json());
    const g = (data.games || []).find((x) => x.id === params.get("game"));
    if (!g) throw new Error("Game not found in the library.");
    return { title: g.title, core: g.system, url: g.rom, name: g.rom.split("/").pop(), author: g.author };
  }
  throw new Error("No game selected.");
}

try {
  const game = await resolveGame();
  const sys = systemByCore(game.core);
  document.title = `${game.title} — Arcade Website`;
  $("title").textContent = game.title;
  $("subtitle").textContent = [sys?.label, game.author].filter(Boolean).join(" · ");

  // EmulatorJS is configured through globals, then its loader script is added.
  Object.assign(window, {
    EJS_player: "#game",
    EJS_core: game.core,
    EJS_gameUrl: game.url,
    EJS_gameName: game.name.replace(/\.[^.]+$/, ""), // used as the key for save states
    EJS_pathtodata: EJS_DATA,
    EJS_color: "#ff2e88",
    EJS_startOnLoaded: true,
    EJS_backgroundColor: "#0b0a14",
  });
  const s = document.createElement("script");
  s.src = EJS_DATA + "loader.js";
  s.onerror = () => fail("The emulator couldn't be downloaded. Check your internet connection and try again.");
  document.body.appendChild(s);
} catch (e) {
  fail(e.message);
}
