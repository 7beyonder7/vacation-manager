import { sequelize } from '../src/db/index.js';
import { applyAssociations } from '../src/db/associations.js';
import '../src/db/models/User.js';
import '../src/db/models/VacationRequest.js';
import { STATUS } from '../src/constants/status.js'

export async function resetDb() {
  applyAssociations();
  await sequelize.sync({ force: true });
}

export async function createUser(attrs = {}) {
  const { User } = await import('../src/db/models/User.js');
  return User.create({ name: 'User', role: 'Requester', ...attrs });
}

export async function createReq(attrs = {}) {
  const { VacationRequest } = await import('../src/db/models/VacationRequest.js');
  return VacationRequest.create({
    user_id: attrs.user_id,
    start_date: '2025-11-10',
    end_date: '2025-11-12',
    reason: null,
    status: STATUS.PENDING,
    comments: null,
    ...attrs
  });
}
