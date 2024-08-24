import './sentry'
import express from 'express'
import * as Sentry from '@sentry/node'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import authRouter from './routes/auth'
import dreamsRouter from './routes/dreams'
import tutorialsRouter from './routes/tutorials'
import commentsRouter from './routes/comments'
import adminRouter from './routes/admin'
import levelsRouter from './routes/levels'
import notifRouter from './routes/notifications'
import { logger, Icon } from './lib'

dotenv.config()

const app = express()
const log = logger('server')

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
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json({ type: ['json', 'application/*+json'] }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const sequelize = new Sequelize(process.env.DB_NAME || 'screen.me', process.env.DB_USER || 'username', process.env.DB_PASS || 'password', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
})

app.use('/api/admin', adminRouter)
app.use('/api/dreams', dreamsRouter)
app.use('/api/tutorials', tutorialsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/levels', levelsRouter)
app.use('/api/notifications', notifRouter)
app.use(authRouter)

if (process.env.SENTRY_DSN) Sentry.setupExpressErrorHandler(app)

const start = async () : Promise<void> => {
  try {
    await sequelize.authenticate()
    log.info('Connected to MySQL and synced models')
    await sequelize.sync({ force: true })
    log.info('Database synchronized.')

    process.on('uncaughtException', e => { log.error(e); process.exit(1) })
    process.on('unhandledRejection', e => { log.error(e); process.exit(1) })

    app.listen(process.env.PORT || 3000, () => {
      const env = process.env.NODE_ENV
      const icon = env === 'PRODUCTION' ? Icon.Production : Icon.Development
      log.info(`${icon}  Server is running on port  ${process.env.PORT || 3000}`)
    })
  } catch (err) {
    log.error('Unable to connect to the database:', err)
  }
}

start()
