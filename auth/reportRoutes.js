import express from 'express';
import { pool } from './db.js';
import { protect } from './authMiddleware.js';

const router = express.Router();


router.post('/reports', protect, async (req, res) => {
  try {
    const { analysis_id, report_type } = req.body;

    if (!analysis_id) {
      return res.status(400).json({ error: 'Analysis ID is required' });
    }


    const analysisCheck = await pool.query(
      `SELECT a.*, u.original_filename
       FROM analyses a
       JOIN uploads u ON a.upload_id = u.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [analysis_id, req.user.id]
    );

    if (analysisCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = analysisCheck.rows[0];

    if (analysis.status !== 'completed') {
      return res.status(400).json({ error: 'Analysis not completed yet' });
    }


    const reportData = {
      analysis_id: analysis.id,
      filename: analysis.original_filename,
      analysis_date: analysis.completed_at,
      results: analysis.results,
      report_type: report_type || 'summary',
      generated_at: new Date().toISOString()
    };

    const reportResult = await pool.query(
      `INSERT INTO reports (user_id, analysis_id, report_data, report_type, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [
        req.user.id,
        analysis_id,
        JSON.stringify(reportData),
        report_type || 'summary'
      ]
    );

    res.status(201).json({
      message: 'Report generated successfully',
      report: reportResult.rows[0]
    });
  } catch (err) {
    console.error('Generate report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, a.id as analysis_id, u.original_filename
       FROM reports r
       JOIN analyses a ON r.analysis_id = a.id
       JOIN uploads u ON a.upload_id = u.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    res.json({ reports: result.rows });
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/:id', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, a.id as analysis_id, u.original_filename, u.file_type
       FROM reports r
       JOIN analyses a ON r.analysis_id = a.id
       JOIN uploads u ON a.upload_id = u.id
       WHERE r.id = $1 AND r.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ report: result.rows[0] });
  } catch (err) {
    console.error('Get report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM reports WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Delete report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
export default router;

