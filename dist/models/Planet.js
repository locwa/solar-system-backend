"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Planet extends sequelize_1.Model {
}
Planet.init({
    PlanetID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    Description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    Status: {
        type: sequelize_1.DataTypes.ENUM('Active', 'Terraforming', 'Destroyed'),
        allowNull: false,
        defaultValue: 'Active',
    },
    Population: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    CreatedBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // This refers to the table name
            key: 'UserID',
        },
    },
    CreatedByGalacticLeader: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    CreatedDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: 'Planets',
    sequelize: database_1.default,
    timestamps: true,
});
// Association
Planet.belongsTo(User_1.default, { foreignKey: 'CreatedBy', as: 'Creator' });
exports.default = Planet;
