import { Request, Response, NextFunction } from "express";
import User from "../models/User";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      name: string;
      role: string;
      isGalactic: boolean;
    };
  }
}

export const authenticateSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user || !roles.includes(res.locals.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export const authorizeGalacticLeader = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user && res.locals.user.isGalactic) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Requires Galactic Leader role." });
  }
};

// Deserialize user from session (for passport-like scenarios or if needed for deeper user object)
export const deserializeUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user && req.session.user.id) {
    User.findByPk(req.session.user.id)
      .then((user: User | null) => {
        res.locals.user = user ? { ...user.toJSON(), role: user.Role } : null; // Ensure role is correctly mapped
        next();
      })
      .catch((error: Error) => {
        console.error("Error deserializing user:", error);
        res.status(500).json({ message: "Internal server error during user deserialization" });
      });
  } else {
    next();
  }
};
