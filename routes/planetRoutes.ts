import express from 'express';
import * as planetController from '../controllers/planetController';
import * as proposalController from '../controllers/proposalController'; // Added import for proposalController
import { authenticateSession, checkRole } from '../middleware/sessionAuth';

const router = express.Router();

// Galactic Leader Routes
router.get('/planets',
  authenticateSession,
  checkRole(['Galactic Leader']),
  planetController.listPlanets
);

router.post('/planets',
  authenticateSession,
  checkRole(['Galactic Leader']),
  planetController.createPlanet
);

router.get('/planets/:planetId',
  authenticateSession,
  checkRole(['Galactic Leader', 'Planetary Leader', 'Citizen']),
  planetController.getPlanet
);

router.post('/planets/:planetId',
  authenticateSession,
  checkRole(['Galactic Leader', 'Planetary Leader']),
  planetController.updatePlanet // Internal role validation already exists
);

router.delete('/planets/:planetId',
  authenticateSession,
  checkRole(['Galactic Leader']),
  planetController.deletePlanet
);

router.post('/planets/:planetId/leader',
  authenticateSession,
  checkRole(['Galactic Leader']),
  planetController.assignPlanetaryLeader
);

router.get('/planetary-leaders',
  authenticateSession,
  checkRole(['Galactic Leader']),
  planetController.listPlanetaryLeaders
);

// Galactic Leader - Proposal Review Routes
router.get('/proposals',
  authenticateSession,
  checkRole(['Galactic Leader']),
  proposalController.listAllProposals
);

router.get('/proposals/:proposalId',
  authenticateSession,
  checkRole(['Galactic Leader']),
  proposalController.getProposalById
);

router.post('/proposals/:proposalId/decide',
  authenticateSession,
  checkRole(['Galactic Leader']),
  proposalController.decideProposal
);

// Planetary Leader Routes
router.get('/planets/:planetId/details',
  authenticateSession,
  checkRole(['Planetary Leader']),
  planetController.getManagedPlanetDetails
);

router.post('/planets/:planetId/modification-requests',
  authenticateSession,
  checkRole(['Planetary Leader']),
  proposalController.submitModificationRequest
);

export default router;
