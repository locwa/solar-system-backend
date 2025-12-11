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

app.use((req : any, res : any, next : any) => {
  res.header("Access-Control-Allow-Origin", "https://solar-system-frontend-production.up.railway.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(cors({
  origin: ['http://localhost:5000', 'http://0.0.0.0:5000', 'https://solar-system-frontend-production.up.railway.app'],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'solar-system-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'none'
  }
}));

app.use('/api/auth', authRouter);
app.use('/api', planetRouter);
app.use('/api', citizenRouter);

const PORT = 3000;

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
}).catch((err: Error) => {
  console.error("Database connection failed:", err.message);
});
