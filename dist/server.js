"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const database_1 = __importDefault(require("./config/database")); // Corrected import path
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const planetRoutes_1 = __importDefault(require("./routes/planetRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Enable session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set true if HTTPS
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/planets', planetRoutes_1.default);
database_1.default.sync().then(() => {
    console.log("Database synced");
    app.listen(4000, () => console.log("Server running on port 4000"));
});
