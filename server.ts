import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import sequelize from './config/database';
import authRouter from './routes/authRoutes';
import planetRouter from './routes/planetRoutes';
import citizenRouter from './routes/citizenRoutes';

const app = express();

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',') 
  : ['https://solar-system-frontend-production.up.railway.app'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!process.env.FRONTEND_URL) {
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

const PORT = Number(process.env.PORT) || 5000;

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
}).catch((err: Error) => {
  console.error("Database connection failed:", err.message);
});