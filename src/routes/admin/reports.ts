import express, { Request, Response } from 'express'
import { QueryTypes } from 'sequelize'
import { Report, UserDream, sequelize } from '../../models'
import { authenticateToken, isAdmin } from '../../middleware/auth'

const router = express.Router()

router.use(authenticateToken)
router.use(isAdmin)

router.get('/', async (req : Request, res : Response) => {
  try {
    const reports = await sequelize.query(
      `
      SELECT
        r.userDreamId,
        MIN(r.createdAt) AS earliestReportDate,
        COUNT(r.id) AS reportCount,
        u.nickname AS reportedBy,
        u.id AS reportedById
      FROM reports r
      JOIN userDreams ud ON r.userDreamId = ud.id
      JOIN users u ON ud.userId = u.id
      WHERE r.deletedAt IS NULL
      GROUP BY r.userDreamId, u.nickname, u.id
      ORDER BY earliestReportDate DESC;
      `,
      {
        type: QueryTypes.SELECT,
      },
    )

    return res.status(200).json(reports)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Failed to fetch reports' })
  }
})

router.get('/:userDreamId/details', async (req : Request, res : Response) => {
  try {
    const { userDreamId } = req.params

    const userDream = await UserDream.findByPk(userDreamId)

    if (!userDream) {
      return res.status(404).send('UserDreams not found.')
    }

    const reportDetails = await sequelize.query(
      `
      SELECT
        r.reason,
        r.createdAt,
        u.nickname AS reportedBy
      FROM reports r
      JOIN users u ON r.userId = u.id
      WHERE r.userDreamId = :userDreamId AND r.deletedAt IS NULL
      ORDER BY r.createdAt DESC;
      `,
      {
        replacements: { userDreamId: userDream.id },
        type: QueryTypes.SELECT,
      },
    )

    const reasonCount = reportDetails.reduce((acc : Record<string, number>, report : any) => {
      acc[report.reason] = (acc[report.reason] || 0) + 1
      return acc
    }, {})

    const mostInvokedReason = Object.keys(reasonCount).reduce((a, b) => (reasonCount[a] > reasonCount[b] ? a : b))

    return res.json({
      mostInvokedReason,
      reportDetails,
      userDream,
    })
  } catch (error) {
    console.error('Error fetching report details:', error)
    return res.status(500).json({ error: 'Failed to fetch report details' })
  }
})

router.patch('/:userDreamId/resolve', async (req : Request, res : Response) => {
  try {
    const { userDreamId } = req.params

    const [affectedRows] = await Report.update(
      { status: 'Resolved', deletedAt: new Date(), adminId: req.user.id },
      {
        where: { userDreamId: Number(userDreamId) },
      },
    )

    if (affectedRows > 0) {
      res.status(200).json({
        message: 'Reports resolved successfully.',
        affectedRows,
      })
    } else {
      res.status(404).json({ error: 'No reports found for the given userDreamId.' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve reports.' })
  }
})

router.delete('/:userDreamId', async (req, res) => {
  const { userDreamId } = req.params
  const { solvedReason } = req.body

  try {
    const userDream = await UserDream.findByPk(userDreamId)

    if (!userDream) {
      return res.status(404).json({ error: 'Dream not found' })
    }

    userDream.deletedAt = new Date()
    await userDream.save()

    const [affectedRows] = await Report.update(
      {
        status: 'Resolved',
        solvedReason,
        adminId: req.user.id,
        deletedAt: new Date(),
      },
      { where: { userDreamId } },
    )

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No reports found for the given userDreamId.' })
    }

    res.status(200).json({
      message: 'Dream deleted and reports resolved successfully.',
      affectedRows,
    })
  } catch (error : any) {
    console.error('Error deleting userDream and resolving reports:', error)
    res.status(500).json({
      error: 'Failed to delete userDream and resolve reports.',
      details: error.message,
    })
  }
})

router.delete('/:id', async (req : Request, res : Response) => {
  try {
    const report = await Report.findByPk(req.params.id)
    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }
    report.deletedAt = new Date()
    report.adminId = req.user.id
    await report.save()

    return res.status(204).send()
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete report' })
  }
})

export { router as adminReportsRouter }
