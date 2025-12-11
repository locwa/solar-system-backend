"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_json_1 = __importDefault(require("./config.json"));
const env = process.env.NODE_ENV || 'development';
const dbConfig = config_json_1.default[env];
const sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username || '', dbConfig.password || '', {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: false,
});
exports.default = sequelize;
