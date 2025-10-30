import { validationResult } from 'express-validator'
import { parsePaging } from '../utils/paging.js'
import * as svc from '../services/requests.service.js'
import * as policy from '../policies/requests.policy.js'
import { t } from '../constants/messages/index.js'

export async function create(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ error: t(req.headers['accept-language'],'errors.badParams'), details: errors.array() })

  const { start_date, end_date, reason } = req.body
  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ error: t(req.headers['accept-language'], 'errors.dateOrder') })
  }

  const { conflict, row } = await svc.createRequest({ userId: req.user.id, start_date, end_date, reason })
  if (conflict) {
    return res.status(409).json({
      error: 'OVERLAP',
      message: t(req.headers['accept-language'], 'errors.overlapCreate'),
      conflict: { id: conflict.id, start_date: conflict.start_date, end_date: conflict.end_date, status: conflict.status },
    })
  }
  return res.status(201).json(row)
}

export async function listMine(req, res) {
  const { page, pageSize, offset, limit } = parsePaging(req.query)
  const where = {}; if (req.query.status) where.status = req.query.status
  const { rows, count } = await svc.listMine({ userId: req.user.id, where, offset, limit })
  res.json({ items: rows, total: count, page, pageSize })
}

export async function listAll(req, res) {
  if (!policy.canListAll(req.user)) return res.status(403).json({ error: t(req.headers['accept-language'], 'errors.forbidden') })
  const { page, pageSize, offset, limit } = parsePaging(req.query)
  const where = {}; if (req.query.status) where.status = req.query.status
  const search = (req.query.search || '').trim()
  const { rows, count } = await svc.listAll({ where, search, offset, limit })
  res.json({ items: rows, total: count, page, pageSize })
}

export async function decide(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ error: t(req.headers['accept-language'],'errors.badParams'), details: errors.array() })

  const { status, comments } = req.body
  const { notFound, conflict, row } = await svc.approveOrReject({ id: req.params.id, status, comments })
  if (notFound) return res.status(404).json({ error: t(req.headers['accept-language'], 'errors.notFound') })
  if (conflict) {
    return res.status(409).json({
      error: 'OVERLAP_ON_APPROVE',
      message: t(req.headers['accept-language'], 'errors.overlapApprove'),
      conflict: { id: conflict.id, start_date: conflict.start_date, end_date: conflict.end_date, status: conflict.status },
    })
  }
  res.json(row)
}

export async function checkOverlap(req, res) {
  const { start_date, end_date } = req.query || {}
  if (!start_date || !end_date) {
    return res.status(400).json({ error: t(req.headers['accept-language'], 'errors.badParams') })
  }
  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ error: t(req.headers['accept-language'], 'errors.dateOrder') })
  }
  const conflict = await svc.findFirstOverlap(req.user.id, start_date, end_date)
  if (!conflict) return res.json({ overlap: false })
  return res.json({ overlap: true, conflict: { id: conflict.id, start_date: conflict.start_date, end_date: conflict.end_date, status: conflict.status } })
}

export async function destroy(req, res) {
  const row = await svc.getById(req.params.id)
  if (!row) return res.status(404).json({ error: t(req.headers['accept-language'], 'errors.notFound') })
  if (!policy.canDelete(req.user, row)) {
    const key = req.user.role === 'Validator' ? 'errors.notDeletableValidator' : 'errors.notDeletableRequester'
    return res.status(req.user.role === 'Validator' ? 409 : 403).json({ error: 'NOT_DELETABLE', message: t(req.headers['accept-language'], key) })
  }
  await svc.deleteById(row)
  res.status(204).send()
}
