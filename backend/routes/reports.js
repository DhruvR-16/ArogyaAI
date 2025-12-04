import express from 'express';
import { protect } from '../utils/authMiddleware.js';
import { getReports, deleteReport, updateReport } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/', protect, getReports);
router.delete('/:id', protect, deleteReport);
router.put('/:id', protect, updateReport);

export default router;
