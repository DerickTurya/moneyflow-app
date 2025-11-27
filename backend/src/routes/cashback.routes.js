const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Placeholder routes - A implementar

router.get('/offers', authMiddleware, (req, res) => {
  res.json({ message: 'Cashback offers endpoint' });
});

module.exports = router;
