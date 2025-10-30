export function getNumberPref(key, def) {
  const v = localStorage.getItem(key);
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : def;
}
export function setNumberPref(key, n) {
  localStorage.setItem(key, String(n));
}
