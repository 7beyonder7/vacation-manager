import { reactive } from 'vue';

export const toasts = reactive([]); // { id, msg, type }
let counter = 1;

export function toast(msg, type = 'info', timeout = 3800) {
  const id = counter++;
  toasts.push({ id, msg, type });
  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id);
    if (idx !== -1) toasts.splice(idx, 1);
  }, timeout);
}