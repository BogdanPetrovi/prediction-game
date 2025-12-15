import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'

import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js'

const app = express();

app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:3000',
}))
app.use(express.json())
app.use(helmet())

app.use(userRouter)
app.use(adminRouter)

export default app;