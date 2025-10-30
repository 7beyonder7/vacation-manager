import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../index.js'
import { INT_UNSIGNED } from '../types.js'   // helper from Option B
import { ROLES } from '../../constants/roles.js'

export class User extends Model {}

User.init({
  id: {
    type: INT_UNSIGNED(sequelize),
    autoIncrement: true,
    primaryKey: true,
    validate: { min: 0 }   // Bonus: emulate unsigned in tests
  },
  name: { type: DataTypes.STRING(100), allowNull: false },
  role: { type: DataTypes.ENUM(ROLES.REQUESTER, ROLES.VALIDATOR), allowNull: false }
}, {
  sequelize,
  tableName: 'users',
  underscored: true,
  timestamps: false
})

