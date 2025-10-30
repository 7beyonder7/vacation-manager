import { startTestServer, stopTestServer } from './_server.js';
import { resetDb, createUser, createReq } from './_factories.js';
import { as } from './_api.js';

let requester, validator;

beforeAll(async () => {
  await startTestServer();
});

afterAll(async () => {
  await stopTestServer();
  
});

beforeEach(async () => {
  await resetDb();
  requester = await createUser({ name: 'Paul', role: 'Requester' });
  validator = await createUser({ name: 'Bob', role: 'Validator' });
});

test('health is public (simple)', async () => {
  const base = (await import('./_server.js')).url('/');
  const res = await fetch(base.replace(/\/$/, '') + '/health');
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.ok).toBe(true);
});

test('requireUser blocks when header missing', async () => {
  const base = (await import('./_server.js')).url('/');
  const res = await fetch(base.replace(/\/$/, '') + '/api/requests/mine');
  expect(res.status).toBe(401);
});

test('Requester can create a request', async () => {
  const api = as(requester.id);
  const res = await api.post('/api/requests', {
    start_date: '2025-12-01',
    end_date: '2025-12-05',
    reason: 'Family trip'
  });
  expect(res.status).toBe(201);
  const body = await res.json();
  expect(body.status).toBe('Pending');
});

test('Create is blocked on overlap (409)', async () => {
  await createReq({ user_id: requester.id, start_date: '2025-12-10', end_date: '2025-12-12', status: 'Approved' });
  const api = as(requester.id);
  const res = await api.post('/api/requests', {
    start_date: '2025-12-11',
    end_date: '2025-12-15'
  });
  expect(res.status).toBe(409);
  const body = await res.json();
  expect(body.error).toBe('OVERLAP');
});

test('GET /check reports overlap true/false', async () => {
  await createReq({ user_id: requester.id, start_date: '2025-12-10', end_date: '2025-12-12', status: 'Pending' });
  const api = as(requester.id);

  const ok = await api.get('/api/requests/check', { start_date: '2025-12-20', end_date: '2025-12-22' });
  expect(ok.status).toBe(200);
  expect((await ok.json()).overlap).toBe(false);

  const ov = await api.get('/api/requests/check', { start_date: '2025-12-11', end_date: '2025-12-21' });
  expect(ov.status).toBe(200);
  expect((await ov.json()).overlap).toBe(true);
});

test('Requester sees only own requests', async () => {
  await createReq({ user_id: requester.id, start_date: '2025-12-01', end_date: '2025-12-02' });
  await createReq({ user_id: validator.id, start_date: '2025-12-03', end_date: '2025-12-04' });

  const api = as(requester.id);
  const res = await api.get('/api/requests/mine');
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body.items)).toBe(true);
  expect(body.items.every(x => x.user_id === requester.id)).toBe(true);
});

test('Validator can list all; Requester cannot', async () => {
  const r1 = await as(requester.id).get('/api/requests');
  expect(r1.status).toBe(403);

  const r2 = await as(validator.id).get('/api/requests');
  expect(r2.status).toBe(200);
  const b2 = await r2.json();
  expect(Array.isArray(b2.items)).toBe(true);
});

test('Approve succeeds when no overlap', async () => {
  const created = await as(requester.id).post('/api/requests', { start_date: '2025-12-01', end_date: '2025-12-05' });
  const id = (await created.json()).id;

  const res = await as(validator.id).patch(`/api/requests/${id}/decision`, { status: 'Approved', comments: 'ok' });
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.status).toBe('Approved');
});

test('creating overlapping request is blocked (409)', async () => {
  const a = await as(requester.id)
    .post('/api/requests', { start_date: '2025-12-01', end_date: '2025-12-05' })
    .then(r => r.json());
  expect(a.id).toBeDefined();

  // Approve the first one (not strictly necessary for create-time overlap, but realistic)
  const first = await as(validator.id).patch(`/api/requests/${a.id}/decision`, { status: 'Approved' });
  expect(first.status).toBe(200);

  // Now try to create overlapping request -> should fail at creation
  const res = await as(requester.id).post('/api/requests', { start_date: '2025-12-04', end_date: '2025-12-06' });
  expect(res.status).toBe(409);
  const body = await res.json();
  expect(body.error).toBe('OVERLAP');
});

test('Requester can delete own Pending; blocked otherwise', async () => {
  const pend = await createReq({ user_id: requester.id, status: 'Pending' });
  const del1 = await as(requester.id).delete(`/api/requests/${pend.id}`);
  expect(del1.status).toBe(204);

  const appr = await createReq({ user_id: requester.id, status: 'Approved' });
  const del2 = await as(requester.id).delete(`/api/requests/${appr.id}`);
  expect([403, 409]).toContain(del2.status);
});

test('Validator can delete any request', async () => {
  const row = await createReq({ user_id: requester.id, status: 'Rejected' });
  const res = await as(validator.id).delete(`/api/requests/${row.id}`);
  expect(res.status).toBe(204);
});
