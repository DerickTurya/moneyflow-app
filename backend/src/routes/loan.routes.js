const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Placeholder routes - A implementar

router.post('/apply', authMiddleware, (req, res) => {
  res.json({ message: 'Loan application endpoint' });
});

module.exports = router;
