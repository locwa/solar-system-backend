import express from "express";
const router = express.Router();
import * as auth from "../controllers/authController";
import { authenticateSession, checkRole } from "../middleware/sessionAuth";

router.post("/login", auth.login);
router.post("/logout", authenticateSession, auth.logout);

// Test protected route
router.get("/me", authenticateSession, (req, res) => {
  res.json({ sessionUser: (req as any).session.user });
});


// Register
router.post("/register", auth.register);

// CITIZEN ROUTE
router.get("/citizen-area", 
  authenticateSession,
  checkRole(["Citizen"]), 
  (req, res) => {
    res.json({ message: "Welcome Citizen!" });
  }
);

// PLANETARY ROUTE
router.get("/leader-area",
  authenticateSession,
  checkRole(["Planetary Leader"]), 
  (req, res) => {
    res.json({ message: "Welcome Planetary Leader!" });
  }
);

// GALACTIC ROUTE
router.get("/galactic-area",
  authenticateSession,
  checkRole(["Galactic Leader"]), 
  (req, res) => {
    res.json({ message: "Welcome Galactic Leader!" });
  }
);

// Get all users (for assigning leaders, etc.)
router.get("/users",
  authenticateSession,
  checkRole(["Galactic Leader"]),
  auth.listUsers
);

export default router;
