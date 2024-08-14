// import './sentry'
import express from 'express'
// import * as Sentry from '@sentry/node'
import { json } from 'body-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import authRouter from './routes/auth'
import dreamsRouter from './routes/dreams'
import adminRouter from './routes/admin'

dotenv.config()

const app = express()

app.use(helmet({
  crossOriginResourcePolicy: false,
}))
app.set('trust proxy', 1)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 250,
  message: 'Too many requests from this IP, please try again later.',
})
app.use(limiter)

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const sequelize = new Sequelize(process.env.DB_NAME || 'screen.me', process.env.DB_USER || 'username', process.env.DB_PASS || 'password', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
})

app.use('/api/admin', adminRouter)
app.use('/api/dreams', dreamsRouter)
app.use(authRouter)

// Sentry.setupExpressErrorHandler(app)

const start = async () : Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('Connected to MySQL and synced models')
    await sequelize.sync({ force: true })
    console.log('Database synchronized.')

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Listening on port ${process.env.PORT || 3000}`)
    })
  } catch (err) {
    console.error('Unable to connect to the database:', err)
  }
}

start()
