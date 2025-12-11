"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Planet_1 = __importDefault(require("./Planet"));
class PlanetaryLeader extends sequelize_1.Model {
}
PlanetaryLeader.init({
    LeaderID: {
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
    StartDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    EndDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'PlanetaryLeaders',
    sequelize: database_1.default,
    timestamps: true,
});
// Associations
PlanetaryLeader.belongsTo(User_1.default, { foreignKey: 'LeaderID', as: 'Leader' });
PlanetaryLeader.belongsTo(Planet_1.default, { foreignKey: 'PlanetID', as: 'Planet' });
exports.default = PlanetaryLeader;
