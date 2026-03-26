const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

// Use SQLite for demo/development if DB_DIALECT is set to sqlite or MySQL is not configured
const useMySQL = process.env.DB_DIALECT !== 'sqlite' &&
    process.env.DB_PASSWORD &&
    process.env.DB_PASSWORD !== 'your_password_here';

if (useMySQL) {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            define: {
                timestamps: true,
                underscored: true,
            },
        }
    );
} else {
    // SQLite fallback for demo
    const dbPath = path.join(__dirname, '..', 'sqms_demo.sqlite');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
        },
    });
    console.log('📦 Using SQLite database (demo mode)');
}

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Database connected successfully (${useMySQL ? 'MySQL' : 'SQLite'})`);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
