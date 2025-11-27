const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 11]
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'birth_date'
  },
  // Gamificação
  level: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Preferências
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'BRL'
  },
  language: {
    type: DataTypes.STRING(5),
    defaultValue: 'pt-BR'
  },
  // Status
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'email_verified'
  },
  // Timestamps
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Método para verificar senha
User.prototype.checkPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Método para atualizar nível baseado em pontos
User.prototype.updateLevel = async function() {
  const { points } = this;
  let newLevel = 'bronze';
  
  if (points >= 15000) newLevel = 'platinum';
  else if (points >= 5000) newLevel = 'gold';
  else if (points >= 1000) newLevel = 'silver';
  
  if (this.level !== newLevel) {
    this.level = newLevel;
    await this.save();
  }
  
  return newLevel;
};

module.exports = User;
