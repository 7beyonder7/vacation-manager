import { DataTypes } from 'sequelize'

export function INT_UNSIGNED(sequelize) {
  return sequelize.getDialect() === 'mysql'
    ? DataTypes.INTEGER.UNSIGNED
    : DataTypes.INTEGER
}
