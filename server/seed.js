import dotenv from 'dotenv';
import { sequelize } from './src/db/index.js';
import { User } from './src/db/models/User.js';
import { VacationRequest } from './src/db/models/VacationRequest.js';
import { STATUS } from '../server/src/constants/status.js'

dotenv.config();
async function seed() {
  await sequelize.sync({ force: true });
  const [paul, bob] = await Promise.all([
    User.create({ name: 'Paul', role: 'Requester' }),
    User.create({ name: 'Bob', role: 'Validator' })
  ]);
  await VacationRequest.bulkCreate([
    { user_id: paul.id, start_date: '2025-11-10', end_date: '2025-11-15', reason: 'Family trip', status: STATUS.PENDING },
    { user_id: paul.id, start_date: '2025-12-01', end_date: '2025-12-05', reason: 'Conference', status: STATUS.APPROVED, comments: 'Enjoy!' }
  ]);
  console.log('Seed complete.');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
