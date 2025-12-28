import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'
import session from 'express-session'
import passport from 'passport';

import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js'
import authRouter from './routes/authRoutes.js'

import './cron/calculatePoints.js'
import configurePassport from './config/passport.js';

const app = express();

// app settings
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST']
}))
app.use(express.json())
app.use(helmet())

// auth settings
configurePassport()
app.use(passport.initialize())
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.session())

// routers
app.use(userRouter)
app.use(adminRouter)
app.use(authRouter)

export default app;