const ROLES = { 1: 'Requester', 2: 'Validator' };

export function getUserId() {
  return Number(localStorage.getItem('userId') || 1);
}

export function setUserId(id) {
  localStorage.setItem('userId', String(id));
}

export function getRole() {
  return ROLES[getUserId()] || 'Requester';
}