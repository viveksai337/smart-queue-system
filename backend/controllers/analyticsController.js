const { Token, QueueLog, Branch, User } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/database');

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalUsers = await User.count();
        const totalBranches = await Branch.count({ where: { is_active: true } });

        const todayTokens = await Token.count({
            where: { created_at: { [Op.gte]: today } },
        });

        const activeTokens = await Token.count({
            where: { status: { [Op.in]: ['waiting', 'serving'] } },
        });

        const completedToday = await Token.count({
            where: {
                status: 'completed',
                created_at: { [Op.gte]: today },
            },
        });

        const cancelledToday = await Token.count({
            where: {
                status: 'cancelled',
                created_at: { [Op.gte]: today },
            },
        });

        // Average wait time today
        const avgWait = await QueueLog.findOne({
            attributes: [
                [fn('AVG', col('waiting_duration')), 'avg_wait'],
            ],
            where: {
                created_at: { [Op.gte]: today },
                status: 'completed',
            },
            raw: true,
        });

        // Average service time today
        const avgService = await QueueLog.findOne({
            attributes: [
                [fn('AVG', col('service_duration')), 'avg_service'],
            ],
            where: {
                created_at: { [Op.gte]: today },
                status: 'completed',
            },
            raw: true,
        });

        res.json({
            success: true,
            data: {
                total_users: totalUsers,
                total_branches: totalBranches,
                today_tokens: todayTokens,
                active_tokens: activeTokens,
                completed_today: completedToday,
                cancelled_today: cancelledToday,
                avg_wait_time: avgWait ? parseFloat(avgWait.avg_wait || 0).toFixed(1) : '0.0',
                avg_service_time: avgService ? parseFloat(avgService.avg_service || 0).toFixed(1) : '0.0',
            },
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats.',
        });
    }
};

// Hourly distribution for today
exports.getHourlyDistribution = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tokens = await Token.findAll({
            where: { created_at: { [Op.gte]: today } },
            attributes: ['created_at'],
            raw: true,
        });

        const hourly = Array(24).fill(0);
        tokens.forEach(token => {
            const hour = new Date(token.created_at).getHours();
            hourly[hour]++;
        });

        const data = hourly.map((count, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            tokens: count,
        }));

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hourly distribution.',
        });
    }
};

// Weekly trends
exports.getWeeklyTrends = async (req, res) => {
    try {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = await Token.count({
                where: {
                    created_at: {
                        [Op.gte]: date,
                        [Op.lt]: nextDate,
                    },
                },
            });

            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            data.push({
                day: days[date.getDay()],
                date: date.toISOString().split('T')[0],
                tokens: count,
            });
        }

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weekly trends.',
        });
    }
};

// Branch-wise stats
exports.getBranchStats = async (req, res) => {
    try {
        const branches = await Branch.findAll({
            where: { is_active: true },
            attributes: ['id', 'name', 'type'],
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = await Promise.all(
            branches.map(async (branch) => {
                const waiting = await Token.count({
                    where: { branch_id: branch.id, status: 'waiting' },
                });
                const serving = await Token.count({
                    where: { branch_id: branch.id, status: 'serving' },
                });
                const completedToday = await Token.count({
                    where: {
                        branch_id: branch.id,
                        status: 'completed',
                        created_at: { [Op.gte]: today },
                    },
                });

                return {
                    branch_id: branch.id,
                    branch_name: branch.name,
                    branch_type: branch.type,
                    waiting,
                    serving,
                    completed_today: completedToday,
                };
            })
        );

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch branch stats.',
        });
    }
};

// Peak hour analysis
exports.getPeakHourAnalysis = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const tokens = await Token.findAll({
            where: { created_at: { [Op.gte]: thirtyDaysAgo } },
            attributes: ['created_at'],
            raw: true,
        });

        const hourly = Array(24).fill(0);
        tokens.forEach(token => {
            const hour = new Date(token.created_at).getHours();
            hourly[hour]++;
        });

        const totalDays = 30;
        const peakData = hourly.map((count, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            avg_tokens: parseFloat((count / totalDays).toFixed(1)),
            total_tokens: count,
            is_peak: (count / totalDays) > (tokens.length / (totalDays * 24)) * 1.5,
        }));

        res.json({
            success: true,
            data: peakData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch peak hour analysis.',
        });
    }
};
