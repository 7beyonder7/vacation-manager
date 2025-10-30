import { User } from './models/User.js'
import { VacationRequest } from './models/VacationRequest.js'

export function applyAssociations() {
  User.hasMany(VacationRequest, { foreignKey: 'user_id' })
  VacationRequest.belongsTo(User, { foreignKey: 'user_id' })
}
