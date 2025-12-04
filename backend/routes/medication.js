import express from 'express';
import { protect } from '../utils/authMiddleware.js';
import { getMedications, addMedication, updateMedication, deleteMedication } from '../controllers/medicationController.js';

const router = express.Router();

router.get('/', protect, getMedications);
router.post('/', protect, addMedication);
router.put('/:id', protect, updateMedication);
router.delete('/:id', protect, deleteMedication);

export default router;
