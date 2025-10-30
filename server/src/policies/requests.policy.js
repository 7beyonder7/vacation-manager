import { ROLES } from '../constants/roles.js'
import { STATUS } from '../constants/status.js'

export function canListAll(user) {
  return user.role === ROLES.VALIDATOR
}

export function canDelete(user, request) {
  if (user.role === ROLES.REQUESTER) {
    return request.status === STATUS.PENDING && request.user_id === user.id
  }
  if (user.role === ROLES.VALIDATOR) {
    return request.status !== STATUS.APPROVED
  }
  return false
}
