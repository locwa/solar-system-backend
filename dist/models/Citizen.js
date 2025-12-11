"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Planet_1 = __importDefault(require("./Planet"));
class Citizen extends sequelize_1.Model {
}
Citizen.init({
    CitizenID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Users', // Refers to the table name
            key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    PlanetID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Planets', // Refers to the table name
            key: 'PlanetID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    CitizenshipStartDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: 'Citizens',
    sequelize: database_1.default,
    timestamps: true,
});
// Associations
Citizen.belongsTo(User_1.default, { foreignKey: 'CitizenID', as: 'User' });
Citizen.belongsTo(Planet_1.default, { foreignKey: 'PlanetID', as: 'Planet' });
exports.default = Citizen;
