const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
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
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'category_id',
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('income', 'expense', 'transfer'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  // Informações adicionais
  merchant: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'pix', 'cash', 'bank_transfer', 'boleto'),
    allowNull: true,
    field: 'payment_method'
  },
  // Status
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'completed'
  },
  // Recorrência
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_recurring'
  },
  recurringFrequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
    allowNull: true,
    field: 'recurring_frequency'
  },
  // Cashback
  cashbackAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'cashback_amount'
  },
  cashbackPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'cashback_percentage'
  },
  // IA
  isAutoCategorized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_auto_categorized'
  },
  confidence: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: true,
    comment: 'Confiança da IA na categorização (0-1)'
  },
  // Anexos
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  // Metadados
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['category_id'] },
    { fields: ['date'] },
    { fields: ['type'] },
    { fields: ['status'] }
  ]
});

module.exports = Transaction;
