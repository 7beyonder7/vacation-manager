import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

// Use SQLite if we're in tests OR explicitly asked for it
const isTest =
  process.env.NODE_ENV === 'test' ||
  process.env.DB_DIALECT === 'sqlite' ||
  !!process.env.JEST_WORKER_ID

export const sequelize = isTest
  ? new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false,
    })

export async function connectDB() {
  await sequelize.authenticate()
  return sequelize
}
