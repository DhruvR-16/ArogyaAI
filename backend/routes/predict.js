import express from 'express';
import { protect } from '../utils/authMiddleware.js';
import { predictDisease } from '../controllers/predictController.js';

const router = express.Router();

router.post('/', protect, predictDisease);

export default router;
