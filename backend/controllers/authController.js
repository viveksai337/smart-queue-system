const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Register
exports.register = async (req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered.',
            });
        }

        const existingPhone = await User.findOne({
            where: { phone },
        });

        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already registered.',
            });
        }

        const user = await User.create({
            name,
            phone,
            email,
            password_hash: password,
            role: role || 'user',
        });

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            data: {
                user: user.toJSON(),
                token,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed.',
            error: error.message,
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated.',
            });
        }

        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login successful!',
            data: {
                user: user.toJSON(),
                token,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed.',
            error: error.message,
        });
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            data: req.user.toJSON(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile.',
        });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        await req.user.update({ name, phone });

        res.json({
            success: true,
            message: 'Profile updated successfully!',
            data: req.user.toJSON(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile.',
        });
    }
};
