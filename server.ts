import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import sequelize from './config/database';
import authRouter from './routes/authRoutes';
import planetRouter from './routes/planetRoutes';
import citizenRouter from './routes/citizenRoutes';
import pgSession from 'connect-pg-simple'
import pg from 'pg'
import serverless from 'serverless-http';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5000', 'http://0.0.0.0:5000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

if (process.env.DATABASE_URL) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    max: 5,
  });

  const PgStore = pgSession(session);
  app.use(session({
    store: new PgStore({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
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
} else {
  app.use(session({
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
}


app.use('/api/auth', authRouter);
app.use('/api', planetRouter);
app.use('/api', citizenRouter);

const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
