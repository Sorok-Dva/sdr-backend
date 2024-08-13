import { Router } from 'express'
import { adminUsersRouter } from './users'
import { adminReportsRouter } from './reports'
import adminHomeRouter from './home'

const adminRouter = Router()

adminRouter.use('/', adminHomeRouter)
adminRouter.use('/users', adminUsersRouter)
adminRouter.use('/reports', adminReportsRouter)

export default adminRouter
