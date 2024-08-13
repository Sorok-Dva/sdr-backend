import express, { Request, Response } from 'express'
import { Op, Sequelize } from 'sequelize'
import moment from 'moment'
import { Role, UserDream, User, Report } from '../../models'
import { authenticateToken, isAdmin } from '../../middleware/auth'

const adminHomeRouter = express.Router()

adminHomeRouter.use(authenticateToken)
adminHomeRouter.use(isAdmin)

interface UserRegistrationStats {
  date: string
  count: number
}

type LastTimeWindow = 'day' | 'week' | 'month' | 'year';

interface TimeWindowRequest extends Partial<Request> {
  params: {
    getLastTimeWindow: LastTimeWindow
  }
}

adminHomeRouter.post('/', async (req: TimeWindowRequest, res: Response) => {
  try {
    const { getLastTimeWindow } = req.body
    let startDate: Date
    const endDate = new Date()

    switch (getLastTimeWindow) {
      case 'day':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 1)
        break
      case 'week':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'year':
        startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
    }

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    // Users stats
    const totalUsersCount = await User.count()
    const newUsersCount = await User.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate] as [Date, Date],
        },
      },
    })
    const newUsersPercentage = (newUsersCount / totalUsersCount) * 100

    // UserDreams stats
    const totalUserDreamsCount = await UserDream.count()
    const newUserDreamsCount = await UserDream.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate] as [Date, Date],
        },
      },
    })
    const newUserDreamsPercentage = (newUserDreamsCount / totalUserDreamsCount) * 100

    // Public (privacy) screenshots stats
    const totalPublicUserDreamsCount = await UserDream.count({
      where: {
        privacy: 'public',
      },
    })
    const newPublicUserDreamsCount = await UserDream.count({
      where: {
        privacy: 'public',
        createdAt: {
          [Op.between]: [startDate, endDate] as [Date, Date],
        },
      },
    })
    const newPublicUserDreamsPercentage = (newPublicUserDreamsCount / totalPublicUserDreamsCount) * 100

    // Deleted screens stats
    const totalDeletedUserDreamsCount = await UserDream.count({
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    })
    const newDeletedUserDreamsCount = await UserDream.count({
      where: {
        deletedAt: {
          [Op.between]: [startDate, endDate] as [Date, Date],
        },
      },
    })
    const newDeletedUserDreamsPercentage = (newDeletedUserDreamsCount / totalDeletedUserDreamsCount) * 100

    return res.status(200).json({
      users: {
        total: totalUsersCount,
        new: newUsersCount,
        newPercentage: newUsersPercentage.toFixed(2),
      },
      screenshots: {
        total: totalUserDreamsCount,
        new: newUserDreamsCount,
        newPercentage: newUserDreamsPercentage.toFixed(2),
      },
      publicUserDreams: {
        total: totalPublicUserDreamsCount,
        new: newPublicUserDreamsCount,
        newPercentage: newPublicUserDreamsPercentage.toFixed(2),
      },
      deletedUserDreams: {
        total: totalDeletedUserDreamsCount,
        new: newDeletedUserDreamsCount,
        newPercentage: newDeletedUserDreamsPercentage.toFixed(2),
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Failed to retrieve admin home data' })
  }
})

adminHomeRouter.get('/charts/users', async (req: Request, res: Response) => {
  const timeframe = req.query.timeframe as 'day' | 'week' | 'month' | 'year'

  if (!['day', 'week', 'month', 'year'].includes(timeframe)) {
    return res.status(400).json({ error: 'Invalid timeframe' })
  }

  const now = moment()
  let startDate: Date
  let endDate: Date

  switch (timeframe) {
    case 'day':
      startDate = now.startOf('day').toDate()
      endDate = now.endOf('day').toDate()
      break
    case 'week':
      startDate = now.startOf('week').toDate()
      endDate = now.endOf('week').toDate()
      break
    case 'month':
      startDate = moment().subtract(30, 'days').startOf('day').toDate() // Last 30 days
      endDate = now.endOf('day').toDate()
      break
    case 'year':
      startDate = now.startOf('year').toDate()
      endDate = now.endOf('year').toDate()
      break
    default:
      startDate = now.startOf('day').toDate()
      endDate = now.endOf('day').toDate()
  }

  let dateFormat: string
  let period: moment.unitOfTime.DurationConstructor

  switch (timeframe) {
    case 'day':
      dateFormat = '%H:00'
      period = 'hour'
      break
    case 'week':
    case 'month':
      dateFormat = '%Y-%m-%d'
      period = 'day'
      break
    case 'year':
      dateFormat = '%Y-%m'
      period = 'month'
      break
    default:
      dateFormat = '%Y-%m-%d'
      period = 'day'
  }

  try {
    // @ts-ignore
    const users: { date: string; count: string }[] = await User.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat)],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat), 'ASC']],
      raw: true,
    })

    const result: UserRegistrationStats[] = []
    const currentDate = moment(startDate)

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      const dateStr = currentDate.format({
        day: 'HH:00',
        week: 'YYYY-MM-DD',
        month: 'YYYY-MM-DD',
        year: 'YYYY-MM',
      }[timeframe])

      const found = users.find(user => user.date === dateStr)
      result.push({
        date: dateStr,
        count: found ? parseInt(found.count, 10) : 0,
      })

      currentDate.add(1, period)
    }

    return res.status(200).json(result)
  } catch (err) {
    console.error('Failed to fetch user registration data', err)
    return res.status(500).json({ error: 'Failed to fetch user registration data' })
  }
})

adminHomeRouter.get('/charts/reports', async (req: Request, res: Response) => {
  const timeframe = req.query.timeframe as 'day' | 'week' | 'month' | 'year'

  if (!['day', 'week', 'month', 'year'].includes(timeframe)) {
    return res.status(400).json({ error: 'Invalid timeframe' })
  }

  const now = moment()
  let startDate: Date
  let endDate: Date

  switch (timeframe) {
    case 'day':
      startDate = now.startOf('day').toDate()
      endDate = now.endOf('day').toDate()
      break
    case 'week':
      startDate = now.startOf('week').toDate()
      endDate = now.endOf('week').toDate()
      break
    case 'month':
      startDate = moment().subtract(30, 'days').startOf('day').toDate() // Last 30 days
      endDate = now.endOf('day').toDate()
      break
    case 'year':
      startDate = now.startOf('year').toDate()
      endDate = now.endOf('year').toDate()
      break
    default:
      startDate = now.startOf('day').toDate()
      endDate = now.endOf('day').toDate()
  }

  let dateFormat: string
  let period: moment.unitOfTime.DurationConstructor

  switch (timeframe) {
    case 'day':
      dateFormat = '%H:00'
      period = 'hour'
      break
    case 'week':
    case 'month':
      dateFormat = '%Y-%m-%d'
      period = 'day'
      break
    case 'year':
      dateFormat = '%Y-%m'
      period = 'month'
      break
    default:
      dateFormat = '%Y-%m-%d'
      period = 'day'
  }

  try {
    // @ts-ignore
    const reports: { date: string; count: string }[] = await Report.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat)],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat), 'ASC']],
      raw: true,
    })

    const result: { date: string; count: number }[] = []
    const currentDate = moment(startDate)

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      const dateStr = currentDate.format({
        day: 'HH:00',
        week: 'YYYY-MM-DD',
        month: 'YYYY-MM-DD',
        year: 'YYYY-MM',
      }[timeframe])

      const found = reports.find(report => report.date === dateStr)
      result.push({
        date: dateStr,
        count: found ? parseInt(found.count, 10) : 0,
      })

      currentDate.add(1, period)
    }

    return res.status(200).json(result)
  } catch (err) {
    console.error('Failed to fetch report registration data', err)
    return res.status(500).json({ error: 'Failed to fetch report registration data' })
  }
})

adminHomeRouter.get('/roles', async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'name'],
    })
    return res.status(200).json(roles)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch roles' })
  }
})

adminHomeRouter.get('/navbar-data', async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const userCount = (await User.findAll({
      where: {
        deletedAt: {
          [Op.is]: null,
        },
      },
    })).length
    const reportCount = (await Report.findAll({
      where: {
        deletedAt: {
          [Op.is]: null,
        },
      },
    })).length

    return res.json({ totalUsers: userCount, totalReports: reportCount })
  } catch (error) {
    console.error('Error fetching navbar data:', error)
    res.status(500).json({ error: 'Failed to fetch total users' })
  }
})

export default adminHomeRouter
