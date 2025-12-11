"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.castVoteOnRequest = exports.getModificationRequestDetails = exports.submitModificationRequest = exports.getProposalsForCitizen = exports.decideProposal = exports.getProposalById = exports.listAllProposals = void 0;
const PlanetProposal_1 = __importDefault(require("../models/PlanetProposal"));
const Planet_1 = __importDefault(require("../models/Planet"));
const User_1 = __importDefault(require("../models/User"));
const Vote_1 = __importDefault(require("../models/Vote"));
const PlanetaryLeader_1 = __importDefault(require("../models/PlanetaryLeader"));
const Citizen_1 = __importDefault(require("../models/Citizen"));
const listAllProposals = async (req, res) => {
    try {
        const userRole = res.locals.user.role;
        if (userRole !== 'Galactic Leader') {
            return res.status(403).json({ error: 'Unauthorized: Only Galactic Leaders can view all proposals' });
        }
        const proposals = await PlanetProposal_1.default.findAll({
            include: [
                { model: Planet_1.default, as: 'Planet' },
                { model: User_1.default, as: 'Proposer' },
                { model: User_1.default, as: 'Decider' },
                { model: Vote_1.default, as: 'Votes' },
            ],
            order: [['DateProposed', 'DESC']],
        });
        res.json(proposals);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listAllProposals = listAllProposals;
const getProposalById = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const userRole = res.locals.user.role;
        if (userRole !== 'Galactic Leader') {
            return res.status(403).json({ error: 'Unauthorized: Only Galactic Leaders can view proposal details' });
        }
        const proposal = await PlanetProposal_1.default.findByPk(proposalId, {
            include: [
                { model: Planet_1.default, as: 'Planet' },
                { model: User_1.default, as: 'Proposer' },
                { model: User_1.default, as: 'Decider' },
                { model: Vote_1.default, as: 'Votes', include: [{ model: Citizen_1.default, as: 'Voter', include: [{ model: User_1.default, as: 'User' }] }] },
            ],
        });
        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }
        const forVotes = await Vote_1.default.count({ where: { ProposalID: proposalId, VoteChoice: 'For' } });
        const againstVotes = await Vote_1.default.count({ where: { ProposalID: proposalId, VoteChoice: 'Against' } });
        res.json({
            ...proposal.toJSON(),
            voteSummary: { for: forVotes, against: againstVotes, total: forVotes + againstVotes },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProposalById = getProposalById;
const decideProposal = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const { decision } = req.body;
        const userId = res.locals.user.id;
        const userRole = res.locals.user.role;
        if (userRole !== 'Galactic Leader') {
            return res.status(403).json({ error: 'Unauthorized: Only Galactic Leaders can decide on proposals' });
        }
        if (!['Approved', 'Rejected'].includes(decision)) {
            return res.status(400).json({ error: "Invalid decision. Must be 'Approved' or 'Rejected'" });
        }
        const proposal = await PlanetProposal_1.default.findByPk(proposalId, {
            include: [{ model: Planet_1.default, as: 'Planet' }],
        });
        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }
        if (proposal.Status !== 'Pending') {
            return res.status(400).json({ error: 'Proposal has already been decided' });
        }
        await proposal.update({
            Status: decision,
            DecisionBy: userId,
            DecisionDate: new Date(),
        });
        if (decision === 'Approved' && proposal.Planet) {
            if (proposal.ProposalType === 'Terraform') {
                await proposal.Planet.update({ Status: 'Terraforming' });
            }
            else if (proposal.ProposalType === 'Destruction') {
                await proposal.Planet.update({ Status: 'Destroyed' });
            }
        }
        res.json({ message: `Proposal ${decision.toLowerCase()} successfully`, proposal });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.decideProposal = decideProposal;
const getProposalsForCitizen = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const userRole = res.locals.user.role;
        if (userRole !== 'Citizen') {
            return res.status(403).json({ error: 'Unauthorized: Only Citizens can view their planet proposals' });
        }
        const citizen = await Citizen_1.default.findOne({ where: { CitizenID: userId } });
        if (!citizen) {
            return res.status(404).json({ error: 'Citizen record not found' });
        }
        const proposals = await PlanetProposal_1.default.findAll({
            where: { PlanetID: citizen.PlanetID, Status: 'Pending' },
            include: [
                { model: Planet_1.default, as: 'Planet' },
                { model: User_1.default, as: 'Proposer' },
            ],
            order: [['DateProposed', 'DESC']],
        });
        const proposalsWithVoteStatus = await Promise.all(proposals.map(async (proposal) => {
            const existingVote = await Vote_1.default.findOne({
                where: { ProposalID: proposal.ProposalID, CitizenID: userId },
            });
            const forVotes = await Vote_1.default.count({ where: { ProposalID: proposal.ProposalID, VoteChoice: 'For' } });
            const againstVotes = await Vote_1.default.count({ where: { ProposalID: proposal.ProposalID, VoteChoice: 'Against' } });
            return {
                ...proposal.toJSON(),
                hasVoted: !!existingVote,
                userVote: existingVote?.VoteChoice || null,
                voteSummary: { for: forVotes, against: againstVotes },
            };
        }));
        res.json(proposalsWithVoteStatus);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProposalsForCitizen = getProposalsForCitizen;
const submitModificationRequest = async (req, res) => {
    try {
        const { planetId } = req.params;
        const { title, description, proposalType } = req.body;
        const userId = res.locals.user.id;
        const userRole = res.locals.user.role;
        if (userRole !== 'Planetary Leader') {
            return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can submit modification requests' });
        }
        const planetaryLeader = await PlanetaryLeader_1.default.findOne({
            where: {
                LeaderID: userId,
                PlanetID: planetId,
            },
        });
        if (!planetaryLeader) {
            return res.status(403).json({ error: 'Unauthorized: You are not the leader of this planet' });
        }
        const planet = await Planet_1.default.findByPk(planetId);
        if (!planet) {
            return res.status(404).json({ error: 'Planet not found' });
        }
        const proposal = await PlanetProposal_1.default.create({
            PlanetID: parseInt(planetId),
            ProposedBy: userId,
            ProposalType: proposalType || 'Terraform',
            Details: description || title,
            Status: 'Pending',
            DateProposed: new Date(),
        });
        res.status(201).json(proposal);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.submitModificationRequest = submitModificationRequest;
const getModificationRequestDetails = async (req, res) => {
    try {
        const { planetId, requestId } = req.params;
        const userId = res.locals.user.id;
        const userRole = res.locals.user.role;
        if (userRole !== 'Citizen') {
            return res.status(403).json({ error: 'Unauthorized: Only Citizens can view modification request details' });
        }
        const citizen = await Citizen_1.default.findOne({
            where: {
                CitizenID: userId,
                PlanetID: planetId,
            },
        });
        if (!citizen) {
            return res.status(403).json({ error: 'Unauthorized: You are not a citizen of this planet' });
        }
        const proposal = await PlanetProposal_1.default.findOne({
            where: {
                ProposalID: requestId,
                PlanetID: planetId,
            },
            include: [
                { model: Planet_1.default, as: 'Planet' },
                { model: User_1.default, as: 'Proposer' },
            ],
        });
        if (!proposal) {
            return res.status(404).json({ error: 'Modification request not found' });
        }
        res.json(proposal);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getModificationRequestDetails = getModificationRequestDetails;
const castVoteOnRequest = async (req, res) => {
    try {
        const { planetId, requestId } = req.params;
        const { voteType } = req.body;
        const userId = res.locals.user.id;
        const userRole = res.locals.user.role;
        if (userRole !== 'Citizen') {
            return res.status(403).json({ error: 'Unauthorized: Only Citizens can cast votes' });
        }
        const citizen = await Citizen_1.default.findOne({
            where: {
                CitizenID: userId,
                PlanetID: planetId,
            },
        });
        if (!citizen) {
            return res.status(403).json({ error: 'Unauthorized: You are not a citizen of this planet' });
        }
        const proposal = await PlanetProposal_1.default.findOne({
            where: {
                ProposalID: requestId,
                PlanetID: planetId,
                Status: 'Pending',
            },
        });
        if (!proposal) {
            return res.status(404).json({ error: 'Pending modification request not found' });
        }
        const existingVote = await Vote_1.default.findOne({
            where: {
                ProposalID: parseInt(requestId),
                CitizenID: userId,
            },
        });
        if (existingVote) {
            return res.status(409).json({ error: 'You have already voted on this proposal' });
        }
        if (!['For', 'Against'].includes(voteType)) {
            return res.status(400).json({ error: "Invalid vote type. Must be 'For' or 'Against'" });
        }
        const vote = await Vote_1.default.create({
            CitizenID: userId,
            ProposalID: parseInt(requestId),
            VoteChoice: voteType,
            VoteDate: new Date(),
        });
        res.status(201).json(vote);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.castVoteOnRequest = castVoteOnRequest;
