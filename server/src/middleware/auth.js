import { User } from '../db/models/User.js'
import { t } from '../constants/messages/index.js'

export async function demoAuth(req, res, next) {
  const id = req.headers['x-user-id']
  if (!id) return res.status(401).json({ error: t(req.headers['accept-language'], 'errors.authMissing') })
  const user = await User.findByPk(id)
  if (!user) return res.status(401).json({ error: t(req.headers['accept-language'], 'errors.authInvalid') })
  req.user = user
  next()
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: t(req.headers['accept-language'], 'errors.forbidden') })
    }
    next()
  }
}
