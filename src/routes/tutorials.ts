import express, { Request, Response } from 'express'
import { col, fn, literal, Op, Order, Sequelize } from 'sequelize'
import { slugify } from '../helpers/helpers'
import {
  authenticateOptionalToken,
  authenticateToken, isAdmin,
} from '../middleware/auth'
import { Upvote, Comment, Tutorial, User, Category } from '../models'
import { logger } from '../lib'
import addPointsToUser from '../utils/addPointsToUser'
import game from '../../config/game.json'

const log = logger('tutorials')

const tutorialRouter = express.Router()

tutorialRouter.get('/', authenticateOptionalToken, async (req: Request, res: Response) => {
  try {
    const { type = null } = req.query

    let order: Order

    switch (type) {
      case 'mostViewed':
        order = [['views', 'DESC']]
        break
      case 'mostLiked':
        order = [[fn('COUNT', col('upvotes.id')), 'DESC']]
        break
      default:
        order = [['createdAt', 'DESC']]
        break
    }

    const tutorials = await Tutorial.findAll({
      where: {
        validated: true,
        deletedAt: { [Op.is]: null },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname', 'avatar'],
        },
        {
          model: Comment,
          as: 'comments',
          attributes: [],
        },
        {
          model: Upvote,
          as: 'upvotes',
          attributes: [],
          where: {
            deletedAt: { [Op.is]: null },
          },
          required: false,
        },
      ],
      attributes: {
        include: [
          [fn('COUNT', col('comments.id')), 'commentCount'],
          [fn('COUNT', col('upvotes.id')), 'upvoteCount'],
        ],
      },
      group: ['Tutorial.id', 'user.id'],
      order,
    })

    return res.json(tutorials)
  } catch (error) {
    log.error('Failed to fetch tutorials:', error)
    return res.status(500).json({ error: 'Failed to fetch tutorials' })
  }
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

tutorialRouter.get('/popular', authenticateOptionalToken, async (req, res) => {
  try {
    const popularTutorials = await Tutorial.findAll({
      where: {
        validated: true,
        deletedAt: { [Op.is]: null },
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['nickname', 'avatar'],
      },
      order: [
        [literal('views / (upvote + 1)'), 'DESC'], // Calculate ratio views/upvotes
      ],
      limit: 4,
    })

    res.json(popularTutorials)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular tutorials' })
  }
})

tutorialRouter.get('/latest', async (req, res) => {
  try {
    const latestTutorials = await Tutorial.findAll({
      where: {
        validated: true,
        deletedAt: { [Op.is]: null },
      },
      order: [['createdAt', 'DESC']],
      limit: 3,
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM comments AS comment
              WHERE
                comment.tutorialId = Tutorial.id
                AND comment.deletedAt IS NULL
            )`),
            'commentCount',
          ],
        ],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname', 'avatar'],
        },
      ],
    })

    res.json(latestTutorials)
  } catch (error) {
    log.error(error)
    res.status(500).json({ error: 'Failed to fetch latest tutorials' })
  }
})

tutorialRouter.get('/categories', authenticateToken, async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'title', 'description'],
    })
    return res.json(categories)
  } catch (error) {
    log.error(error)
    return res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

tutorialRouter.delete('/categories/:id', authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await Category.destroy({
      where: { id },
    })
    if (deleted) {
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Category not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

tutorialRouter.post('/categories', authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body

    const newCategory = await Category.create({ title, description })

    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' })
  }
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
      where: {
        userId,
        tutorialId: id,
        deletedAt: null,
      },
    })

    // remove upvote
    if (existingUpvote) {
      tutorial.upvote -= 1
      existingUpvote.deletedAt = new Date()
      await tutorial.save()
      await existingUpvote.save()
      return res.status(200).json(tutorial)
    }

    await Upvote.create({ userId, tutorialId: parseInt(id, 10) })
    tutorial.upvote += 1
    await tutorial.save()

    // gamification
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const votesTodayCount = await Upvote.count({
      where: {
        userId: req.user.id,
        createdAt: {
          [Op.gte]: today,
        },
      },
    })

    if (votesTodayCount < 10) {
      await addPointsToUser(req.user.id, game.actions.points.add.ADD_VOTE, {
        fromSystem: true,
        description: 'Vous avez voter pour un tutoriel',
      })
    }
    return res.status(200).json(tutorial)
  } catch (error) {
    log.error(error)
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
