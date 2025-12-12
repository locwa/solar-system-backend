"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireLogin = void 0;
const requireLogin = (req, res, next) => {
    if (!req.session.user)
        return res.status(401).json({ message: "Not logged in" });
    next();
};
exports.requireLogin = requireLogin;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.session.user)
            return res.status(401).json({ message: "Not logged in" });
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({ message: "Forbidden: insufficient role" });
        }
        next();
    };
};
exports.requireRole = requireRole;
