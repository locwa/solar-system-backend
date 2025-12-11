import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import sequelize from './config/database';
import authRouter from './routes/authRoutes';
import planetRouter from './routes/planetRoutes';
import citizenRouter from './routes/citizenRoutes';

const app = express();

const allowedOrigins = [
  "https://solar-system-frontend-production.up.railway.app",
  "https://solar-system-frontend-production-7a99.up.railway.app",
  "solar-system-frontend-production.up.railway.app",
  "solar-system-frontend-production-7a99.up.railway.app",
  "http://localhost:5000",
  "http://0.0.0.0:5000"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle all OPTIONS requests (important for Railway)
app.options("*", cors());

app.use(express.json());

app.use(session({
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

app.use('/api/auth', authRouter);
app.use('/api', planetRouter);
app.use('/api', citizenRouter);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}).catch((err: Error) => {
  console.error("Database connection failed:", err.message);
});