import { Router } from 'express';
import { createPost, getPosts, getPostById, deletePost } from '../controllers/postController';
import { authenticate } from '../controllers/authController';

const router = Router();

router.post('/create', authenticate, createPost);
router.get('/view', getPosts);
router.get('/view/:id', getPostById);
router.delete('/clean/:id', authenticate, deletePost);

export default router;
