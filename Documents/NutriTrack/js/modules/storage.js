/**
 * NutriTrack — localStorage Storage Module
 * All app data persisted here (profile, daily log, cookies)
 */

function lsGet(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {
    console.warn('localStorage quota exceeded', e);
  }
}

function lsDelete(key) { localStorage.removeItem(key); }

export default { lsGet, lsSet, lsDelete };