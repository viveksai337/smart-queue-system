const { Token, Branch, User, QueueLog } = require('../models');
const { Op } = require('sequelize');
const { generateTokenNumber, generateQRCode, calculateEstimatedTime, getPeakHourFactor, getCategoryPrefix, getPurposeOptions } = require('../utils/helpers');
const { sendTokenBookedNotification, sendTokenNotification } = require('../utils/sms');

// Get purpose options for a branch
exports.getPurposes = async (req, res) => {
    try {
        const branch = await Branch.findByPk(req.params.branchId);
        if (!branch) {
            return res.status(404).json({ success: false, message: 'Branch not found.' });
        }
        const purposes = getPurposeOptions(branch.type);
        res.json({
            success: true,
            data: purposes,
            branch_type: branch.type,
            category_prefix: getCategoryPrefix(branch.type),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch purposes.' });
    }
};

// Book a token
exports.bookToken = async (req, res) => {
    try {
        const { branch_id, service_type, priority, purpose, candidate_name } = req.body;
        const userId = req.userId;

        // Check if user already has a waiting token
        const existingToken = await Token.findOne({
            where: {
                user_id: userId,
                status: { [Op.in]: ['waiting', 'serving'] },
            },
        });

        if (existingToken) {
            return res.status(400).json({
                success: false,
                message: 'You already have an active token. Please cancel or complete it first.',
                data: existingToken,
            });
        }

        // Get branch info
        const branch = await Branch.findByPk(branch_id);
        if (!branch || !branch.is_active) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found or inactive.',
            });
        }

        // Get user info for candidate name
        const user = await User.findByPk(userId);
        const finalCandidateName = candidate_name || user?.name || 'Guest';

        // Get category prefix
        const prefix = getCategoryPrefix(branch.type);

        // Get today's token count for display number (category-wise per branch)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await Token.count({
            where: {
                branch_id,
                created_at: { [Op.gte]: today },
            },
        });

        const displayNumber = todayCount + 1;
        const tokenNumber = generateTokenNumber(branch_id, branch.type);
        const qrCode = generateQRCode();

        // Calculate estimated time
        const waitingCount = await Token.count({
            where: { branch_id, status: 'waiting' },
        });

        const peakFactor = getPeakHourFactor();
        const estimatedTime = Math.ceil(
            calculateEstimatedTime(waitingCount, branch.avg_service_time, branch.active_counters) * peakFactor
        );

        const token = await Token.create({
            user_id: userId,
            branch_id,
            token_number: tokenNumber,
            display_number: displayNumber,
            category_prefix: prefix,
            candidate_name: finalCandidateName,
            purpose: purpose || 'General Service',
            status: 'waiting',
            estimated_time: estimatedTime,
            service_type: service_type || 'General',
            priority: priority || 'normal',
            qr_code: qrCode,
        });

        // Get full token with associations
        const fullToken = await Token.findByPk(token.id, {
            include: [
                { model: Branch, as: 'branch', attributes: ['name', 'location', 'type', 'city'] },
                { model: User, as: 'user', attributes: ['name', 'phone'] },
            ],
        });

        // Send SMS notification
        if (user && user.phone) {
            await sendTokenBookedNotification(user.phone, `${prefix}-${String(displayNumber).padStart(3, '0')}`, branch.name, waitingCount + 1);
        }

        // Emit socket event
        if (req.app.get('io')) {
            req.app.get('io').to(`branch_${branch_id}`).emit('queue_updated', {
                branch_id,
                action: 'token_booked',
                token: fullToken,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Token booked successfully!',
            data: {
                token: fullToken,
                display_token: `${prefix}-${String(displayNumber).padStart(3, '0')}`,
                position: waitingCount + 1,
                estimated_time: estimatedTime,
            },
        });
    } catch (error) {
        console.error('Book token error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book token.',
            error: error.message,
        });
    }
};

// Get user's active tokens
exports.getMyTokens = async (req, res) => {
    try {
        const tokens = await Token.findAll({
            where: { user_id: req.userId },
            include: [
                { model: Branch, as: 'branch', attributes: ['name', 'location', 'type'] },
            ],
            order: [['created_at', 'DESC']],
            limit: 20,
        });

        // Add position info for waiting tokens
        const tokensWithPosition = await Promise.all(
            tokens.map(async (token) => {
                if (token.status === 'waiting') {
                    const position = await Token.count({
                        where: {
                            branch_id: token.branch_id,
                            status: 'waiting',
                            created_at: { [Op.lt]: token.created_at },
                        },
                    });
                    return { ...token.toJSON(), position: position + 1 };
                }
                return { ...token.toJSON(), position: 0 };
            })
        );

        res.json({
            success: true,
            data: tokensWithPosition,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tokens.',
        });
    }
};

// Cancel token
exports.cancelToken = async (req, res) => {
    try {
        const token = await Token.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId,
                status: 'waiting',
            },
        });

        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token not found or cannot be cancelled.',
            });
        }

        await token.update({ status: 'cancelled' });

        // Log cancellation
        await QueueLog.create({
            token_id: token.id,
            branch_id: token.branch_id,
            status: 'cancelled',
            waiting_duration: (new Date() - token.created_at) / 60000,
        });

        // Emit socket event
        if (req.app.get('io')) {
            req.app.get('io').to(`branch_${token.branch_id}`).emit('queue_updated', {
                branch_id: token.branch_id,
                action: 'token_cancelled',
                token_id: token.id,
            });
        }

        res.json({
            success: true,
            message: 'Token cancelled successfully!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to cancel token.',
        });
    }
};

// Get live queue for a branch
exports.getLiveQueue = async (req, res) => {
    try {
        const { branch_id } = req.params;

        const waitingTokens = await Token.findAll({
            where: { branch_id, status: 'waiting' },
            include: [
                { model: User, as: 'user', attributes: ['name', 'phone'] },
            ],
            order: [
                ['priority', 'ASC'],
                ['created_at', 'ASC'],
            ],
        });

        const servingTokens = await Token.findAll({
            where: { branch_id, status: 'serving' },
            include: [
                { model: User, as: 'user', attributes: ['name', 'phone'] },
            ],
            order: [['created_at', 'ASC']],
        });

        const branch = await Branch.findByPk(branch_id);

        res.json({
            success: true,
            data: {
                branch: branch ? branch.toJSON() : null,
                waiting: waitingTokens,
                serving: servingTokens,
                waiting_count: waitingTokens.length,
                serving_count: servingTokens.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch live queue.',
        });
    }
};

// Call next token (Admin)
exports.callNext = async (req, res) => {
    try {
        const { branch_id, counter_id } = req.body;

        // Complete any currently serving token on this counter
        await Token.update(
            { status: 'completed' },
            {
                where: {
                    branch_id,
                    counter_id,
                    status: 'serving',
                },
            }
        );

        // Get next waiting token (priority first)
        const nextToken = await Token.findOne({
            where: { branch_id, status: 'waiting' },
            include: [
                { model: User, as: 'user', attributes: ['name', 'phone'] },
            ],
            order: [
                ['priority', 'ASC'],
                ['created_at', 'ASC'],
            ],
        });

        if (!nextToken) {
            return res.json({
                success: true,
                message: 'No more tokens in queue.',
                data: null,
            });
        }

        await nextToken.update({
            status: 'serving',
            counter_id,
        });

        // Log start time
        await QueueLog.create({
            token_id: nextToken.id,
            branch_id,
            counter_id,
            actual_start_time: new Date(),
            status: 'completed',
            waiting_duration: (new Date() - nextToken.created_at) / 60000,
        });

        // Send SMS to user
        if (nextToken.user && nextToken.user.phone) {
            await sendTokenNotification(
                nextToken.user.phone,
                nextToken.token_number,
                'your branch',
                0
            );
        }

        // Notify next 3 users
        const upcomingTokens = await Token.findAll({
            where: { branch_id, status: 'waiting' },
            include: [{ model: User, as: 'user', attributes: ['phone'] }],
            order: [['priority', 'ASC'], ['created_at', 'ASC']],
            limit: 3,
        });

        for (const upcoming of upcomingTokens) {
            if (upcoming.user && upcoming.user.phone) {
                const position = upcomingTokens.indexOf(upcoming) + 1;
                const branch = await Branch.findByPk(branch_id);
                await sendTokenNotification(
                    upcoming.user.phone,
                    upcoming.token_number,
                    branch ? branch.name : 'branch',
                    position * (branch ? branch.avg_service_time : 10)
                );
            }
        }

        // Emit socket event
        if (req.app.get('io')) {
            req.app.get('io').to(`branch_${branch_id}`).emit('queue_updated', {
                branch_id,
                action: 'next_called',
                token: nextToken,
                counter_id,
            });
        }

        res.json({
            success: true,
            message: `Token ${nextToken.display_number} called to counter ${counter_id}!`,
            data: nextToken,
        });
    } catch (error) {
        console.error('Call next error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to call next token.',
        });
    }
};

// Complete token (Admin)
exports.completeToken = async (req, res) => {
    try {
        const token = await Token.findByPk(req.params.id);
        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token not found.',
            });
        }

        await token.update({ status: 'completed' });

        // Update queue log
        const log = await QueueLog.findOne({
            where: { token_id: token.id },
            order: [['created_at', 'DESC']],
        });

        if (log) {
            await log.update({
                actual_end_time: new Date(),
                service_duration: log.actual_start_time
                    ? (new Date() - log.actual_start_time) / 60000
                    : 0,
            });
        }

        // Emit socket event
        if (req.app.get('io')) {
            req.app.get('io').to(`branch_${token.branch_id}`).emit('queue_updated', {
                branch_id: token.branch_id,
                action: 'token_completed',
                token_id: token.id,
            });
        }

        res.json({
            success: true,
            message: 'Token completed!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to complete token.',
        });
    }
};

// Skip token (Admin)
exports.skipToken = async (req, res) => {
    try {
        const token = await Token.findByPk(req.params.id);
        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token not found.',
            });
        }

        await token.update({ status: 'skipped' });

        await QueueLog.create({
            token_id: token.id,
            branch_id: token.branch_id,
            status: 'skipped',
            waiting_duration: (new Date() - token.created_at) / 60000,
        });

        // Emit socket event
        if (req.app.get('io')) {
            req.app.get('io').to(`branch_${token.branch_id}`).emit('queue_updated', {
                branch_id: token.branch_id,
                action: 'token_skipped',
                token_id: token.id,
            });
        }

        res.json({
            success: true,
            message: 'Token skipped!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to skip token.',
        });
    }
};

// Get token by QR code
exports.getTokenByQR = async (req, res) => {
    try {
        const token = await Token.findOne({
            where: { qr_code: req.params.code },
            include: [
                { model: Branch, as: 'branch', attributes: ['name', 'location', 'type'] },
                { model: User, as: 'user', attributes: ['name'] },
            ],
        });

        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token not found.',
            });
        }

        let position = 0;
        if (token.status === 'waiting') {
            position = await Token.count({
                where: {
                    branch_id: token.branch_id,
                    status: 'waiting',
                    created_at: { [Op.lt]: token.created_at },
                },
            }) + 1;
        }

        res.json({
            success: true,
            data: { ...token.toJSON(), position },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch token.',
        });
    }
};
