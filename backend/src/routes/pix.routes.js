const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Placeholder routes - A implementar

router.post('/transfer', authMiddleware, (req, res) => {
  res.json({ message: 'PIX transfer endpoint' });
});

module.exports = router;
