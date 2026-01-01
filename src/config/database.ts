import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'dreemz';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    define: {
        timestamps: true, // Adds createdAt, updatedAt automatically
        underscored: true // snake_case columns
    }
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('🔌 Database connected (Sequelize)');

        // Sync models (in prod, use migrations instead of sync({ alter: true }))
        await sequelize.sync({ alter: true });
        console.log('📦 Database synced');
    } catch (error) {
        console.error('Fatal: Unable to connect to the database:', error);
        process.exit(1);
    }
};
