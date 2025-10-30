import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB, sequelize } from './db/index.js'
import { applyAssociations } from './db/associations.js'
import './db/models/VacationRequest.js'
import requests from './routes/requests.routes.js'
import users from './routes/users.routes.js';
import { demoAuth } from './middleware/auth.js'

dotenv.config()
const app = express()
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use(demoAuth)
app.use('/api/users', users);
app.use('/api/requests', requests);

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    await connectDB()
    applyAssociations()
    await sequelize.sync()
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => console.log(`API http://localhost:${PORT}`))
  })()
}

process.on('SIGINT', async () => { await sequelize.close(); process.exit(0) })
process.on('SIGTERM', async () => { await sequelize.close(); process.exit(0) })

export default app