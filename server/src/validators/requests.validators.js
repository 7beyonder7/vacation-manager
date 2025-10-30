import { body, param, query } from 'express-validator'
import { STATUS } from '../constants/status.js'

export const createRequestRules = [
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  body('reason').optional().isString().isLength({ max: 1000 })
]

export const listRules = [
  query('status').optional().isIn([STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED]),
  query('search').optional().isString()
]

export const decisionRules = [
  param('id').isInt({ min: 1 }),
  body('status').isIn([STATUS.APPROVED, STATUS.REJECTED]),
  body('comments').optional().isString().isLength({ max: 1000 })
]

export const idParamRules = [ param('id').isInt({ min: 1 }) ]
