"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleAuth = void 0;
const roleAuth = (allowedRoles) => {
    return (req, res, next) => {
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
exports.roleAuth = roleAuth;
