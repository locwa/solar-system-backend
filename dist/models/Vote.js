"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Citizen_1 = __importDefault(require("./Citizen"));
const PlanetProposal_1 = __importDefault(require("./PlanetProposal"));
class Vote extends sequelize_1.Model {
}
Vote.init({
    VoteID: {
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
    ProposalID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PlanetProposals', // Refers to the table name
            key: 'ProposalID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    VoteChoice: {
        type: sequelize_1.DataTypes.ENUM('For', 'Against'),
        allowNull: false,
    },
    VoteDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: 'Votes',
    sequelize: database_1.default,
    timestamps: true,
});
// Associations
Vote.belongsTo(Citizen_1.default, { foreignKey: 'CitizenID', as: 'Voter' });
Vote.belongsTo(PlanetProposal_1.default, { foreignKey: 'ProposalID', as: 'Proposal' });
exports.default = Vote;
