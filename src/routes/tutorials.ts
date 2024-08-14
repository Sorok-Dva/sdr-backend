import express, { Request, Response } from 'express'
import { Op } from 'sequelize'
import { slugify } from '../helpers/helpers'
import {
  authenticateOptionalToken,
  authenticateToken,
} from '../middleware/auth'
import { Tutorial } from '../models'

const tutorialRouter = express.Router()

tutorialRouter.get('/', authenticateOptionalToken, async (req: Request, res: Response) => {
  const tutorials = await Tutorial.findAll({
    where: {
      // validated: true,
      deletedAt: { [Op.is]: null },
    },
  })
  return res.json(tutorials)
})

tutorialRouter.get('/top', authenticateToken, async (req: Request, res: Response) => {
  const tutorials = await Tutorial.findAll({
    where: {
      deletedAt: { [Op.is]: null },
    },
    attributes: ['id', 'title', 'views'],
    order: [['views', 'DESC']],
    limit: 2,
  })
  return res.json(tutorials.map(tutorial => ({
    ...tutorial.dataValues,
    slug: slugify(tutorial.title),
  })))
})

tutorialRouter.get('/:id', authenticateOptionalToken, async (req: Request, res: Response) => {
  const tutorial = await Tutorial.findOne({
    where: {
      // validated: true,
      deletedAt: { [Op.is]: null },
    },
  })

  if (tutorial) {
    tutorial.views += 1
    await tutorial.save()
  }

  return res.json(tutorial)
})

export default tutorialRouter
