import { Op } from 'sequelize'
import { VacationRequest } from '../db/models/VacationRequest.js'
import { User } from '../db/models/User.js'
import { STATUS } from '../constants/status.js'

export function overlapWhere(userId, start, end, { includeRejected = false, excludeId = null } = {}) {
  const where = {
    user_id: userId,
    start_date: { [Op.lte]: end },
    end_date: { [Op.gte]: start }
  }
  if (!includeRejected) where.status = { [Op.in]: [STATUS.PENDING, STATUS.APPROVED] }
  if (excludeId) where.id = { [Op.ne]: excludeId }
  return where
}

export async function findFirstOverlap(userId, start, end, { includeRejected = false, excludeId = null } = {}) {
  return VacationRequest.findOne({ where: overlapWhere(userId, start, end, { includeRejected, excludeId }) })
}

export async function findApprovedOverlap(userId, start, end, { excludeId = null } = {}) {
  return VacationRequest.findOne({
    where: { ...overlapWhere(userId, start, end, { excludeId }), status: STATUS.APPROVED }
  })
}

export async function createRequest({ userId, start_date, end_date, reason }) {
  const conflict = await findFirstOverlap(userId, start_date, end_date)
  if (conflict) return { conflict }
  const row = await VacationRequest.create({
    user_id: userId, start_date, end_date, reason: reason || null, status: STATUS.PENDING
  })
  return { row }
}

export async function approveOrReject({ id, status, comments }) {
  const row = await VacationRequest.findByPk(id)

  if (!row) return { notFound: true }
  if (status === STATUS.APPROVED) {
    const overlap = await findApprovedOverlap(row.user_id, row.start_date, row.end_date, { excludeId: row.id })
    if (overlap) return { conflict: overlap, row }
  }
  row.status = status
  row.comments = comments || null
  await row.save()
  return { row }
}

export async function listMine({ userId, where = {}, offset, limit }) {
  const merged = { user_id: userId, ...where }
  return VacationRequest.findAndCountAll({
    where: merged, order: [['created_at','DESC']], offset, limit
  })
}

export async function listAll({ where = {}, search, offset, limit }) {
  const include = [{ model: User, attributes: ['id','name'], required: false }]
  const merged = { ...where }
  if (search) {
    include[0].where = { name: { [Op.like]: `%${search}%` } }
    merged[Op.or] = [
      { reason:   { [Op.like]: `%${search}%` } },
      { comments: { [Op.like]: `%${search}%` } }
    ]
  }
  return VacationRequest.findAndCountAll({
    where: merged, include, order: [['created_at','DESC']], offset, limit, distinct: true
  })
}

export async function getById(id) {
  return VacationRequest.findByPk(id)
}

export async function deleteById(row) {
  await row.destroy()
}
