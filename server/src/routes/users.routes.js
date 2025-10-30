import { Router } from 'express';
import { User } from '../db/models/User.js';

const router = Router();
router.get('/', async (_req, res) => {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  res.json(users);
});
export default router;
