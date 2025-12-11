import { Request, Response } from "express";
import bcrypt from "bcrypt";
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

// LOGIN WITH REGISTRATION

export const login = async (req: Request, res: Response) => {
    const { Username, Password, rememberMe } = req.body;

    try {
      const user = await User.findOne({ where: { Username } });
      if (!user) return res.status(404).json({ message: "User not found" });

      const match = await bcrypt.compare(Password, user.Password);
      if (!match) return res.status(401).json({ message: "Incorrect password" });

      req.session.user = {
        id: user.UserID,
        name: user.FullName,
        role: user.Role,
        isGalactic: user.Role === 'Galactic Leader'
      };

      // Remember me (7 days)
      if (rememberMe) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
      } else {
        req.session.cookie.expires = undefined;
      }

      res.json({
        message: "Login successful",
        user: req.session.user
      });

    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };


// CREATING A REGISTRATION FOR THE SOLAR SYSTEM

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
};

export const register = async (req: Request, res: Response) => {
    const { Username, Password, FullName, Role } = req.body;

    try {
      const userExists = await User.findOne({ where: { Username } });
      if (userExists) return res.status(400).json({ message: "Username already taken" });

      const hashedPassword = await bcrypt.hash(Password, 10);

      const newUser = await User.create({
        Username,
        Password: hashedPassword,
        FullName,
        Role,
        // Role is already set
      });

      res.json({
        message: "User registered successfully",
        user: {
          id: newUser.UserID,
          username: newUser.Username,
          role: newUser.Role
        }
      });

    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

// Get a list of all users (Galactic Leader only)
export const listUsers = async (req: Request, res: Response) => {
  try {
    if (res.locals.user.role !== 'Galactic Leader') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const users = await User.findAll({
      attributes: ['UserID', 'Username', 'FullName', 'Role'], // Only return necessary user info
    });
    res.json(users);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};
