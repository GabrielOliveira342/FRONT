import express from 'express';
import { createArticle, getArticles, updateArticle, deleteArticle, getArticleById } from '../controllers/articleController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createArticle);
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.put('/:id', authMiddleware, upload.single('image'), updateArticle);
router.delete('/:id', authMiddleware, deleteArticle);

export default router;