const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QueueLog = sequelize.define('QueueLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    token_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tokens', key: 'id' },
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'branches', key: 'id' },
    },
    counter_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    actual_start_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    actual_end_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    waiting_duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Total waiting time in minutes',
    },
    service_duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Total service time in minutes',
    },
    status: {
        type: DataTypes.ENUM('completed', 'cancelled', 'skipped'),
        allowNull: false,
    },
}, {
    tableName: 'queue_logs',
    indexes: [
        { fields: ['branch_id', 'created_at'] },
    ],
});

module.exports = QueueLog;
