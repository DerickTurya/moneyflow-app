const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  achievementId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'achievement_id',
    references: {
      model: 'achievements',
      key: 'id'
    }
  },
  unlockedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'unlocked_at'
  },
  // Progresso (para conquistas com múltiplos níveis)
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Progresso atual (ex: 5/10 dias)'
  },
  maxProgress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'max_progress',
    comment: 'Meta para completar (ex: 10 dias)'
  },
  // Notificação
  notified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Se usuário foi notificado'
  }
}, {
  tableName: 'user_achievements',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['achievement_id'] },
    { unique: true, fields: ['user_id', 'achievement_id'] }
  ]
});

// Método para calcular porcentagem de progresso
UserAchievement.prototype.getProgressPercentage = function() {
  if (this.maxProgress === 0) return 100;
  return Math.min((this.progress / this.maxProgress) * 100, 100);
};

module.exports = UserAchievement;
