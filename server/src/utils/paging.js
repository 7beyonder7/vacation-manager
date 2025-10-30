export function parsePaging(q) {
  const page = Math.max(parseInt(q.page || '1', 10), 1)
  const pageSize = Math.min(Math.max(parseInt(q.pageSize || '10', 10), 1), 100)
  return { page, pageSize, offset: (page - 1) * pageSize, limit: pageSize }
}