"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Citizen_1 = __importDefault(require("./Citizen"));
const Planet_1 = __importDefault(require("./Planet"));
const User_1 = __importDefault(require("./User"));
class CitizenshipRequest extends sequelize_1.Model {
}
CitizenshipRequest.init({
    RequestID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CitizenID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Citizens', // Refers to the table name
            key: 'CitizenID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    FromPlanetID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Planets', // Refers to the table name
            key: 'PlanetID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ToPlanetID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Planets', // Refers to the table name
            key: 'PlanetID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    Status: {
        type: sequelize_1.DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    RequestDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    DecisionBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users', // Refers to the table name
            key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    DecisionDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'CitizenshipRequests',
    sequelize: database_1.default,
    timestamps: true,
});
// Associations
CitizenshipRequest.belongsTo(Citizen_1.default, { foreignKey: 'CitizenID', as: 'Requester' });
CitizenshipRequest.belongsTo(Planet_1.default, { foreignKey: 'FromPlanetID', as: 'FromPlanet' });
CitizenshipRequest.belongsTo(Planet_1.default, { foreignKey: 'ToPlanetID', as: 'ToPlanet' });
CitizenshipRequest.belongsTo(User_1.default, { foreignKey: 'DecisionBy', as: 'Decider' });
exports.default = CitizenshipRequest;
