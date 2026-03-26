const { Branch, Token } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Get all branches
exports.getAllBranches = async (req, res) => {
    try {
        const { type, search, city, category } = req.query;
        const where = { is_active: true };

        if (type) where.type = type;
        if (city) where.city = city;
        if (category) where.category = category;
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } },
            ];
        }

        const branches = await Branch.findAll({ where, order: [['city', 'ASC'], ['category', 'ASC'], ['name', 'ASC']] });

        // Add live queue count
        const branchesWithQueue = await Promise.all(
            branches.map(async (branch) => {
                const waitingCount = await Token.count({
                    where: { branch_id: branch.id, status: 'waiting' },
                });
                const servingCount = await Token.count({
                    where: { branch_id: branch.id, status: 'serving' },
                });
                return {
                    ...branch.toJSON(),
                    waiting_count: waitingCount,
                    serving_count: servingCount,
                };
            })
        );

        res.json({
            success: true,
            data: branchesWithQueue,
            total: branchesWithQueue.length,
        });
    } catch (error) {
        console.error('Get branches error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch branches.',
        });
    }
};

// Get available cities
exports.getCities = async (req, res) => {
    try {
        const cities = await Branch.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('city')), 'city']],
            where: { is_active: true },
            order: [['city', 'ASC']],
            raw: true,
        });
        res.json({
            success: true,
            data: cities.map(c => c.city).filter(Boolean),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cities.',
        });
    }
};

// Get branch by ID
exports.getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findByPk(req.params.id);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found.',
            });
        }

        const waitingCount = await Token.count({
            where: { branch_id: branch.id, status: 'waiting' },
        });
        const servingCount = await Token.count({
            where: { branch_id: branch.id, status: 'serving' },
        });

        res.json({
            success: true,
            data: {
                ...branch.toJSON(),
                waiting_count: waitingCount,
                serving_count: servingCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch branch.',
        });
    }
};

// Create branch (Admin)
exports.createBranch = async (req, res) => {
    try {
        const {
            name, location, city, type, category, total_counters,
            active_counters, avg_service_time,
            opening_time, closing_time, latitude, longitude,
        } = req.body;

        const branch = await Branch.create({
            name,
            location,
            city: city || 'Hyderabad',
            type: type || 'hospital',
            category: category || 'government',
            total_counters: total_counters || 1,
            active_counters: active_counters || 1,
            avg_service_time: avg_service_time || 10,
            opening_time,
            closing_time,
            latitude,
            longitude,
        });

        res.status(201).json({
            success: true,
            message: 'Branch created successfully!',
            data: branch,
        });
    } catch (error) {
        console.error('Create branch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create branch.',
            error: error.message,
        });
    }
};

// Update branch (Admin)
exports.updateBranch = async (req, res) => {
    try {
        const branch = await Branch.findByPk(req.params.id);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found.',
            });
        }

        await branch.update(req.body);

        res.json({
            success: true,
            message: 'Branch updated successfully!',
            data: branch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update branch.',
        });
    }
};

// Delete branch (Admin)
exports.deleteBranch = async (req, res) => {
    try {
        const branch = await Branch.findByPk(req.params.id);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found.',
            });
        }

        await branch.update({ is_active: false });

        res.json({
            success: true,
            message: 'Branch deactivated successfully!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete branch.',
        });
    }
};
