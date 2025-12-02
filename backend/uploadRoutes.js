import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from './db.js';
import { protect } from './authMiddleware.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|dicom/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
  }
});


router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { fileType, description } = req.body;
    
    const result = await pool.query(
      `INSERT INTO uploads (user_id, filename, original_filename, file_path, file_type, file_size, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user.id,
        req.file.filename,
        req.file.originalname,
        req.file.path,
        fileType || 'medical_image',
        req.file.size,
        description || '',
        'uploaded'
      ]
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      upload: result.rows[0]
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error during upload' });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, original_filename, file_type, file_size, description, status, created_at
       FROM uploads
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ uploads: result.rows });
  } catch (err) {
    console.error('Get uploads error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM uploads WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    res.json({ upload: result.rows[0] });
  } catch (err) {
    console.error('Get upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT file_path FROM uploads WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Upload not found' });
    }


    const filePath = result.rows[0].file_path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }


    await pool.query('DELETE FROM uploads WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.user.id
    ]);

    res.json({ message: 'Upload deleted successfully' });
  } catch (err) {
    console.error('Delete upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;