// Supported systems: EmulatorJS core name, display label, and file extensions.
// Core names come from the EmulatorJS cores list.
export const SYSTEMS = [
  { core: "nes",        label: "NES / Famicom",        short: "NES",   ext: ["nes", "fds", "unf", "unif"] },
  { core: "snes",       label: "Super Nintendo",       short: "SNES",  ext: ["sfc", "smc", "fig", "swc"] },
  { core: "gb",         label: "Game Boy",             short: "GB",    ext: ["gb"] },
  { core: "gbc",        label: "Game Boy Color",       short: "GBC",   ext: ["gbc"] },
  { core: "gba",        label: "Game Boy Advance",     short: "GBA",   ext: ["gba"] },
  { core: "n64",        label: "Nintendo 64",          short: "N64",   ext: ["n64", "z64", "v64"] },
  { core: "nds",        label: "Nintendo DS",          short: "NDS",   ext: ["nds"] },
  { core: "vb",         label: "Virtual Boy",          short: "VB",    ext: ["vb", "vboy"] },
  { core: "segaMS",     label: "Sega Master System",   short: "SMS",   ext: ["sms"] },
  { core: "segaGG",     label: "Sega Game Gear",       short: "GG",    ext: ["gg"] },
  { core: "segaMD",     label: "Sega Genesis / Mega Drive", short: "GEN", ext: ["md", "gen", "smd", "bin"] },
  { core: "sega32x",    label: "Sega 32X",             short: "32X",   ext: ["32x"] },
  { core: "atari2600",  label: "Atari 2600",           short: "2600",  ext: ["a26"] },
  { core: "atari7800",  label: "Atari 7800",           short: "7800",  ext: ["a78"] },
  { core: "lynx",       label: "Atari Lynx",           short: "LYNX",  ext: ["lnx"] },
  { core: "pce",        label: "TurboGrafx-16 / PC Engine", short: "TG16", ext: ["pce"] },
  { core: "ngp",        label: "Neo Geo Pocket",       short: "NGP",   ext: ["ngp", "ngc"] },
  { core: "ws",         label: "WonderSwan",           short: "WS",    ext: ["ws", "wsc"] },
  { core: "coleco",     label: "ColecoVision",         short: "CV",    ext: ["col"] },
];

export function systemByCore(core) {
  return SYSTEMS.find((s) => s.core === core);
}

// Returns the system for a file name, or null when the extension is ambiguous
// (for example .zip or .bin can't be identified from the name alone).
export function detectSystem(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  if (ext === "zip" || ext === "7z") return null;
  return SYSTEMS.find((s) => s.ext.includes(ext)) || null;
}

export const ACCEPT = [...new Set(SYSTEMS.flatMap((s) => s.ext)), "zip", "7z"]
  .map((e) => "." + e)
  .join(",");
