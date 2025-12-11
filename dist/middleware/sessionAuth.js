"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = exports.authorizeGalacticLeader = exports.checkRole = exports.authenticateSession = void 0;
const User_1 = __importDefault(require("../models/User"));
const authenticateSession = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
exports.authenticateSession = authenticateSession;
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!res.locals.user || !roles.includes(res.locals.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
exports.checkRole = checkRole;
const authorizeGalacticLeader = async (req, res, next) => {
    if (res.locals.user && res.locals.user.isGalactic) {
        next();
    }
    else {
        res.status(403).json({ message: "Forbidden: Requires Galactic Leader role." });
    }
};
exports.authorizeGalacticLeader = authorizeGalacticLeader;
// Deserialize user from session (for passport-like scenarios or if needed for deeper user object)
const deserializeUser = (req, res, next) => {
    if (req.session.user && req.session.user.id) {
        User_1.default.findByPk(req.session.user.id)
            .then((user) => {
            res.locals.user = user ? { ...user.toJSON(), role: user.Role } : null; // Ensure role is correctly mapped
            next();
        })
            .catch((error) => {
            console.error("Error deserializing user:", error);
            res.status(500).json({ message: "Internal server error during user deserialization" });
        });
    }
    else {
        next();
    }
};
exports.deserializeUser = deserializeUser;
