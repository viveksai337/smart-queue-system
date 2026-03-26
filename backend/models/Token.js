const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'branches', key: 'id' },
    },
    token_number: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    display_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_prefix: {
        type: DataTypes.STRING(10),
        defaultValue: 'GEN',
        comment: 'HOS, BNK, GOV, RTO, PSP, HTL',
    },
    candidate_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    purpose: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: 'Purpose of visit like Aadhar Update, Account Opening, etc.',
    },
    status: {
        type: DataTypes.ENUM('waiting', 'serving', 'completed', 'cancelled', 'skipped'),
        defaultValue: 'waiting',
    },
    estimated_time: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        comment: 'Estimated waiting time in minutes',
    },
    counter_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Counter number where serving',
    },
    service_type: {
        type: DataTypes.STRING(100),
        defaultValue: 'General',
    },
    priority: {
        type: DataTypes.ENUM('normal', 'priority', 'vip'),
        defaultValue: 'normal',
    },
    qr_code: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'tokens',
    indexes: [
        { fields: ['branch_id', 'status'] },
        { fields: ['user_id', 'status'] },
        { fields: ['token_number'] },
    ],
});

module.exports = Token;
