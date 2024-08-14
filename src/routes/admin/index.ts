import { Router } from 'express'
import { adminUsersRouter } from './users'
import { adminReportsRouter } from './reports'
import { adminTutorialsRouter } from './tutorials'
import adminHomeRouter from './home'

const adminRouter = Router()

adminRouter.use('/', adminHomeRouter)
adminRouter.use('/users', adminUsersRouter)
adminRouter.use('/reports', adminReportsRouter)
adminRouter.use('/tutorials', adminTutorialsRouter)

export default adminRouter
