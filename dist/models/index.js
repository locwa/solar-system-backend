"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("./User"));
const Planet_1 = __importDefault(require("./Planet"));
const PlanetaryLeader_1 = __importDefault(require("./PlanetaryLeader"));
const Citizen_1 = __importDefault(require("./Citizen"));
const PlanetProposal_1 = __importDefault(require("./PlanetProposal"));
const Vote_1 = __importDefault(require("./Vote"));
const CitizenshipRequest_1 = __importDefault(require("./CitizenshipRequest"));
const db = {};
db.sequelize = database_1.default;
db.Sequelize = sequelize_1.Sequelize;
db.User = User_1.default;
db.Planet = Planet_1.default;
db.PlanetaryLeader = PlanetaryLeader_1.default;
db.Citizen = Citizen_1.default;
db.PlanetProposal = PlanetProposal_1.default;
db.Vote = Vote_1.default;
db.CitizenshipRequest = CitizenshipRequest_1.default;
// Define associations
// User associations
User_1.default.hasMany(Planet_1.default, { foreignKey: 'CreatedBy', as: 'CreatedPlanets' });
User_1.default.hasMany(PlanetaryLeader_1.default, { foreignKey: 'LeaderID', as: 'LeadershipRoles' });
User_1.default.hasMany(Citizen_1.default, { foreignKey: 'CitizenID', as: 'CitizenshipInfo' });
User_1.default.hasMany(PlanetProposal_1.default, { foreignKey: 'ProposedBy', as: 'ProposalsMade' });
User_1.default.hasMany(PlanetProposal_1.default, { foreignKey: 'DecisionBy', as: 'ProposalsDecided' });
User_1.default.hasMany(CitizenshipRequest_1.default, { foreignKey: 'DecisionBy', as: 'CitizenshipRequestsDecided' });
// Planet associations
Planet_1.default.belongsTo(User_1.default, { foreignKey: 'CreatedBy', as: 'Creator' });
Planet_1.default.hasMany(PlanetaryLeader_1.default, { foreignKey: 'PlanetID', as: 'Leaders' });
Planet_1.default.hasMany(Citizen_1.default, { foreignKey: 'PlanetID', as: 'Citizens' });
Planet_1.default.hasMany(PlanetProposal_1.default, { foreignKey: 'PlanetID', as: 'Proposals' });
Planet_1.default.hasMany(CitizenshipRequest_1.default, { foreignKey: 'FromPlanetID', as: 'OutgoingCitizenshipRequests' });
Planet_1.default.hasMany(CitizenshipRequest_1.default, { foreignKey: 'ToPlanetID', as: 'IncomingCitizenshipRequests' });
// PlanetaryLeader associations (already defined in model file)
// PlanetaryLeader.belongsTo(User, { foreignKey: 'LeaderID', as: 'Leader' });
// PlanetaryLeader.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });
// Citizen associations (already defined in model file)
// Citizen.belongsTo(User, { foreignKey: 'CitizenID', as: 'User' });
// Citizen.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });
Citizen_1.default.hasMany(Vote_1.default, { foreignKey: 'CitizenID', as: 'Votes' });
Citizen_1.default.hasMany(CitizenshipRequest_1.default, { foreignKey: 'CitizenID', as: 'Requests' });
// PlanetProposal associations (already defined in model file)
// PlanetProposal.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });
// PlanetProposal.belongsTo(User, { foreignKey: 'ProposedBy', as: 'Proposer' });
// PlanetProposal.belongsTo(User, { foreignKey: 'DecisionBy', as: 'Decider' });
PlanetProposal_1.default.hasMany(Vote_1.default, { foreignKey: 'ProposalID', as: 'Votes' });
// Vote associations (already defined in model file)
// Vote.belongsTo(Citizen, { foreignKey: 'CitizenID', as: 'Voter' });
// Vote.belongsTo(PlanetProposal, { foreignKey: 'ProposalID', as: 'Proposal' });
// CitizenshipRequest associations (already defined in model file)
// CitizenshipRequest.belongsTo(Citizen, { foreignKey: 'CitizenID', as: 'Requester' });
// CitizenshipRequest.belongsTo(Planet, { foreignKey: 'FromPlanetID', as: 'FromPlanet' });
// CitizenshipRequest.belongsTo(Planet, { foreignKey: 'ToPlanetID', as: 'ToPlanet' });
// CitizenshipRequest.belongsTo(User, { foreignKey: 'DecisionBy', as: 'Decider' });
exports.default = db;
