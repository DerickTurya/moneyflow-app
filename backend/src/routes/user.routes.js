const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Placeholder para rotas de usuário

// GET /api/v1/users/profile
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { User } = require('../models');
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/users/profile
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { User } = require('../models');
    const { name, phone, birthDate, avatar } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.update({ name, phone, birthDate, avatar });

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
