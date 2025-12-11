import { Request, Response, NextFunction } from 'express';

export const roleAuth = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!allowedRoles.includes(user.Role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
