import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as ctl from '../controllers/requests.controller.js'
import { createRequestRules, decisionRules, listRules, idParamRules } from '../validators/requests.validators.js'
import { requireRole } from '../middleware/auth.js'
import { ROLES } from '../constants/roles.js'

const router = Router()

router.post('/', createRequestRules, asyncHandler(ctl.create))
router.get('/mine', listRules, asyncHandler(ctl.listMine))
router.get('/check', asyncHandler(ctl.checkOverlap))
router.get('/', listRules, requireRole(ROLES.VALIDATOR), asyncHandler(ctl.listAll))
router.patch('/:id/decision', decisionRules, requireRole(ROLES.VALIDATOR), asyncHandler(ctl.decide))
router.delete('/:id', idParamRules, asyncHandler(ctl.destroy))

export default router
