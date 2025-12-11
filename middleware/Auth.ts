export const requireLogin = (req : any, res: any, next: any) => {
    if (!req.session.user) return res.status(401).json({ message: "Not logged in" });
    next();
  };
  
  export const requireRole = (...roles: string[]) => {
    return (req : any, res : any, next: any) => {
      if (!req.session.user) return res.status(401).json({ message: "Not logged in" });
  
      if (!roles.includes(req.session.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
  
      next();
    };
  };
  