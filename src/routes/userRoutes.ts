import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate } from '../controllers/authController';

const router = Router();

router.get('/view', authenticate, getUsers);
router.get('/view/:id', getUserById);
router.post('/create', createUser);
router.put('/modify/:id', updateUser);
router.delete('/clean/:id', deleteUser);

export default router;
