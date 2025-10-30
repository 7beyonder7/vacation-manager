import { url } from './_server.js';

export function as(userId) {
  const commonHeaders = {
    'Content-Type': 'application/json',
    'X-User-Id': String(userId)
  };

  return {
    get: (path, params) => {
      const q = params ? `?${new URLSearchParams(params).toString()}` : '';
      return fetch(url(path) + q, { headers: commonHeaders });
    },
    post: (path, body) => {
      return fetch(url(path), {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify(body || {})
      });
    },
    patch: (path, body) => {
      return fetch(url(path), {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify(body || {})
      });
    },
    delete: (path) => {
      return fetch(url(path), { method: 'DELETE', headers: commonHeaders });
    }
  };
}
