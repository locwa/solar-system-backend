import sequelize from "../config/database";
import { Sequelize } from "sequelize";

import User from "./User";
import Planet from "./Planet";
import PlanetaryLeader from "./PlanetaryLeader";
import Citizen from "./Citizen";
import PlanetProposal from "./PlanetProposal";
import Vote from "./Vote";
import CitizenshipRequest from "./CitizenshipRequest";

const db: any = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Planet = Planet;
db.PlanetaryLeader = PlanetaryLeader;
db.Citizen = Citizen;
db.PlanetProposal = PlanetProposal;
db.Vote = Vote;
db.CitizenshipRequest = CitizenshipRequest;

// Define associations
// User associations
User.hasMany(Planet, { foreignKey: 'CreatedBy', as: 'CreatedPlanets' });
User.hasMany(PlanetaryLeader, { foreignKey: 'LeaderID', as: 'LeadershipRoles' });
User.hasMany(Citizen, { foreignKey: 'CitizenID', as: 'CitizenshipInfo' });
User.hasMany(PlanetProposal, { foreignKey: 'ProposedBy', as: 'ProposalsMade' });
User.hasMany(PlanetProposal, { foreignKey: 'DecisionBy', as: 'ProposalsDecided' });
User.hasMany(CitizenshipRequest, { foreignKey: 'DecisionBy', as: 'CitizenshipRequestsDecided' });

// Planet associations
Planet.belongsTo(User, { foreignKey: 'CreatedBy', as: 'Creator' });
Planet.hasMany(PlanetaryLeader, { foreignKey: 'PlanetID', as: 'Leaders' });
Planet.hasMany(Citizen, { foreignKey: 'PlanetID', as: 'Citizens' });
Planet.hasMany(PlanetProposal, { foreignKey: 'PlanetID', as: 'Proposals' });
Planet.hasMany(CitizenshipRequest, { foreignKey: 'FromPlanetID', as: 'OutgoingCitizenshipRequests' });
Planet.hasMany(CitizenshipRequest, { foreignKey: 'ToPlanetID', as: 'IncomingCitizenshipRequests' });

// PlanetaryLeader associations (already defined in model file)
// PlanetaryLeader.belongsTo(User, { foreignKey: 'LeaderID', as: 'Leader' });
// PlanetaryLeader.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });

// Citizen associations (already defined in model file)
// Citizen.belongsTo(User, { foreignKey: 'CitizenID', as: 'User' });
// Citizen.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });
Citizen.hasMany(Vote, { foreignKey: 'CitizenID', as: 'Votes' });
Citizen.hasMany(CitizenshipRequest, { foreignKey: 'CitizenID', as: 'Requests' });

// PlanetProposal associations (already defined in model file)
// PlanetProposal.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });
// PlanetProposal.belongsTo(User, { foreignKey: 'ProposedBy', as: 'Proposer' });
// PlanetProposal.belongsTo(User, { foreignKey: 'DecisionBy', as: 'Decider' });
PlanetProposal.hasMany(Vote, { foreignKey: 'ProposalID', as: 'Votes' });

// Vote associations (already defined in model file)
// Vote.belongsTo(Citizen, { foreignKey: 'CitizenID', as: 'Voter' });
// Vote.belongsTo(PlanetProposal, { foreignKey: 'ProposalID', as: 'Proposal' });

// CitizenshipRequest associations (already defined in model file)
// CitizenshipRequest.belongsTo(Citizen, { foreignKey: 'CitizenID', as: 'Requester' });
// CitizenshipRequest.belongsTo(Planet, { foreignKey: 'FromPlanetID', as: 'FromPlanet' });
// CitizenshipRequest.belongsTo(Planet, { foreignKey: 'ToPlanetID', as: 'ToPlanet' });
// CitizenshipRequest.belongsTo(User, { foreignKey: 'DecisionBy', as: 'Decider' });

export default db;
