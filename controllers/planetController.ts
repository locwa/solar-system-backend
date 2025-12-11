import { Request, Response } from 'express';
import Planet from '../models/Planet';
import User from '../models/User';
import PlanetaryLeader from '../models/PlanetaryLeader';

// Create a new planet (Galactic Leader only)
export const createPlanet = async (req: Request, res: Response) => {
  try {
    // Assuming res.locals.user has a 'role' property from the session
    if (res.locals.user.role !== 'Galactic Leader') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const planet = await Planet.create(req.body);
    res.status(201).json(planet);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update planet attributes (Galactic Leader or Planetary Leader of the planet)
export const updatePlanet = async (req: Request, res: Response) => {
  try {
    const planetId = parseInt(req.params.planetId); // Convert to number
    const planet = await Planet.findByPk(planetId);
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
    }

    // Access user role and ID from res.locals.user (session data)
    const userRole = res.locals.user.role;
    const userId = res.locals.user.id;

    let isAuthorized = false;
    if (userRole === 'Galactic Leader') {
      isAuthorized = true;
    } else if (userRole === 'Planetary Leader') {
      const planetaryLeader = await PlanetaryLeader.findOne({
        where: {
          LeaderID: userId,
          PlanetID: planet.PlanetID,
        },
      });
      if (planetaryLeader) {
        isAuthorized = true;
      }
    }

    if (isAuthorized) {
      await planet.update(req.body);
      res.json(planet);
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get planet details
export const getPlanet = async (req: Request, res: Response) => {
  try {
    const planetId = parseInt(req.params.planetId); // Convert to number
    const planet = await Planet.findByPk(planetId);
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
    }
    res.json(planet);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// List all planets
export const listPlanets = async (req: Request, res: Response) => {
  try {
    const planets = await Planet.findAll();
    console.log(planets)
    res.json(planets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a planet (Galactic Leader only)
export const deletePlanet = async (req: Request, res: Response) => {
  try {
    if (res.locals.user.role !== 'Galactic Leader') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const planetId = parseInt(req.params.planetId); // Convert to number
    const result = await Planet.destroy({
      where: { PlanetID: planetId },
    });

    if (result === 0) {
      return res.status(404).json({ error: 'Planet not found' });
    }

    res.status(204).send(); // No content
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Assign a Planetary Leader to a planet (Galactic Leader only)
export const assignPlanetaryLeader = async (req: Request, res: Response) => {
  try {
    if (res.locals.user.role !== 'Galactic Leader') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { userId } = req.body; // userId of the user to be assigned as leader
    const planetId = parseInt(req.params.planetId); // Convert to number

    // Check if planet exists
    const planet = await Planet.findByPk(planetId);
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
    }

    // Check if user exists and is not already a Planetary Leader for this planet
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if the user is already a Planetary Leader for this planet
    const existingLeader = await PlanetaryLeader.findOne({
      where: {
        LeaderID: userId,
        PlanetID: planetId,
      },
    });

    if (existingLeader) {
      return res.status(409).json({ error: 'User is already a Planetary Leader for this planet' });
    }

    // Create a new PlanetaryLeader entry
    await PlanetaryLeader.create({
      LeaderID: userId,
      PlanetID: planetId,
      StartDate: new Date(),
    });
    
    // Update the user's role to 'Planetary Leader' if they are not Galactic Leader already
    if (user.Role !== 'Galactic Leader') {
      user.Role = 'Planetary Leader';
      await user.save();
    }

    res.status(200).json({ message: 'Planetary Leader assigned successfully' });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get a list of all Planetary Leaders (Galactic Leader only)
export const listPlanetaryLeaders = async (req: Request, res: Response) => {
  try {
    if (res.locals.user.role !== 'Galactic Leader') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const leaders = await PlanetaryLeader.findAll({
      include: [{ model: User, as: 'Leader' }, { model: Planet, as: 'Planet' }],
    });
    res.json(leaders);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get specific details of the managed planet (Planetary Leader only)
export const getManagedPlanetDetails = async (req: Request, res: Response) => {
  try {
    const planetId = parseInt(req.params.planetId); // Convert to number
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can view managed planet details' });
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

    res.json(planet); // Or specific details as required
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};
