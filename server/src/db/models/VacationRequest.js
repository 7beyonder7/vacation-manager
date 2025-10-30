import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../index.js'
import { INT_UNSIGNED } from '../types.js'

import { STATUS } from '../../constants/status.js'

export class VacationRequest extends Model {}

VacationRequest.init({
  id: {
    type: INT_UNSIGNED(sequelize),
    autoIncrement: true,
    primaryKey: true,
    validate: { min: 0 }
  },
  user_id: {
    type: INT_UNSIGNED(sequelize),
    allowNull: false,
    validate: { min: 0 }  // Bonus: emulate unsigned in tests
  },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
  reason: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM(STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED),
    allowNull: false,
    defaultValue: STATUS.PENDING
  },
  comments: { type: DataTypes.TEXT }
}, {
  sequelize,
  tableName: 'vacation_requests',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
})