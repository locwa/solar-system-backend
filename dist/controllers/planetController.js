"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPlanets = exports.getPlanet = exports.updatePlanet = exports.createPlanet = void 0;
const Planet_1 = __importDefault(require("../models/Planet"));
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
        const planet = await Planet_1.default.findByPk(req.params.id);
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
        const planet = await Planet_1.default.findByPk(req.params.id);
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
