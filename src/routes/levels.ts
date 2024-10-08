import express, { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Level } from '../models'

const levelsRouter = express.Router()

levelsRouter.get('/next', async (req: Request, res: Response) => {
  const { currentPoints } = req.query

  if (!currentPoints || Number.isNaN(Number(currentPoints))) {
    return res.status(400).json({ error: 'Current points are required.' })
  }

  try {
    const nextLevel = await Level.findOne({
      where: {
        pointsRequired: {
          [Op.gt]: Number(currentPoints),
        },
      },
      order: [['pointsRequired', 'ASC']],
      attributes: ['id', 'level', 'pointsRequired', 'title'],
    })

    if (!nextLevel) {
      return res.status(404).json({ message: 'You have reached the highest level.' })
    }

    const actualLevel = await Level.findOne({
      where: {
        level: nextLevel.level - 1,
      },
    })

    return res.json({ ...nextLevel.dataValues, lastTitle: actualLevel?.title })
  } catch (error) {
    console.error('Error fetching next level:', error)
    return res.status(500).json({ error: 'Failed to fetch the next level.' })
  }
})

export default levelsRouter
