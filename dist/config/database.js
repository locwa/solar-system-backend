"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseUrl = process.env.DATABASE_URL;
let sequelize;
if (databaseUrl) {
    sequelize = new sequelize_1.Sequelize(databaseUrl, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
    });
}
else {
    sequelize = new sequelize_1.Sequelize({
        dialect: 'postgres',
        logging: false,
    });
    console.warn('DATABASE_URL not set - database operations will fail at runtime');
}
exports.default = sequelize;
