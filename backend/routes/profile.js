import express from 'express';
import { protect } from '../utils/authMiddleware.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profileController.js';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.delete('/', protect, deleteProfile);

export default router;
