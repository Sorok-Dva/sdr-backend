import express, { Request, Response } from 'express'
import { Op } from 'sequelize'
import { slugify } from '../helpers/helpers'
import {
  authenticateOptionalToken,
  authenticateToken,
} from '../middleware/auth'
import { Upvote, Tutorial, User } from '../models'

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

tutorialRouter.post('/:id/upvote', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const tutorial = await Tutorial.findByPk(id)

    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found' })
    }

    const existingUpvote = await Upvote.findOne({
      where: { userId, tutorialId: id },
    })

    if (existingUpvote) {
      tutorial.upvote -= 1
      await tutorial.save()
      await existingUpvote.destroy()
      return res.status(200).json(tutorial)
    }

    await Upvote.create({ userId, tutorialId: parseInt(id, 10) })
    tutorial.upvote += 1
    await tutorial.save()
    res.status(200).json(tutorial)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to upvote tutorial' })
  }
})

tutorialRouter.get('/:id', authenticateOptionalToken, async (req: Request, res: Response) => {
  const { id } = req.params
  const tutorial = await Tutorial.findOne({
    where: {
      id,
      // validated: true,
      deletedAt: { [Op.is]: null },
    },
    include: {
      model: User,
      as: 'user',
      attributes: ['nickname', 'avatar'],
    },
  })

  if (!tutorial) return res.status(404).send('Tutorial not found.')

  tutorial.views += 1
  await tutorial.save()

  return res.json(tutorial)
})

export default tutorialRouter
