// Keeps a visitor's own ROMs in their browser (IndexedDB). Nothing is uploaded
// to the server — the file never leaves the visitor's device.
const DB_NAME = "arcadewebsite";
const STORE = "roms";

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(mode, fn) {
  return open().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const result = fn(t.objectStore(STORE));
        t.oncomplete = () => resolve(result && "result" in result ? result.result : result);
        t.onerror = () => reject(t.error);
      })
  );
}

export function saveRom({ name, core, blob }) {
  const id = core + ":" + name;
  const rec = { id, name, core, blob, size: blob.size, lastPlayed: Date.now() };
  return tx("readwrite", (s) => s.put(rec)).then(() => rec);
}

export function getRom(id) {
  return tx("readonly", (s) => s.get(id));
}

export function listRoms() {
  return tx("readonly", (s) => s.getAll()).then((all) =>
    (all || []).sort((a, b) => b.lastPlayed - a.lastPlayed)
  );
}

export function touchRom(rec) {
  return tx("readwrite", (s) => s.put({ ...rec, lastPlayed: Date.now() }));
}

export function deleteRom(id) {
  return tx("readwrite", (s) => s.delete(id));
}
