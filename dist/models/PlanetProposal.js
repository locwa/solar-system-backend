"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Planet_1 = __importDefault(require("./Planet"));
const User_1 = __importDefault(require("./User"));
class PlanetProposal extends sequelize_1.Model {
}
PlanetProposal.init({
    ProposalID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    ProposedBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Refers to the table name
            key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ProposalType: {
        type: sequelize_1.DataTypes.ENUM('Terraform', 'Rename', 'Resource Change', 'Destruction'),
        allowNull: false,
    },
    Details: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    Status: {
        type: sequelize_1.DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    DateProposed: {
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
    tableName: 'PlanetProposals',
    sequelize: database_1.default,
    timestamps: true,
});
// Associations
PlanetProposal.belongsTo(Planet_1.default, { foreignKey: 'PlanetID', as: 'Planet' });
PlanetProposal.belongsTo(User_1.default, { foreignKey: 'ProposedBy', as: 'Proposer' });
PlanetProposal.belongsTo(User_1.default, { foreignKey: 'DecisionBy', as: 'Decider' });
exports.default = PlanetProposal;
