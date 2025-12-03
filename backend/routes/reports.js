import express from 'express';
import { protect } from '../utils/authMiddleware.js';
import { getReports, deleteReport } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/', protect, getReports);
router.delete('/:id', protect, deleteReport);

export default router;
