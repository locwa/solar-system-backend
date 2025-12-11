"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.register = exports.logout = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
// LOGIN WITH REGISTRATION
const login = async (req, res) => {
    const { Username, Password, rememberMe } = req.body;
    try {
        const user = await User_1.default.findOne({ where: { Username } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const match = await bcrypt_1.default.compare(Password, user.Password);
        if (!match)
            return res.status(401).json({ message: "Incorrect password" });
        req.session.user = {
            id: user.UserID,
            name: user.FullName,
            role: user.Role,
            isGalactic: user.Role === 'Galactic Leader'
        };
        // Remember me (7 days)
        if (rememberMe) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
        }
        else {
            req.session.cookie.expires = undefined;
        }
        res.json({
            message: "Login successful",
            user: req.session.user
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.login = login;
// CREATING A REGISTRATION FOR THE SOLAR SYSTEM
const logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully" });
    });
};
exports.logout = logout;
const register = async (req, res) => {
    const { Username, Password, FullName, Role } = req.body;
    try {
        const userExists = await User_1.default.findOne({ where: { Username } });
        if (userExists)
            return res.status(400).json({ message: "Username already taken" });
        const hashedPassword = await bcrypt_1.default.hash(Password, 10);
        const newUser = await User_1.default.create({
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.register = register;
// Get a list of all users (Galactic Leader only)
const listUsers = async (req, res) => {
    try {
        if (res.locals.user.role !== 'Galactic Leader') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const users = await User_1.default.findAll({
            attributes: ['UserID', 'Username', 'FullName', 'Role'], // Only return necessary user info
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listUsers = listUsers;
