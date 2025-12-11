import { Request, Response } from 'express';
import PlanetProposal from '../models/PlanetProposal';
import Planet from '../models/Planet';
import User from '../models/User';
import Vote from '../models/Vote';
import PlanetaryLeader from '../models/PlanetaryLeader';
import Citizen from '../models/Citizen';

export const listAllProposals = async (req: Request, res: Response) => {
  try {
    const userRole = res.locals.user.role;

    if (userRole !== 'Galactic Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Galactic Leaders can view all proposals' });
    }

    const proposals = await PlanetProposal.findAll({
      include: [
        { model: Planet, as: 'Planet' },
        { model: User, as: 'Proposer' },
        { model: User, as: 'Decider' },
        { model: Vote, as: 'Votes' },
      ],
      order: [['DateProposed', 'DESC']],
    });

    res.json(proposals);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProposalById = async (req: Request, res: Response) => {
  try {
    const { proposalId } = req.params;
    const userRole = res.locals.user.role;

    if (userRole !== 'Galactic Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Galactic Leaders can view proposal details' });
    }

    const proposal = await PlanetProposal.findByPk(proposalId, {
      include: [
        { model: Planet, as: 'Planet' },
        { model: User, as: 'Proposer' },
        { model: User, as: 'Decider' },
        { model: Vote, as: 'Votes', include: [{ model: Citizen, as: 'Voter', include: [{ model: User, as: 'User' }] }] },
      ],
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const forVotes = await Vote.count({ where: { ProposalID: proposalId, VoteChoice: 'For' } });
    const againstVotes = await Vote.count({ where: { ProposalID: proposalId, VoteChoice: 'Against' } });

    res.json({
      ...proposal.toJSON(),
      voteSummary: { for: forVotes, against: againstVotes, total: forVotes + againstVotes },
    });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const decideProposal = async (req: Request, res: Response) => {
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

    const proposal = await PlanetProposal.findByPk(proposalId, {
      include: [{ model: Planet, as: 'Planet' }],
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
      } else if (proposal.ProposalType === 'Destruction') {
        await proposal.Planet.update({ Status: 'Destroyed' });
      }
    }

    res.json({ message: `Proposal ${decision.toLowerCase()} successfully`, proposal });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProposalsForCitizen = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can view their planet proposals' });
    }

    const citizen = await Citizen.findOne({ where: { CitizenID: userId } });

    if (!citizen) {
      return res.status(404).json({ error: 'Citizen record not found' });
    }

    const proposals = await PlanetProposal.findAll({
      where: { PlanetID: citizen.PlanetID, Status: 'Pending' },
      include: [
        { model: Planet, as: 'Planet' },
        { model: User, as: 'Proposer' },
      ],
      order: [['DateProposed', 'DESC']],
    });

    const proposalsWithVoteStatus = await Promise.all(
      proposals.map(async (proposal) => {
        const existingVote = await Vote.findOne({
          where: { ProposalID: proposal.ProposalID, CitizenID: userId },
        });
        const forVotes = await Vote.count({ where: { ProposalID: proposal.ProposalID, VoteChoice: 'For' } });
        const againstVotes = await Vote.count({ where: { ProposalID: proposal.ProposalID, VoteChoice: 'Against' } });
        
        return {
          ...proposal.toJSON(),
          hasVoted: !!existingVote,
          userVote: existingVote?.VoteChoice || null,
          voteSummary: { for: forVotes, against: againstVotes },
        };
      })
    );

    res.json(proposalsWithVoteStatus);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const submitModificationRequest = async (req: Request, res: Response) => {
  try {
    const { planetId } = req.params;
    const { title, description, proposalType } = req.body;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can submit modification requests' });
    }

    const planetaryLeader = await PlanetaryLeader.findOne({
      where: {
        LeaderID: userId,
        PlanetID: planetId,
      },
    });

    if (!planetaryLeader) {
      return res.status(403).json({ error: 'Unauthorized: You are not the leader of this planet' });
    }

    const planet = await Planet.findByPk(planetId);
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
    }

    const proposal = await PlanetProposal.create({
      PlanetID: parseInt(planetId),
      ProposedBy: userId,
      ProposalType: proposalType || 'Terraform',
      Details: description || title,
      Status: 'Pending',
      DateProposed: new Date(),
    });

    res.status(201).json(proposal);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getModificationRequestDetails = async (req: Request, res: Response) => {
  try {
    const { planetId, requestId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can view modification request details' });
    }

    const citizen = await Citizen.findOne({
      where: {
        CitizenID: userId,
        PlanetID: planetId,
      },
    });

    if (!citizen) {
      return res.status(403).json({ error: 'Unauthorized: You are not a citizen of this planet' });
    }

    const proposal = await PlanetProposal.findOne({
      where: {
        ProposalID: requestId,
        PlanetID: planetId,
      },
      include: [
        { model: Planet, as: 'Planet' },
        { model: User, as: 'Proposer' },
      ],
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Modification request not found' });
    }

    res.json(proposal);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const castVoteOnRequest = async (req: Request, res: Response) => {
  try {
    const { planetId, requestId } = req.params;
    const { voteType } = req.body;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can cast votes' });
    }

    const citizen = await Citizen.findOne({
      where: {
        CitizenID: userId,
        PlanetID: planetId,
      },
    });

    if (!citizen) {
      return res.status(403).json({ error: 'Unauthorized: You are not a citizen of this planet' });
    }

    const proposal = await PlanetProposal.findOne({
      where: {
        ProposalID: requestId,
        PlanetID: planetId,
        Status: 'Pending',
      },
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Pending modification request not found' });
    }

    const existingVote = await Vote.findOne({
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

    const vote = await Vote.create({
      CitizenID: userId,
      ProposalID: parseInt(requestId),
      VoteChoice: voteType,
      VoteDate: new Date(),
    });

    res.status(201).json(vote);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};
