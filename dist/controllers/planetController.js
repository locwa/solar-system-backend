"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagedPlanetDetails = exports.listPlanetaryLeaders = exports.assignPlanetaryLeader = exports.deletePlanet = exports.listPlanets = exports.getPlanet = exports.updatePlanet = exports.createPlanet = void 0;
const Planet_1 = __importDefault(require("../models/Planet"));
const User_1 = __importDefault(require("../models/User"));
const PlanetaryLeader_1 = __importDefault(require("../models/PlanetaryLeader"));
// Create a new planet (Galactic Leader only)
const createPlanet = async (req, res) => {
    try {
        // Assuming res.locals.user has a 'role' property from the session
        if (res.locals.user.role !== 'Galactic Leader') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const planet = await Planet_1.default.create(req.body);
        res.status(201).json(planet);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createPlanet = createPlanet;
// Update planet attributes (Galactic Leader or Planetary Leader of the planet)
const updatePlanet = async (req, res) => {
    try {
        const planetId = parseInt(req.params.planetId); // Convert to number
        const planet = await Planet_1.default.findByPk(planetId);
        if (!planet) {
            return res.status(404).json({ error: 'Planet not found' });
        }
        // Access user role and ID from res.locals.user (session data)
        const userRole = res.locals.user.role;
        const userId = res.locals.user.id;
        let isAuthorized = false;
        if (userRole === 'Galactic Leader') {
            isAuthorized = true;
        }
        else if (userRole === 'Planetary Leader') {
            const planetaryLeader = await PlanetaryLeader_1.default.findOne({
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
        }
        else {
            res.status(403).json({ error: 'Unauthorized' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updatePlanet = updatePlanet;
// Get planet details
const getPlanet = async (req, res) => {
    try {
        const planetId = parseInt(req.params.planetId); // Convert to number
        const planet = await Planet_1.default.findByPk(planetId);
        if (!planet) {
            return res.status(404).json({ error: 'Planet not found' });
        }
        res.json(planet);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getPlanet = getPlanet;
// List all planets
const listPlanets = async (req, res) => {
    try {
        const planets = await Planet_1.default.findAll();
        res.json(planets);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listPlanets = listPlanets;
// Delete a planet (Galactic Leader only)
const deletePlanet = async (req, res) => {
    try {
        if (res.locals.user.role !== 'Galactic Leader') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const planetId = parseInt(req.params.planetId); // Convert to number
        const result = await Planet_1.default.destroy({
            where: { PlanetID: planetId },
        });
        if (result === 0) {
            return res.status(404).json({ error: 'Planet not found' });
        }
        res.status(204).send(); // No content
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deletePlanet = deletePlanet;
// Assign a Planetary Leader to a planet (Galactic Leader only)
const assignPlanetaryLeader = async (req, res) => {
    try {
        if (res.locals.user.role !== 'Galactic Leader') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const { userId } = req.body; // userId of the user to be assigned as leader
        const planetId = parseInt(req.params.planetId); // Convert to number
        // Check if planet exists
        const planet = await Planet_1.default.findByPk(planetId);
        if (!planet) {
            return res.status(404).json({ error: 'Planet not found' });
        }
        // Check if user exists and is not already a Planetary Leader for this planet
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if the user is already a Planetary Leader for this planet
        const existingLeader = await PlanetaryLeader_1.default.findOne({
            where: {
                LeaderID: userId,
                PlanetID: planetId,
            },
        });
        if (existingLeader) {
            return res.status(409).json({ error: 'User is already a Planetary Leader for this planet' });
        }
        // Create a new PlanetaryLeader entry
        await PlanetaryLeader_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.assignPlanetaryLeader = assignPlanetaryLeader;
// Get a list of all Planetary Leaders (Galactic Leader only)
const listPlanetaryLeaders = async (req, res) => {
    try {
        if (res.locals.user.role !== 'Galactic Leader') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const leaders = await PlanetaryLeader_1.default.findAll({
            include: [{ model: User_1.default, as: 'Leader' }, { model: Planet_1.default, as: 'Planet' }],
        });
        res.json(leaders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listPlanetaryLeaders = listPlanetaryLeaders;
// Get specific details of the managed planet (Planetary Leader only)
const getManagedPlanetDetails = async (req, res) => {
    try {
        const planetId = parseInt(req.params.planetId); // Convert to number
        const userId = res.locals.user.id;
        const userRole = res.locals.user.role;
        if (userRole !== 'Planetary Leader') {
            return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can view managed planet details' });
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
        res.json(planet); // Or specific details as required
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getManagedPlanetDetails = getManagedPlanetDetails;
