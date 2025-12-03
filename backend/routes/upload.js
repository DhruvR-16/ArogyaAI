import express from 'express';
import multer from 'multer';
import { protect } from '../utils/authMiddleware.js';
import { uploadReport, getUploadedReports } from '../controllers/uploadController.js';

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload-report', protect, upload.single('file'), uploadReport);
router.get('/uploaded-reports', protect, getUploadedReports);

export default router;
