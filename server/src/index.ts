import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'
import session from 'express-session'
import passport from 'passport';
import cron from "node-cron";

import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js'
import authRouter from './routes/authRoutes.js'

import calculatePoints from './utils/calculatePoints.js';
import configurePassport from './config/passport.js';
import redisClient from './config/redis.js';
import { RedisStore } from 'connect-redis';
import globalErrorHandler from './utils/globalErrorHandler.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production'

app.set('trust proxy', 1)

// app settings
app.use(morgan(isProduction ? 'common' : 'dev'))
app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST']
}))
app.use(express.json())

// auth settings
app.use(session({
  store: new RedisStore({
    client: redisClient,
    prefix: "sess:"
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: true,
    sameSite: isProduction ? 'none': 'lax',
    domain: isProduction ? '.countersite.gg' : undefined,
    maxAge: 1000 * 60 * 60 * 24 * 20
  }
}))
app.use(passport.initialize())
app.use(passport.session())
configurePassport()

// cron job
cron.schedule("0 13 * * *", calculatePoints)
cron.schedule("0 17 * * *", calculatePoints)
cron.schedule("0 21 * * *", calculatePoints)
cron.schedule("0 0 * * *", calculatePoints)

// routers
app.use(userRouter)
app.use("/admin", adminRouter)
app.use("/auth", authRouter)

app.use(globalErrorHandler)

export default app;