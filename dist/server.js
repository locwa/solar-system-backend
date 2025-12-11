"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const planetRoutes_1 = __importDefault(require("./routes/planetRoutes"));
const citizenRoutes_1 = __importDefault(require("./routes/citizenRoutes"));
const app = (0, express_1.default)();
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['https://solar-system-frontend-production.up.railway.app'];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    else if (!process.env.FRONTEND_URL) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'solar-system-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production", // true on Railway
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use('/api/auth', authRoutes_1.default);
app.use('/api', planetRoutes_1.default);
app.use('/api', citizenRoutes_1.default);
const PORT = Number(process.env.PORT) || 5000;
database_1.default.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
}).catch((err) => {
    console.error("Database connection failed:", err.message);
});
