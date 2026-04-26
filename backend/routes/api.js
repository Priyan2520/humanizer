const express = require('express');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Entry = require('../models/Entry');
const { humanize } = require('../services/humanizer');

const router = express.Router();

// ─── Rate limiter ─────────────────────────────────────────────────────────────
const humanizeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests — take a breath and try again in a minute.' },
});

// ─── Validation middleware ─────────────────────────────────────────────────────
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ─── POST /api/humanize ───────────────────────────────────────────────────────
router.post(
  '/humanize',
  humanizeLimiter,
  body('text')
    .trim()
    .notEmpty().withMessage('Text cannot be empty.')
    .isLength({ min: 3, max: 5000 }).withMessage('Text must be between 3 and 5000 characters.'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { text } = req.body;
      const { humanizedText, transformCount, charDelta } = humanize(text);

      const entry = await Entry.create({
        originalText: text,
        humanizedText,
        transformCount,
        charDelta,
      });

      res.status(201).json({
        success: true,
        humanizedText,
        transformCount,
        charDelta,
        entry,
      });
    } catch (err) {
      console.error('POST /humanize error:', err);
      res.status(500).json({ success: false, error: 'Something went wrong on our end.' });
    }
  }
);

// ─── GET /api/entries ─────────────────────────────────────────────────────────
router.get('/entries', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, entries });
  } catch (err) {
    console.error('GET /entries error:', err);
    res.status(500).json({ success: false, error: 'Could not fetch entries.' });
  }
});

// ─── DELETE /api/entries/:id ──────────────────────────────────────────────────
router.delete(
  '/entries/:id',
  param('id').isMongoId().withMessage('Invalid entry ID.'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const entry = await Entry.findByIdAndDelete(req.params.id);
      if (!entry) {
        return res.status(404).json({ success: false, error: 'Entry not found.' });
      }
      res.json({ success: true, message: 'Entry deleted.' });
    } catch (err) {
      console.error('DELETE /entries/:id error:', err);
      res.status(500).json({ success: false, error: 'Could not delete entry.' });
    }
  }
);

// ─── DELETE /api/entries (clear all) ─────────────────────────────────────────
router.delete('/entries', async (req, res) => {
  try {
    await Entry.deleteMany({});
    res.json({ success: true, message: 'All entries cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not clear entries.' });
  }
});

module.exports = router;
