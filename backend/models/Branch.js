const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Branch = sequelize.define('Branch', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'Hyderabad',
    },
    type: {
        type: DataTypes.ENUM('bank', 'government', 'hospital', 'rto', 'passport', 'hotel'),
        allowNull: false,
        defaultValue: 'hospital',
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'government',
        comment: 'government, private, specialty',
    },
    total_counters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 },
    },
    active_counters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 0 },
    },
    avg_service_time: {
        type: DataTypes.FLOAT,
        defaultValue: 10.0,
        comment: 'Average service time in minutes',
    },
    opening_time: {
        type: DataTypes.TIME,
        defaultValue: '09:00:00',
    },
    closing_time: {
        type: DataTypes.TIME,
        defaultValue: '17:00:00',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
    },
}, {
    tableName: 'branches',
    indexes: [
        { fields: ['city'] },
        { fields: ['type'] },
        { fields: ['category'] },
    ],
});

module.exports = Branch;
