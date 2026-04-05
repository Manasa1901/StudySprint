import express from 'express';
import { getSubjects, createSubject } from '../controllers/SubjectController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getSubjects);
router.post('/', authMiddleware, createSubject);

export default router;