import express from 'express';
import { pool } from './db.js';
import { protect } from './authMiddleware.js';

const router = express.Router();

// 🔹 START ANALYSIS
router.post('/analyze', protect, async (req, res) => {
  try {
    const { upload_id } = req.body;

    if (!upload_id) {
      return res.status(400).json({ error: 'Upload ID is required' });
    }

    // Verify upload belongs to user
    const uploadCheck = await pool.query(
      'SELECT * FROM uploads WHERE id = $1 AND user_id = $2',
      [upload_id, req.user.id]
    );

    if (uploadCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    // Create analysis record
    const analysisResult = await pool.query(
      `INSERT INTO analyses (user_id, upload_id, status, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [req.user.id, upload_id, 'processing']
    );

    // Update upload status
    await pool.query(
      'UPDATE uploads SET status = $1 WHERE id = $2',
      ['analyzing', upload_id]
    );

    // Simulate ML analysis (replace with actual ML model integration)
    setTimeout(async () => {
      const predictions = {
        diseases: [
          { name: 'Normal', confidence: 0.85 },
          { name: 'Potential Issue', confidence: 0.15 }
        ],
        recommendations: [
          'Continue regular checkups',
          'Monitor symptoms if any'
        ],
        risk_level: 'low'
      };

      await pool.query(
        `UPDATE analyses 
         SET status = $1, results = $2, completed_at = NOW()
         WHERE id = $3`,
        ['completed', JSON.stringify(predictions), analysisResult.rows[0].id]
      );

      await pool.query(
        'UPDATE uploads SET status = $1 WHERE id = $2',
        ['analyzed', upload_id]
      );
    }, 3000);

    res.status(201).json({
      message: 'Analysis started',
      analysis: analysisResult.rows[0]
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔹 GET ANALYSIS STATISTICS (must come before /:id)
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await pool.query(
      `SELECT 
        COUNT(*) as total_analyses,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
       FROM analyses
       WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({ stats: stats.rows[0] });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔹 GET ANALYSIS RESULTS
router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.original_filename, u.file_type
       FROM analyses a
       JOIN uploads u ON a.upload_id = u.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );

    res.json({ analyses: result.rows });
  } catch (err) {
    console.error('Get analyses error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔹 GET SINGLE ANALYSIS
router.get('/:id', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.original_filename, u.file_type, u.file_path
       FROM analyses a
       JOIN uploads u ON a.upload_id = u.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ analysis: result.rows[0] });
  } catch (err) {
    console.error('Get analysis error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

