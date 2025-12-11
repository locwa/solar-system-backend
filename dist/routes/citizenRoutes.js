"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const citizenController = __importStar(require("../controllers/citizenController"));
const proposalController = __importStar(require("../controllers/proposalController"));
const sessionAuth_1 = require("../middleware/sessionAuth");
const router = express_1.default.Router();
// Planetary Leader Routes
router.get('/planets/:planetId/citizens', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Planetary Leader']), citizenController.listCitizensOnPlanet);
router.post('/citizens', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Planetary Leader']), citizenController.createCitizen);
router.delete('/citizens/:citizenId', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Planetary Leader']), citizenController.removeCitizen);
// Planetary Leader & Citizen Routes
router.get('/citizens/:citizenId', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Planetary Leader', 'Citizen']), citizenController.getCitizenDetails);
// Citizen Routes
router.get('/citizens/:citizenId/profile', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Citizen']), citizenController.getCitizenProfile);
router.post('/citizens/:citizenId/citizenship-request', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Citizen']), citizenController.requestCitizenshipChange);
router.get('/citizens/:citizenId/citizenship-request', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Citizen']), citizenController.getCitizenshipRequestStatus);
router.get('/planets/:planetId/modification-requests/:requestId', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Citizen']), proposalController.getModificationRequestDetails);
router.post('/planets/:planetId/modification-requests/:requestId/vote', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Citizen']), proposalController.castVoteOnRequest);
router.get('/citizen/proposals', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Citizen']), proposalController.getProposalsForCitizen);
router.get('/citizen/me', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Citizen']), citizenController.getCitizenByUserId);
router.get('/citizen/planets', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Citizen']), citizenController.listAllPlanetsForCitizen);
router.get('/planets/:planetId/citizenship-requests', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Planetary Leader']), citizenController.getIncomingCitizenshipRequests);
router.post('/planets/:planetId/citizenship-requests/:requestId/decide', sessionAuth_1.authenticateSession, (0, sessionAuth_1.checkRole)(['Planetary Leader']), citizenController.decideCitizenshipRequest);
exports.default = router;
