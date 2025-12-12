"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const isProduction = process.env.NODE_ENV === 'production';
const sequelize = new sequelize_1.Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    ...(isProduction && {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
});
exports.default = sequelize;
