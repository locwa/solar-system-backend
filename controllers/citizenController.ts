import { Request, Response } from 'express';
import Citizen from '../models/Citizen';
import Planet from '../models/Planet';
import User from '../models/User';
import CitizenshipRequest from '../models/CitizenshipRequest';
import PlanetaryLeader from '../models/PlanetaryLeader';

export const listCitizensOnPlanet = async (req: Request, res: Response) => {
  try {
    const { planetId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can view citizens on their managed planet' });
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

    const citizens = await Citizen.findAll({
      where: { PlanetID: planetId },
      include: [{ model: User, as: 'User' }],
    });
    res.json(citizens);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCitizenDetails = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    const citizen = await Citizen.findByPk(citizenId, {
      include: [{ model: User, as: 'User' }, { model: Planet, as: 'Planet' }],
    });

    if (!citizen) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    if (userRole === 'Planetary Leader') {
      const planetaryLeader = await PlanetaryLeader.findOne({
        where: {
          LeaderID: userId,
          PlanetID: citizen.PlanetID,
        },
      });
      if (!planetaryLeader) {
        return res.status(403).json({ error: "Unauthorized: You are not the leader of this citizen's planet" });
      }
    } else if (userRole === 'Citizen') {
      if (citizen.CitizenID !== userId) {
        return res.status(403).json({ error: 'Unauthorized: You can only view your own citizen details' });
      }
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(citizen);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createCitizen = async (req: Request, res: Response) => {
  try {
    const { PlanetID, UserID } = req.body;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can create citizens' });
    }

    const planetaryLeader = await PlanetaryLeader.findOne({
      where: {
        LeaderID: userId,
        PlanetID: PlanetID,
      },
    });

    if (!planetaryLeader) {
      return res.status(403).json({ error: 'Unauthorized: You are not the leader of this planet' });
    }

    const existingCitizen = await Citizen.findOne({ where: { CitizenID: UserID } });
    if (existingCitizen) {
      return res.status(409).json({ error: 'User is already a citizen' });
    }

    const citizen = await Citizen.create({ 
      CitizenID: UserID,
      PlanetID,
      CitizenshipStartDate: new Date()
    });
    res.status(201).json(citizen);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const removeCitizen = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can remove citizens' });
    }

    const citizen = await Citizen.findByPk(citizenId);
    if (!citizen) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    const planetaryLeader = await PlanetaryLeader.findOne({
      where: {
        LeaderID: userId,
        PlanetID: citizen.PlanetID,
      },
    });

    if (!planetaryLeader) {
      return res.status(403).json({ error: "Unauthorized: You are not the leader of this citizen's planet" });
    }

    await citizen.destroy();
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCitizenProfile = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can view their own profile' });
    }

    const citizen = await Citizen.findByPk(citizenId, {
      include: [{ model: User, as: 'User' }, { model: Planet, as: 'Planet' }],
    });

    if (!citizen || citizen.CitizenID !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Profile not found or does not belong to the authenticated user' });
    }

    res.json(citizen);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const requestCitizenshipChange = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const { newPlanetId } = req.body;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can request citizenship changes' });
    }

    const citizen = await Citizen.findByPk(citizenId);
    if (!citizen || citizen.CitizenID !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Citizen not found or does not belong to the authenticated user' });
    }

    const newPlanet = await Planet.findByPk(newPlanetId);
    if (!newPlanet) {
      return res.status(404).json({ error: 'New planet not found' });
    }

    if (citizen.PlanetID === newPlanetId) {
      return res.status(400).json({ error: 'Cannot request transfer to the current planet' });
    }

    const existingRequest = await CitizenshipRequest.findOne({
      where: {
        CitizenID: parseInt(citizenId),
        Status: 'Pending',
      },
    });

    if (existingRequest) {
      return res.status(409).json({ error: 'Pending citizenship transfer request already exists' });
    }

    const citizenshipRequest = await CitizenshipRequest.create({
      CitizenID: parseInt(citizenId),
      FromPlanetID: citizen.PlanetID,
      ToPlanetID: newPlanetId,
      Status: 'Pending',
      RequestDate: new Date(),
    });

    res.status(201).json(citizenshipRequest);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCitizenshipRequestStatus = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can view their citizenship request status' });
    }

    const citizen = await Citizen.findByPk(citizenId);
    if (!citizen || citizen.CitizenID !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Citizen not found or does not belong to the authenticated user' });
    }

    const requests = await CitizenshipRequest.findAll({
      where: { CitizenID: parseInt(citizenId) },
      include: [
        { model: Planet, as: 'FromPlanet' },
        { model: Planet, as: 'ToPlanet' },
      ],
      order: [['RequestDate', 'DESC']],
    });

    if (requests.length === 0) {
      return res.status(404).json({ message: 'No citizenship transfer requests found for this citizen' });
    }

    res.json(requests);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getIncomingCitizenshipRequests = async (req: Request, res: Response) => {
  try {
    const { planetId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can view incoming citizenship requests' });
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

    const requests = await CitizenshipRequest.findAll({
      where: { ToPlanetID: parseInt(planetId), Status: 'Pending' },
      include: [
        { model: Citizen, as: 'Requester', include: [{ model: User, as: 'User' }] },
        { model: Planet, as: 'FromPlanet' },
        { model: Planet, as: 'ToPlanet' },
      ],
      order: [['RequestDate', 'DESC']],
    });

    res.json(requests);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const decideCitizenshipRequest = async (req: Request, res: Response) => {
  try {
    const { planetId, requestId } = req.params;
    const { decision } = req.body;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can decide on citizenship requests' });
    }

    if (!['Approved', 'Rejected'].includes(decision)) {
      return res.status(400).json({ error: "Invalid decision. Must be 'Approved' or 'Rejected'" });
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

    const request = await CitizenshipRequest.findOne({
      where: { RequestID: requestId, ToPlanetID: planetId },
      include: [{ model: Citizen, as: 'Requester' }],
    });

    if (!request) {
      return res.status(404).json({ error: 'Citizenship request not found' });
    }

    if (request.Status !== 'Pending') {
      return res.status(400).json({ error: 'Request has already been decided' });
    }

    await request.update({
      Status: decision,
      DecisionBy: userId,
      DecisionDate: new Date(),
    });

    if (decision === 'Approved' && request.Requester) {
      await request.Requester.update({ PlanetID: parseInt(planetId) });
    }

    res.json({ message: `Citizenship request ${decision.toLowerCase()} successfully`, request });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const listAllPlanetsForCitizen = async (req: Request, res: Response) => {
  try {
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can view planets for transfer' });
    }

    const planets = await Planet.findAll({
      where: { Status: 'Active' },
      attributes: ['PlanetID', 'Name', 'Description', 'Population'],
    });

    res.json(planets);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCitizenByUserId = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can access this endpoint' });
    }

    const citizen = await Citizen.findOne({
      where: { CitizenID: userId },
      include: [{ model: User, as: 'User' }, { model: Planet, as: 'Planet' }],
    });

    if (!citizen) {
      return res.status(404).json({ error: 'Citizen record not found' });
    }

    res.json(citizen);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};
