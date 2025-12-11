"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const planetRoutes_1 = __importDefault(require("./routes/planetRoutes"));
const citizenRoutes_1 = __importDefault(require("./routes/citizenRoutes"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const pg_1 = __importDefault(require("pg"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const app = (0, express_1.default)();
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5000', 'http://0.0.0.0:5000'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express_1.default.json());
const pool = new pg_1.default.Pool({
    connectionString: process.env.DATABASE_URL,
});
const PgStore = (0, connect_pg_simple_1.default)(express_session_1.default);
app.use((0, express_session_1.default)({
    store: new PgStore({
        pool, // <-- reuse global pool
        tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET || 'solar-system-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));
app.use('/api/auth', authRoutes_1.default);
app.use('/api', planetRoutes_1.default);
app.use('/api', citizenRoutes_1.default);
const PORT = process.env.BACKEND_PORT || 3000;
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
exports.default = (0, serverless_http_1.default)(app);
