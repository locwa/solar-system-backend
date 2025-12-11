"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database")); // Assuming you have a database connection setup here
class User extends sequelize_1.Model {
}
User.init({
    UserID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Username: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    Password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    FullName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    Role: {
        type: sequelize_1.DataTypes.ENUM('Citizen', 'Planetary Leader', 'Galactic Leader'),
        allowNull: false,
    },
    IsGalacticLeader: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    DateJoined: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: 'Users',
    sequelize: database_1.default, // This assumes you have an initialized Sequelize instance
    timestamps: true,
});
exports.default = User;
